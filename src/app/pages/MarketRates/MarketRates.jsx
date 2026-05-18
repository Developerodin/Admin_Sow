import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";


import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_url } from "../../Config/BaseUrl";
import { GenralTabel } from "../../TabelComponents/GenralTable";
import { MarketRatesAIModal } from "./MarketRatesAIModal";
import { ExcelValidationModal } from "./ExcelValidationModal";
import { ExcelUploadProgressModal } from "./ExcelUploadProgressModal";

// Excel template — must stay in sync with handleExport() and the AI modal's
// "Download Failed Rates Excel". Validation is performed against these headers
// in this exact order, case-sensitive, no extra spaces.
const EXCEL_HEADERS = ["Mandi Name", "Date", "Category", "Sub Category", "Time", "Price", "Unit"];

/**
 * Parse a value into a YYYY-MM-DD string. Returns null if the input cannot be
 * recognized as a date. Supports:
 *   YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, Excel serial number, JS Date string.
 */
const parseFlexibleDate = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s || s === "N/A") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    const [d, m, y] = s.split("-");
    return `${y}-${m}-${d}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${y}-${m}-${d}`;
  }
  const n = parseFloat(s);
  if (!Number.isNaN(n) && n > 0 && /^[\d.]+$/.test(s)) {
    const excelEpoch = new Date(1900, 0, 1);
    const ms = (n - 1) * 24 * 60 * 60 * 1000;
    const d = new Date(excelEpoch.getTime() + ms);
    if (!Number.isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return null;
};

/**
 * Parse a value into 12h "hh:mm AM/PM". Returns null if unrecognized.
 * Supports the existing format and Excel decimal time (0.0–1.0).
 */
const parseFlexibleTime = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  if (typeof value === "number" || (!Number.isNaN(parseFloat(value)) && String(value).trim() !== "")) {
    const n = parseFloat(value);
    if (!Number.isNaN(n) && n >= 0 && n < 1) {
      const total = Math.round(n * 24 * 60);
      let h = Math.floor(total / 60);
      const min = total % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm}`;
    }
  }
  const s = String(value).trim();
  if (!s || s === "N/A") return null;
  if (/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/.test(s)) {
    return s.toUpperCase().replace(/\s+/g, " ");
  }
  return null;
};

/**
 * Pre-flight validation of an uploaded workbook.
 * Collects ALL issues (file / column / row level) up front so the user sees
 * everything in one popup instead of one-by-one alerts.
 */
const validateExcelStructure = (workbook, mandiData) => {
  const fileIssues = [];
  const columnIssues = [];
  const rowIssues = [];
  let validRowsCount = 0;
  let totalRowsCount = 0;
  let normalizedRows = [];

  if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
    fileIssues.push({ issue: "Workbook contains no sheets" });
    return { fileIssues, columnIssues, rowIssues, validRowsCount, totalRowsCount, normalizedRows };
  }

  if (!Array.isArray(mandiData) || mandiData.length === 0) {
    fileIssues.push({
      issue:
        "Mandi list is not loaded yet. Wait a moment and re-upload, or reload the page if the issue persists.",
    });
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false,
  });

  if (rawRows.length === 0) {
    fileIssues.push({ issue: `Sheet "${sheetName}" is empty` });
    return { fileIssues, columnIssues, rowIssues, validRowsCount, totalRowsCount, normalizedRows };
  }

  if (rawRows.length === 1) {
    fileIssues.push({
      issue: `Sheet "${sheetName}" contains only the header row — no data rows to upload`,
    });
  }

  const rawHeaders = (rawRows[0] || []).map((h) => (h === null || h === undefined ? "" : String(h)));
  const trimmedHeaders = rawHeaders.map((h) => h.trim());

  // 1) Empty header cells
  rawHeaders.forEach((h, idx) => {
    if (!h || h.trim() === "") {
      columnIssues.push({
        column: `Column ${idx + 1}`,
        expected: "Non-empty header",
        received: "",
        issue: "Header cell is empty",
        severity: "error",
      });
    }
  });

  // 2) Extra leading/trailing whitespace in headers
  rawHeaders.forEach((h, idx) => {
    if (h && h !== h.trim()) {
      columnIssues.push({
        column: h.trim() || `Column ${idx + 1}`,
        expected: h.trim(),
        received: h,
        issue: "Extra spaces detected in column name",
        severity: "error",
      });
    }
  });

  // 3) Duplicate column headers
  const counts = {};
  trimmedHeaders.forEach((h) => {
    if (h) counts[h] = (counts[h] || 0) + 1;
  });
  Object.entries(counts).forEach(([h, c]) => {
    if (c > 1) {
      columnIssues.push({
        column: h,
        expected: "Single occurrence",
        received: `${c} occurrences`,
        issue: "Duplicate column header",
        severity: "error",
      });
    }
  });

  // 4) Missing required columns (with case-mismatch hint)
  EXCEL_HEADERS.forEach((expected) => {
    if (!trimmedHeaders.includes(expected)) {
      const fuzzy = trimmedHeaders.find((h) => h.toLowerCase() === expected.toLowerCase());
      if (fuzzy) {
        columnIssues.push({
          column: expected,
          expected,
          received: fuzzy,
          issue: `Column name case mismatch — expected "${expected}"`,
          severity: "error",
        });
      } else {
        columnIssues.push({
          column: expected,
          expected,
          received: "",
          issue: "Required column is missing",
          severity: "error",
        });
      }
    }
  });

  // 5) Unknown / extra columns (warning — will be ignored)
  trimmedHeaders.forEach((h) => {
    if (!h) return;
    if (EXCEL_HEADERS.includes(h)) return;
    // skip if it's a case-mismatch we've already flagged
    if (EXCEL_HEADERS.some((e) => e.toLowerCase() === h.toLowerCase())) return;
    columnIssues.push({
      column: h,
      expected: EXCEL_HEADERS.join(" | "),
      received: h,
      issue: "Unknown column — will be ignored during upload",
      severity: "warning",
    });
  });

  // If column-level errors exist, skip row-level validation (nothing to map to)
  const hasColumnErrors = columnIssues.some((c) => c.severity !== "warning");
  if (hasColumnErrors) {
    totalRowsCount = Math.max(rawRows.length - 1, 0);
    return { fileIssues, columnIssues, rowIssues, validRowsCount, totalRowsCount, normalizedRows };
  }

  // Map header → column index
  const headerIdx = {};
  trimmedHeaders.forEach((h, i) => {
    if (EXCEL_HEADERS.includes(h)) headerIdx[h] = i;
  });

  const dataRows = rawRows.slice(1);
  const mandiList = Array.isArray(mandiData) ? mandiData : [];

  dataRows.forEach((row, idx) => {
    const excelRowNumber = idx + 2; // header is row 1
    const isEmpty = (row || []).every((v) => v === "" || v === null || v === undefined);
    if (isEmpty) return;

    totalRowsCount += 1;

    const getCell = (col) => {
      const i = headerIdx[col];
      return i === undefined ? "" : row[i];
    };

    const mandiName = String(getCell("Mandi Name") ?? "").trim();
    const category = String(getCell("Category") ?? "").trim();
    const subCategory = String(getCell("Sub Category") ?? "").trim();
    const dateRaw = getCell("Date");
    const timeRaw = getCell("Time");
    const priceRaw = getCell("Price");
    const unitRaw = String(getCell("Unit") ?? "").trim();

    const issuesForRow = [];

    if (!mandiName) {
      issuesForRow.push({
        field: "Mandi Name",
        expected: "Non-empty",
        received: mandiName,
        issue: "Required field is empty",
      });
    }
    if (!category) {
      issuesForRow.push({
        field: "Category",
        expected: "Non-empty",
        received: category,
        issue: "Required field is empty",
      });
    }
    if (!subCategory) {
      issuesForRow.push({
        field: "Sub Category",
        expected: "Non-empty",
        received: subCategory,
        issue: "Required field is empty",
      });
    }

    // Price — must be a positive number
    let parsedPrice = null;
    if (priceRaw === "" || priceRaw === null || priceRaw === undefined) {
      issuesForRow.push({
        field: "Price",
        expected: "Positive number",
        received: priceRaw ?? "",
        issue: "Price is required",
      });
    } else {
      const n = Number(String(priceRaw).trim());
      if (Number.isNaN(n)) {
        issuesForRow.push({
          field: "Price",
          expected: "Positive number",
          received: priceRaw,
          issue: "Price is not a valid number",
        });
      } else if (n <= 0) {
        issuesForRow.push({
          field: "Price",
          expected: "Positive number (> 0)",
          received: priceRaw,
          issue: "Price must be greater than zero",
        });
      } else {
        parsedPrice = n;
      }
    }

    // Date — optional but must be recognizable when present
    let parsedDate = null;
    if (dateRaw !== "" && dateRaw !== null && dateRaw !== undefined) {
      parsedDate = parseFlexibleDate(dateRaw);
      if (!parsedDate) {
        issuesForRow.push({
          field: "Date",
          expected: "YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY or Excel date",
          received: dateRaw,
          issue: "Date format not recognized",
        });
      }
    }

    // Time — optional but must be recognizable
    let parsedTime = null;
    if (timeRaw !== "" && timeRaw !== null && timeRaw !== undefined) {
      parsedTime = parseFlexibleTime(timeRaw);
      if (!parsedTime) {
        issuesForRow.push({
          field: "Time",
          expected: "hh:mm AM/PM or Excel decimal time",
          received: timeRaw,
          issue: "Time format not recognized",
        });
      }
    }

    // Unit — backend only accepts Kg / Ton (case-sensitive)
    if (unitRaw && !["Kg", "Ton"].includes(unitRaw)) {
      const fuzzy = ["Kg", "Ton"].find((u) => u.toLowerCase() === unitRaw.toLowerCase());
      issuesForRow.push({
        field: "Unit",
        expected: 'Kg or Ton (case-sensitive)',
        received: unitRaw,
        issue: fuzzy
          ? `Case mismatch — use "${fuzzy}" exactly`
          : 'Unit must be exactly "Kg" or "Ton"',
      });
    }

    // Mandi Name + Category combination must exist in DB
    let mandiId = null;
    if (mandiName && category && mandiList.length > 0) {
      const match = mandiList.find(
        (m) =>
          (m.categories || []).some(
            (c) => (c || "").toLowerCase() === category.toLowerCase()
          ) && (m.mandiname || "").toLowerCase() === mandiName.toLowerCase()
      );
      if (!match) {
        issuesForRow.push({
          field: "Mandi Name + Category",
          expected: "Existing mandi that has this category",
          received: `${mandiName} / ${category}`,
          issue:
            "No mandi found with this Mandi Name + Category combination. Add the mandi/category in Mandi Rates first.",
        });
      } else {
        mandiId = match._id;
      }
    }

    if (issuesForRow.length > 0) {
      rowIssues.push({
        rowNumber: excelRowNumber,
        rowData: {
          "Mandi Name": mandiName,
          Category: category,
          "Sub Category": subCategory,
          Date: dateRaw,
          Time: timeRaw,
          Price: priceRaw,
          Unit: unitRaw,
        },
        issues: issuesForRow,
      });
    } else {
      validRowsCount += 1;
      normalizedRows.push({
        mandiId,
        category,
        subCategory,
        price: parsedPrice,
        date: parsedDate, // may be null → backend allows it
        time: parsedTime || "10:00 AM",
        unit: unitRaw || "Kg",
      });
    }
  });

  return { fileIssues, columnIssues, rowIssues, validRowsCount, totalRowsCount, normalizedRows };
};

const column = [
  {name:"Sno"},
  {name:"Date"},
  {name:"Time"},
  {name:"State"},
  {name:"City"},
  {name:"Mandi Name"},
  {name:"Category"},
  {name:"SubCategory"},
  {name:"Price"},
  {name:"Price Diffrence"},
  {name:"Unit"},
  {name:"Action"},
];

export const MarketRates = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All"); // State to store the selected state
  const [apiData, setApiData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [update, setUpdate] = useState(0);
  const [mandiData, setMandiData] = useState([]);
  const [filteredMandiData, setFilteredMandiData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValue] = useState(0);
  const [row,setRows] = useState([]);
  const [MarketData, setMarketData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [excelValidation, setExcelValidation] = useState({
    open: false,
    fileName: "",
    issues: null,
    validRowsCount: 0,
    totalRowsCount: 0,
    pendingValidRows: [],
  });
  const [uploadProgress, setUploadProgress] = useState({
    open: false,
    rows: [],
    fileName: "",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangetabs = (event, newValue) => {
    setValue(newValue);
  };

  const getMandi = async () => {
    try {
      const response = await axios.get(`${Base_url}mandi`);
      setMandiData(response.data);
      // console.log("Mandis all", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch mandis:", error);
    }
  };

  useEffect(() => {
    getMandi();
    getAllData();
  }, [update]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Base_url}unifiedPinCode`);
        setApiData(response.data.data);
        const uniqueStates = [
          ...new Set(response.data.data.map((item) => item.state_name)),
        ];
        setStates(uniqueStates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const filteredData = mandiData.filter(
        (mandi) => mandi.state === selectedState
      );
      setFilteredMandiData(filteredData);
    } else {
      setFilteredMandiData(mandiData);
    }
  }, [selectedState, mandiData]);

  const handleView = (id) => {
    navigate(`/market-rates-view/${id}`);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value); // Update the selected state
  };

  const getSubCategoriesByCategoryName = async (categoryName) => {
    // console.log('Getting SubCategories', categoryName);
    try {
      const response = await axios.post(`${Base_url}subcategories/category`, {
        categoryName: categoryName
      });

      console.log("sub category data of selected category ==>", response.data);
      setSubCategoryData((prevData) => ({
        ...prevData,
        [categoryName]: response.data
      }));
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      // console.log("Error getting subcategory ==>", error);
      setSubCategoryData((prevData) => ({
        ...prevData,
        [categoryName]: []
      }));
      setLoading(false); // Set loading to false if there is an error
      setError(true); // Set error to true if there is an error
    }
  };

  useEffect(() => {
    mandiData.forEach(mandi => {
      mandi.categories.forEach(category => {
        getSubCategoriesByCategoryName(category);
      });
    });
  }, [mandiData]);

  const handleExport = () => {
    const dataToExport = [];
    
    // Get default date and time if inputs are blank
    const exportDate = selectedDate || new Date().toISOString().split('T')[0];
    const exportTime = selectedTime || "10:00";
    
    // Convert 24-hour time to 12-hour format
    const convertTo12Hour = (time24) => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
    
    const formattedTime = convertTo12Hour(exportTime);

    // Group data by subcategory instead of mandi
    const groupKey = (item) => `${item.Category || item.category || ''}|${item["Sub Category"] || item.SubCategory || item.subCategory || ''}`;
    let grouped = {};
    let dataSource = row.length > 0 ? row : null;
    if (!dataSource) {
      // Build dataSource from mandiData and subCategoryData as before, but in the new column order
      dataSource = [];
      const filteredMandiForExport = selectedState && selectedState !== "All" 
        ? mandiData.filter(mandi => mandi.state === selectedState)
        : mandiData;
      filteredMandiForExport.forEach((mandi) => {
        mandi.categories.forEach((category) => {
          const subCategories = subCategoryData[category] || [];
          if (subCategories.length > 0) {
            subCategories.forEach((subCategory) => {
              dataSource.push({
                "Mandi Name": mandi.mandiname || "N/A",
                Date: exportDate,
                Category: category || "N/A",
                "Sub Category": subCategory.name || "N/A",
                Time: formattedTime,
                Price: 0,
                Unit: "Kg"
              });
            });
          } else {
            dataSource.push({
              "Mandi Name": mandi.mandiname || "N/A",
              Date: exportDate,
              Category: category || "N/A",
              "Sub Category": "N/A",
              Time: formattedTime,
              Price: 0,
              Unit: "Kg"
            });
          }
        });
      });
    }
    // Group rows by subcategory
    dataSource.forEach((item) => {
      const key = groupKey(item);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    // Export without Sr No, State, and City
    Object.keys(grouped).forEach((key) => {
      const rows = grouped[key];
      rows.forEach((item) => {
        dataToExport.push({
          "Mandi Name": item["Mandi Name"] || "N/A",
          Date: item.Date || item.date || exportDate,
          Category: item.Category || "N/A",
          "Sub Category": item["Sub Category"] || item.SubCategory || item.subCategory || "N/A",
          Time: item.Time || formattedTime,
          Price: item.Price || 0,
          Unit: item.Unit || "Kg"
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    // Set custom column widths (removed Sr No, State, and City columns)
    worksheet['!cols'] = [
      { wch: 20 }, // Mandi Name
      { wch: 12 }, // Date
      { wch: 20 }, // Category
      { wch: 20 }, // Sub Category
      { wch: 10 }, // Time
      { wch: 10 }, // Price
      { wch: 8 },  // Unit
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Market Rates");
    XLSX.writeFile(workbook, "MarketRates.xlsx");
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // 1) Pre-flight: validate ALL issues at once (file + columns + rows).
      //    This blocks the upload entirely if structural problems exist, and
      //    surfaces row-level problems with a per-row table so the user
      //    immediately sees what to fix instead of getting a vague alert.
      const validation = validateExcelStructure(workbook, mandiData);
      const hasAnyIssue =
        validation.fileIssues.length > 0 ||
        validation.columnIssues.length > 0 ||
        validation.rowIssues.length > 0;

      if (hasAnyIssue) {
        setExcelValidation({
          open: true,
          fileName: file.name,
          issues: {
            fileIssues: validation.fileIssues,
            columnIssues: validation.columnIssues,
            rowIssues: validation.rowIssues,
          },
          validRowsCount: validation.validRowsCount,
          totalRowsCount: validation.totalRowsCount,
          pendingValidRows: validation.normalizedRows,
        });
        return;
      }

      // 2) Clean file → proceed with the existing transform path (kept intact
      //    for backward compat / Excel date / time edge-cases).
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      // Function to format date to YYYY-MM-DD format
      const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "N/A") return selectedDate;
        
        const dateString = String(dateStr).trim();
        
        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }
        
        // If in DD-MM-YYYY format, convert to YYYY-MM-DD
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
          const [day, month, year] = dateString.split('-');
          return `${year}-${month}-${day}`;
        }
        
        // If in DD/MM/YYYY format, convert to YYYY-MM-DD
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
          const [day, month, year] = dateString.split('/');
          return `${year}-${month}-${day}`;
        }
        
        // Check if it's an Excel date serial number (number format)
        const dateNumber = parseFloat(dateString);
        if (!isNaN(dateNumber) && dateNumber > 0) {
          // Excel date serial numbers start from January 1, 1900
          // Convert Excel serial number to JavaScript Date
          const excelEpoch = new Date(1900, 0, 1); // January 1, 1900
          const millisecondsPerDay = 24 * 60 * 60 * 1000;
          const dateObj = new Date(excelEpoch.getTime() + (dateNumber - 1) * millisecondsPerDay);
          
          if (!isNaN(dateObj.getTime())) {
            return dateObj.toISOString().split('T')[0];
          }
        }
        
        // Try to parse as Date object (for other date formats)
        const dateObj = new Date(dateString);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString().split('T')[0];
        }
        
        // Default fallback
        return selectedDate;
      };

      // Transform the data into the required format with case-insensitive matching
      const transformedData = jsonData
        .map((row) => {
          // Trim + preserve for DB write; matching uses .toLowerCase() below
          const category = (row.Category != null ? String(row.Category) : '').trim();
          const subCategory = (row["Sub Category"] != null ? String(row["Sub Category"]) : '').trim();
          const mandiName = (row["Mandi Name"] != null ? String(row["Mandi Name"]) : '').trim();
          const price = row.Price || "0";
          const date = formatDate(row.Date);
          // Time conversion: handle Excel decimal time
          let time = row.Time;
          if (typeof time === 'number' || (!isNaN(time) && time !== null && time !== undefined && time !== '')) {
            // Excel time as decimal (e.g., 0.416666...)
            const excelTime = parseFloat(time);
            if (!isNaN(excelTime) && excelTime >= 0 && excelTime < 1) {
              const totalMinutes = Math.round(excelTime * 24 * 60);
              let hours = Math.floor(totalMinutes / 60);
              let minutes = totalMinutes % 60;
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              if (hours === 0) hours = 12;
              time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            }
          }
          if (!time || time === 'N/A') time = '10:00 AM';
          const unit = row.Unit || "Kg";
          
          // Case-insensitive mandi lookup by Mandi Name and Category only
          const mandi = mandiData.find((mandi) => 
            (mandi.categories || []).some(cat => (cat || '').toLowerCase() === (category || '').toLowerCase()) && 
            (mandi.mandiname || '').toLowerCase() === (mandiName || '').toLowerCase()
          );
          const mandiId = mandi ? mandi._id : "N/A";
          return {
            mandiId,
            category,
            subCategory,
            price,
            date,
            time,
            unit
          };
        })
        .filter(item => {
          // Convert price to number if possible
          const priceValue = typeof item.price === 'string' ? item.price.trim() : item.price;
          const priceNum = Number(priceValue);

          // Skip if price is not a valid number, is 0, or is blank/NA
          const isValidPrice = (
            priceValue !== '' &&
            priceValue !== null &&
            priceValue !== undefined &&
            priceValue.toString().toLowerCase() !== 'na' &&
            priceValue.toString().toLowerCase() !== 'n/a' &&
            !isNaN(priceNum) &&
            priceNum !== 0
          );

          // Skip rows where mandiId is "N/A" (no matching mandi found)
          const isValidMandi = item.mandiId !== "N/A";

          // If valid, also set price as a number
          if (isValidPrice && isValidMandi) item.price = priceNum;

          return isValidPrice && isValidMandi;
        });
  
      handleSaveAll(transformedData, file.name);
    };

    reader.readAsArrayBuffer(file);

    // Allow the same file to be re-selected after the user fixes issues.
    // Without this, the input's value stays set and onChange won't fire again
    // for the same filename.
    event.target.value = "";
  };

  /**
   * Called from ExcelValidationModal when the user explicitly chooses to
   * upload only the valid rows after seeing the issue list. Row-level errors
   * are skipped; structural / column errors block this path entirely.
   */
  const handleProceedWithValidRows = () => {
    const validRows = excelValidation.pendingValidRows || [];
    const fileName = excelValidation.fileName;
    setExcelValidation((prev) => ({ ...prev, open: false }));
    if (validRows.length === 0) return;
    handleSaveAll(validRows, fileName);
  };

  const handleCloseExcelValidation = () => {
    setExcelValidation((prev) => ({ ...prev, open: false }));
  };

  const handleCloseUploadProgress = () => {
    setUploadProgress({ open: false, rows: [], fileName: "" });
  };
      
      /**
       * Open the live upload progress modal — the modal performs the POST and
       * renders progress / success / partial / error states, plus a table of
       * any server-skipped rows. Replaces the old `alert()` flow so the user
       * no longer sees a stale browser alert after the validation modal closes.
       */
      const handleSaveAll = (changes, fileName = "") => {
        const validChanges = (changes || []).filter(
          (c) => c && c.mandiId && c.mandiId !== "N/A"
        );

        if (validChanges.length === 0) {
          // Re-open the validation modal in a final "nothing to upload" state
          // instead of using a native alert, so the messaging is consistent.
          setExcelValidation({
            open: true,
            fileName: fileName || "",
            issues: {
              fileIssues: [
                {
                  issue:
                    "No valid rows left to upload. Fix the issues listed previously and try again.",
                },
              ],
              columnIssues: [],
              rowIssues: [],
            },
            validRowsCount: 0,
            totalRowsCount: (changes || []).length,
            pendingValidRows: [],
          });
          return;
        }

        setUploadProgress({
          open: true,
          rows: validChanges,
          fileName: fileName || "",
        });
      };

      const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        let year = date.getFullYear();
        
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, '0');
        
        let amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 24-hour time to 12-hour
        
        return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
      };

      const handleDelete = useCallback(async (mandiId, category, subCategory) => {
        if (!mandiId || !category || !subCategory) {
          alert("Missing required information to delete this price.");
          return;
        }

        // Confirm deletion
        const confirmDelete = window.confirm(
          `Are you sure you want to delete the price for ${category} - ${subCategory}?`
        );

        if (!confirmDelete) {
          return;
        }

        try {
          // Encode category and subCategory for URL
          const encodedCategory = encodeURIComponent(category);
          const encodedSubCategory = encodeURIComponent(subCategory);
          
          const response = await axios.delete(
            `${Base_url}mandiRates/${mandiId}/${encodedCategory}/${encodedSubCategory}`
          );

          if (response.status === 200) {
            alert("Price deleted successfully!");
            setUpdate((prev) => prev + 1); // Refresh data
          }
        } catch (error) {
          console.error("Error deleting price:", error);
          alert("Failed to delete price: " + (error.response?.data?.message || error.message));
        }
      }, []);

  const getAllData = async () => {
    try {
      const response = await axios.get(`${Base_url}mandiRates`);
      const allData = response.data;
      console.log("get DAta ===>",allData);
      
      // Debug: Check for null mandi values
      const nullMandiItems = allData.filter(item => !item.mandi);
      if (nullMandiItems.length > 0) {
        console.warn("Found items with null mandi:", nullMandiItems.length);
      }
      const latestData = Object.values(
        allData.reduce((acc, curr) => {
          const mandi = curr.mandi;
          if (mandi && mandi._id) {
            const mandiId = mandi._id;
            if (
              !acc[mandiId] ||
              new Date(acc[mandiId].updatedAt) < new Date(curr.updatedAt)
            ) {
              acc[mandiId] = curr;
            }
          }
          return acc;
        }, {})
      );
      
      const filteredData = latestData.filter(
        (item) => item.mandi && item.mandi.mandiname
      );
      let globalSno = 1; // Global serial number counter
      const tableRows = filteredData.flatMap((item, index) => {
        // Check if categoryPrices exists and is an array
        if (!item.categoryPrices || !Array.isArray(item.categoryPrices)) {
          return [];
        }
        
        return item.categoryPrices.map((price, subIndex) => {
          // Format the date properly and handle invalid dates
          let formattedDate;
          try {
            const date = new Date(price.date);
            if (isNaN(date.getTime())) {
              // If date is invalid, use today's date as fallback
              formattedDate = new Date().toISOString().split('T')[0];
              console.warn("Invalid date found in database:", price.date, "using fallback date:", formattedDate);
            } else {
              formattedDate = date.toISOString().split('T')[0]; // This will give YYYY-MM-DD format
            }
          } catch (error) {
            formattedDate = new Date().toISOString().split('T')[0];
            console.warn("Error processing date:", price.date, "using fallback date:", formattedDate);
          }
          
          return {
            Sno: globalSno++, // Use global counter and increment
            date: formattedDate, // Use the formatted date
            Time: price.time || "N/A",
            State: item.mandi?.state || "N/A",
            City: item.mandi?.city || "N/A",
            "Mandi Name": item.mandi?.mandiname || "N/A",
            Category: price.category || "N/A",
            SubCategory: price.subCategory || "N/A",
            Price: price.price || 0,
            "Price Difference": price.priceDifference?.difference || 0,
            Unit: price.unit || "Kg",
            mandiId: item.mandi?._id || null,
            Action: null, // Will be set in useEffect for filtered data
          };
        });
      });
      
      console.log("Formatted Table Rows:", tableRows);
      setMarketData(tableRows);
      setRows(tableRows);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };


  useEffect(() => {
    let filteredData = [...MarketData]; // Start with all data
    
    // Apply state filter if selected
    if (selectedState && selectedState !== "All") {
      filteredData = filteredData.filter(item => item.State === selectedState);
    }
    
    // Apply date range filter if both dates are selected
    if (fromDate && toDate) {
      filteredData = filteredData.filter(item => {
        try {
          // Convert the item's date to start of day
          const itemDate = new Date(item.date);
          
          // Check if date is valid
          if (isNaN(itemDate.getTime())) {
            return false; // Skip invalid dates
          }
          
          // Set time to start of day for comparison
          const itemDateStart = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
          
          // Convert from and to dates to start and end of day
          const from = new Date(fromDate + 'T00:00:00');
          const to = new Date(toDate + 'T23:59:59.999');
          
          return itemDateStart >= from && itemDateStart <= to;
        } catch (error) {
          console.error("Error filtering date:", error, "for item:", item);
          return false;
        }
      });
    }
    
    // Apply search filter if search input is provided
    if (searchInput && searchInput.trim() !== "") {
      const searchTerm = searchInput.toLowerCase().trim();
      filteredData = filteredData.filter(item => 
        (item.State && item.State.toLowerCase().includes(searchTerm)) ||
        (item.City && item.City.toLowerCase().includes(searchTerm)) ||
        (item["Mandi Name"] && item["Mandi Name"].toLowerCase().includes(searchTerm)) ||
        (item.Category && item.Category.toLowerCase().includes(searchTerm)) ||
        (item.SubCategory && item.SubCategory.toLowerCase().includes(searchTerm))
      );
    }
    
    // Add delete button to each row and filter out mandiId from display
    const columnNames = column.map(col => col.name);
    // Map column names to actual data keys
    const columnToKeyMap = {
      "Date": "date",
      "Price Diffrence": "Price Difference",
    };
    
    filteredData = filteredData.map(item => {
      // Create a new object with only the columns we want to display
      const displayRow = {};
      columnNames.forEach(colName => {
        if (colName === "Action") {
          displayRow[colName] = (
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(item.mandiId, item.Category, item.SubCategory)}
              disabled={!item.mandiId || item.Category === "N/A" || item.SubCategory === "N/A"}
            >
              Delete
            </Button>
          );
        } else {
          // Use mapped key if exists, otherwise use column name as-is
          const dataKey = columnToKeyMap[colName] || colName;
          displayRow[colName] = item[dataKey];
        }
      });
      return displayRow;
    });
    
    setRows(filteredData);
  }, [selectedState, MarketData, fromDate, toDate, searchInput, handleDelete]);
 

  return (
    <Box>
      <Card sx={{ minHeight: "100vh" }}>
        <CardContent>
          <Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  style={{
                    fontSize: "40px",
                    fontWeight: 600,
                    fontFamily: "sans-serif",
                  }}
                >
                  Market Rates 
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  style={{ marginRight: "10px" }}
                  onClick={handleExport}
                >
                  Download Excel
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  style={{ marginRight: "10px" }}
                >
                  Upload Excel
                  <input
                    type="file"
                    hidden
                    onChange={handleImport}
                  />
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setAiModalOpen(true)}
                  sx={{ backgroundColor: "#65be34" }}
                >
                  Market Rates AI
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                marginTop: "20px",
              }}
            ></Box>

            <Box
              sx={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search"
                id="outlined-start-adornment"
                size="small"
                sx={{ m: 1, width: "250px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <Button
                variant="contained"
                style={{
                  marginLeft: "20px",
                  background: "black",
                  height: "33px",
                }}
                startIcon={<FilterListIcon />}
              >
                A-Z
              </Button>
            </Box>
          </Box>
      
          <Box style={{marginTop:20}}>
            <InputLabel>Select a State to download particular Excel</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedState}
              label="State"
              onChange={handleStateChange}
              style={{width:"260px"}}
            >
              <MenuItem value={"All"}>
                All
              </MenuItem>
              {states.map((state, index) => (
                <MenuItem key={index} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box style={{marginTop:20}}>
            <InputLabel>Filter by Date Range</InputLabel>
            <Box style={{display: 'flex', gap: '10px', alignItems: 'center',marginTop:20}}>
              <TextField
                type="date"
                label="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                size="small"
                style={{width: "200px"}}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: { paddingTop: '8px', paddingBottom: '8px' }
                }}
              />
              <Typography>to</Typography>
              <TextField
                type="date"
                label="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                size="small"
                style={{width: "200px"}}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: { paddingTop: '8px', paddingBottom: '8px' }
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              marginTop: "20px",
              height: "70vh",
              overflow: "auto",
            }}
          >
            {/* Display the selected state */}
            {selectedState && (
              <Typography variant="h6" sx={{ mt: 2 }}>
                Selected State: {selectedState}
              </Typography>
            )}
            
            <GenralTabel rows={row} column={column} />
          </Box>
        </CardContent>
      </Card>
      <MarketRatesAIModal
        modalVisible={aiModalOpen}
        setModalVisible={setAiModalOpen}
        onSuccess={() => {
          setUpdate((prev) => prev + 1);
        }}
      />
      <ExcelValidationModal
        open={excelValidation.open}
        fileName={excelValidation.fileName}
        issues={excelValidation.issues}
        validRowsCount={excelValidation.validRowsCount}
        totalRowsCount={excelValidation.totalRowsCount}
        onClose={handleCloseExcelValidation}
        onProceed={handleProceedWithValidRows}
      />
      <ExcelUploadProgressModal
        open={uploadProgress.open}
        rows={uploadProgress.rows}
        fileName={uploadProgress.fileName}
        onClose={handleCloseUploadProgress}
        onSuccess={() => setUpdate((prev) => prev + 1)}
      />
    </Box>
  );
};