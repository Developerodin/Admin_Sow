import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState, useCallback, useMemo } from "react";


import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_url } from "../../Config/BaseUrl";
import { ServerPaginatedTable } from "../../TabelComponents/ServerPaginatedTable";
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
      } else {
        const parsedDay = new Date(`${parsedDate}T12:00:00`);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        if (parsedDay > todayEnd) {
          issuesForRow.push({
            field: "Date",
            expected: "Today or a past date",
            received: dateRaw,
            issue: "Future date — live rates sort by date; use today or the actual rate date",
          });
        }
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
  {name:"Select"},
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

const getEntryKey = (mandiRatesDocId, priceEntryId) =>
  `${mandiRatesDocId}:${priceEntryId}`;

export const MarketRates = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All"); // State to store the selected state
  const [apiData, setApiData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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
  const [selectedEntries, setSelectedEntries] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [tablePage, setTablePage] = useState(0);
  const [tableRowsPerPage, setTableRowsPerPage] = useState(50);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableTotal, setTableTotal] = useState(0);

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
  }, [update]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setTablePage(0);
    setTableTotal(0);
    setSelectedEntries(new Set());
  }, [debouncedSearch, selectedState, fromDate, toDate]);

  useEffect(() => {
    const controller = new AbortController();

    const loadAdminTableData = async () => {
      setTableLoading(true);
      try {
        const params = {
          page: tablePage + 1,
          limit: tableRowsPerPage,
          sortBy: "date",
          sortOrder: "desc",
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedState && selectedState !== "All") params.state = selectedState;
        if (fromDate && toDate) {
          params.fromDate = fromDate;
          params.toDate = toDate;
        }

        const response = await axios.get(`${Base_url}mandiRates/admin-table`, {
          params,
          signal: controller.signal,
        });
        const { rows, pagination } = response.data;

        const mapped = (rows || []).map((r) => ({
          Sno: r.sno,
          date: r.date,
          Time: r.time,
          State: r.state,
          City: r.city,
          "Mandi Name": r.mandiName,
          Category: r.category,
          SubCategory: r.subCategory,
          categoryRaw: r.category,
          subCategoryRaw: r.subCategory,
          mandiRatesDocId: r.mandiRatesDocId,
          priceEntryId: r.priceEntryId,
          Price: r.price,
          "Price Difference": r.priceDifference,
          Unit: r.unit,
          mandiId: r.mandiId,
        }));

        setMarketData(mapped);
        setTableTotal(pagination?.total ?? 0);
      } catch (error) {
        if (controller.signal.aborted || error.code === "ERR_CANCELED") {
          return;
        }
        console.error("Error fetching admin table data:", error);
        setMarketData([]);
        setTableTotal(0);
      } finally {
        if (!controller.signal.aborted) {
          setTableLoading(false);
        }
      }
    };

    loadAdminTableData();

    return () => {
      controller.abort();
    };
  }, [
    tablePage,
    tableRowsPerPage,
    debouncedSearch,
    selectedState,
    fromDate,
    toDate,
    update,
  ]);

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
    setSelectedState(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedState("All");
    setFromDate("");
    setToDate("");
    setTablePage(0);
    setSelectedEntries(new Set());
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    (selectedState && selectedState !== "All") ||
    Boolean(fromDate) ||
    Boolean(toDate);

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

  const handleExportTemplate = () => {
    const dataToExport = [];
    
    const exportDate = selectedDate || new Date().toISOString().split('T')[0];
    const exportTime = selectedTime || "10:00";
    
    const convertTo12Hour = (time24) => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
    
    const formattedTime = convertTo12Hour(exportTime);

    const groupKey = (item) => `${item.Category || item.category || ''}|${item["Sub Category"] || item.SubCategory || item.subCategory || ''}`;
    let grouped = {};
    const dataSource = [];
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
    dataSource.forEach((item) => {
      const key = groupKey(item);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
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
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 8 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Market Rates");
    XLSX.writeFile(workbook, "MarketRates_Template.xlsx");
  };

  const handleExportRates = async () => {
    try {
      const params = { sortBy: "date", sortOrder: "desc" };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedState && selectedState !== "All") params.state = selectedState;
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }

      const response = await axios.get(`${Base_url}mandiRates/admin-table/export`, { params });
      const exportRows = response.data.rows || [];

      if (exportRows.length === 0) {
        alert("No rates match the current filters.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 12 },
        { wch: 20 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 8 },
        { wch: 14 },
        { wch: 14 },
        { wch: 16 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Market Rates");
      XLSX.writeFile(workbook, "MarketRates_Export.xlsx");
    } catch (error) {
      alert(
        "Failed to export rates: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleExport = () => {
    if (hasActiveFilters) {
      handleExportRates();
    } else {
      handleExportTemplate();
    }
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

      const handleDelete = useCallback(
        async (mandiRatesDocId, priceEntryId, category, subCategoryRaw) => {
          if (!mandiRatesDocId || !priceEntryId) {
            alert("Missing required information to delete this price.");
            return;
          }

          const subLabel =
            subCategoryRaw == null || subCategoryRaw === ""
              ? "(no sub-category)"
              : subCategoryRaw;

          const confirmDelete = window.confirm(
            `Are you sure you want to delete the price for ${category} - ${subLabel}?`
          );

          if (!confirmDelete) {
            return;
          }

          try {
            const response = await axios.delete(
              `${Base_url}mandiRates/prices/${mandiRatesDocId}/${priceEntryId}`
            );

            if (response.status === 200) {
              setSelectedEntries((prev) => {
                const next = new Set(prev);
                next.delete(getEntryKey(mandiRatesDocId, priceEntryId));
                return next;
              });
              setUpdate((prev) => prev + 1);
            }
          } catch (error) {
            console.error("Error deleting price:", error);
            alert(
              "Failed to delete price: " +
                (error.response?.data?.message || error.message)
            );
          }
        },
        []
      );

      const toggleEntrySelection = useCallback((mandiRatesDocId, priceEntryId) => {
        if (!mandiRatesDocId || !priceEntryId) return;
        const key = getEntryKey(mandiRatesDocId, priceEntryId);
        setSelectedEntries((prev) => {
          const next = new Set(prev);
          if (next.has(key)) {
            next.delete(key);
          } else {
            next.add(key);
          }
          return next;
        });
      }, []);

      const handleBulkDelete = useCallback(async () => {
        if (selectedEntries.size === 0) {
          alert("Select at least one price entry to delete.");
          return;
        }

        const confirmDelete = window.confirm(
          `Are you sure you want to delete ${selectedEntries.size} selected price entries? This removes only those rows, not entire categories or mandi records.`
        );

        if (!confirmDelete) {
          return;
        }

        const entries = Array.from(selectedEntries).map((key) => {
          const [documentId, priceEntryId] = key.split(":");
          return { documentId, priceEntryId };
        });

        setBulkDeleting(true);
        try {
          const response = await axios.post(
            `${Base_url}mandiRates/prices/bulk-delete`,
            { entries }
          );

          if (response.status === 200) {
            const deletedIds = new Set(response.data.deletedEntryIds || []);
            setSelectedEntries((prev) => {
              const next = new Set(prev);
              deletedIds.forEach((id) => {
                for (const key of prev) {
                  if (key.endsWith(`:${id}`)) next.delete(key);
                }
              });
              return next;
            });
            setUpdate((prev) => prev + 1);

            const notFoundCount = response.data.notFound?.length || 0;
            if (notFoundCount > 0) {
              alert(
                `Deleted ${response.data.deletedCount} entries. ${notFoundCount} could not be found.`
              );
            }
          }
        } catch (error) {
          console.error("Error bulk deleting prices:", error);
          alert(
            "Failed to delete selected prices: " +
              (error.response?.data?.message || error.message)
          );
        } finally {
          setBulkDeleting(false);
        }
      }, [selectedEntries]);

  const selectablePageRows = useMemo(
    () =>
      MarketData.filter(
        (item) => item.mandiRatesDocId && item.priceEntryId
      ),
    [MarketData]
  );

  const allPageSelected =
    selectablePageRows.length > 0 &&
    selectablePageRows.every((item) =>
      selectedEntries.has(getEntryKey(item.mandiRatesDocId, item.priceEntryId))
    );

  const somePageSelected =
    selectablePageRows.some((item) =>
      selectedEntries.has(getEntryKey(item.mandiRatesDocId, item.priceEntryId))
    ) && !allPageSelected;

  const toggleSelectAllPage = useCallback(() => {
    setSelectedEntries((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        selectablePageRows.forEach((item) => {
          next.delete(getEntryKey(item.mandiRatesDocId, item.priceEntryId));
        });
      } else {
        selectablePageRows.forEach((item) => {
          next.add(getEntryKey(item.mandiRatesDocId, item.priceEntryId));
        });
      }
      return next;
    });
  }, [allPageSelected, selectablePageRows]);

  const tableRangeStart = tableTotal === 0 ? 0 : tablePage * tableRowsPerPage + 1;
  const tableRangeEnd = Math.min((tablePage + 1) * tableRowsPerPage, tableTotal);

  const handleTablePageChange = (_event, newPage) => {
    setTablePage(newPage);
    setSelectedEntries(new Set());
  };

  const handleTableRowsPerPageChange = (event) => {
    setTableRowsPerPage(parseInt(event.target.value, 10));
    setTablePage(0);
    setSelectedEntries(new Set());
  };

  useEffect(() => {
    const columnNames = column.map(col => col.name);
    const columnToKeyMap = {
      "Date": "date",
      "Price Diffrence": "Price Difference",
    };
    
    const displayRows = MarketData.map((item) => {
      const displayRow = { _rowKey: item.priceEntryId };
      columnNames.forEach(colName => {
        if (colName === "Select") {
          const entryKey = getEntryKey(item.mandiRatesDocId, item.priceEntryId);
          displayRow[colName] = (
            <Checkbox
              checked={selectedEntries.has(entryKey)}
              onChange={() =>
                toggleEntrySelection(item.mandiRatesDocId, item.priceEntryId)
              }
              disabled={!item.mandiRatesDocId || !item.priceEntryId}
              inputProps={{ "aria-label": `Select ${item.Category} - ${item.SubCategory}` }}
            />
          );
        } else if (colName === "Action") {
          displayRow[colName] = (
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() =>
                handleDelete(
                  item.mandiRatesDocId,
                  item.priceEntryId,
                  item.categoryRaw,
                  item.subCategoryRaw
                )
              }
              disabled={!item.mandiRatesDocId || !item.priceEntryId}
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
    
    setRows(displayRows);
  }, [
    MarketData,
    handleDelete,
    selectedEntries,
    toggleEntrySelection,
  ]);
 

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
                  disabled={tableLoading}
                >
                  {hasActiveFilters ? "Download Rates" : "Download Template"}
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    style={{ marginRight: "10px" }}
                    onClick={handleExportTemplate}
                    disabled={tableLoading}
                  >
                    Download Template
                  </Button>
                )}
                <Button
                  variant="contained"
                  component="label"
                  style={{ marginRight: "10px" }}
                  disabled={tableLoading}
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
            >            </Box>

            <Box
              sx={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "left",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
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

              <Select
                value={selectedState}
                onChange={handleStateChange}
                size="small"
                displayEmpty
                sx={{ m: 1, minWidth: 180 }}
              >
                <MenuItem value="All">All States</MenuItem>
                {states.map((state, index) => (
                  <MenuItem key={index} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                type="date"
                label="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                size="small"
                sx={{ m: 1, width: 160 }}
                InputLabelProps={{ shrink: true }}
              />
              <Typography sx={{ mx: 0.5 }}>to</Typography>
              <TextField
                type="date"
                label="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                size="small"
                sx={{ m: 1, width: 160 }}
                InputLabelProps={{ shrink: true }}
              />

              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ m: 1, height: 40 }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          </Box>
      
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {tableLoading
                ? "Loading rates..."
                : tableTotal === 0
                ? "No rates found"
                : `Showing ${tableRangeStart}–${tableRangeEnd} of ${tableTotal.toLocaleString()} rates`}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              marginTop: "20px",
              height: "70vh",
              overflow: "auto",
            }}
          >
            {/* Bulk selection toolbar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: 2,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={allPageSelected}
                  indeterminate={somePageSelected}
                  onChange={toggleSelectAllPage}
                  disabled={selectablePageRows.length === 0 || tableLoading}
                  inputProps={{ "aria-label": "Select all rows on this page" }}
                />
                <Typography variant="body2">
                  Select all on this page ({selectablePageRows.length})
                </Typography>
              </Box>
              {selectedEntries.size > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {selectedEntries.size} selected
                </Typography>
              )}
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                disabled={selectedEntries.size === 0 || bulkDeleting || tableLoading}
              >
                {bulkDeleting ? "Deleting..." : "Delete Selected"}
              </Button>
            </Box>
            
            <ServerPaginatedTable
              rows={row}
              column={column}
              count={tableTotal}
              page={tablePage}
              rowsPerPage={tableRowsPerPage}
              onPageChange={handleTablePageChange}
              onRowsPerPageChange={handleTableRowsPerPageChange}
              loading={tableLoading}
              loadingMessage="Loading market rates..."
              emptyMessage={
                hasActiveFilters
                  ? "No rates match your filters. Try adjusting search or date range."
                  : "No market rates found."
              }
              rowKeyField="_rowKey"
            />
          </Box>
        </CardContent>
      </Card>
      <MarketRatesAIModal
        modalVisible={aiModalOpen}
        setModalVisible={setAiModalOpen}
        onSuccess={() => {
          setTablePage(0);
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
        onSuccess={() => {
          setTablePage(0);
          setUpdate((prev) => prev + 1);
        }}
      />
    </Box>
  );
};