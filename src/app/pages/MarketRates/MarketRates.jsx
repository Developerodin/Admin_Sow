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
import React, { useEffect, useState } from "react";


import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import * as XLSX from "xlsx";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_url } from "../../Config/BaseUrl";
import { GenralTabel } from "../../TabelComponents/GenralTable";

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

  const column=[
   {name:"Sno"},
   {name:"Date"},
   {name:"Time"},
   {name:"State"},
   {name:"City"},
   {name:"Category"},
   {name:"SubCategory"},
   {name:"Price"},
   {name:"Price Diffrence"},
]

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
    let serialNumber = 1; // Initialize serial number
    
    // Convert 24-hour time to 12-hour format
    const convertTo12Hour = (time24) => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
    
    const formattedTime = convertTo12Hour(selectedTime);
  
    filteredMandiData.forEach((mandi) => {
      mandi.categories.forEach((category, catIndex) => {
        const subcategories = subCategoryData[category]; // Fetch subcategories for the category
  
        // If subcategories exist, add each subcategory row to the export data
        if (subcategories && subcategories.length > 0) {
          subcategories.forEach((subCategory, subCatIndex) => {
            dataToExport.push({
              "Sr No": serialNumber++,
              State: mandi.state || "N/A",
              City: mandi.city || "N/A",
              "Mandi Name": mandi.mandiname || "N/A",
              Category: category || "N/A",
              "Sub Category": subCategory.name || "N/A",
              Price: subCategory.newPrice || 0,
              Date: selectedDate,
              Time: formattedTime,
            });
          });
        } else {
          // If no subcategories, add a single row for the category
          dataToExport.push({
            "Sr No": serialNumber++,
            State: mandi.state || "N/A",
            City: mandi.city || "N/A",
            "Mandi Name": mandi.mandiname || "N/A",
            Category: category || "N/A",
            "Sub Category": "N/A",
            Price: "0",
            Date: selectedDate,
            Time: formattedTime,
          });
        }
      });
    });
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Market Rates");
    XLSX.writeFile(workbook, "MarketRates.xlsx");
  };

  const handleImport = (event) => {
    console.log("handleImport ===>",event);
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
  
      // Get the first sheet's name and its content
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert the sheet into JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("jsonData ===>",jsonData);
  
      // Transform the data into the required format
      const transformedData = jsonData.map((row) => {
        const category = row.Category;
        const subCategory = row["Sub Category"];
        const price = row.Price || "0";
        const date = row.Date || selectedDate;
        const time = row.Time || "10:00 AM"; // Default time if not provided
        
        // Ensure time is in 12-hour format (API expects this format)
        const formatTime = (timeStr) => {
          if (!timeStr || timeStr === "N/A") return "10:00 AM";
          
          // Convert to string to ensure we can use string methods
          const timeString = String(timeStr).trim();
          
          // If already in 12-hour format, return as is
          if (timeString.includes('AM') || timeString.includes('PM')) {
            return timeString;
          }
          
          // Check if it's a decimal number (Excel time format)
          const timeNumber = parseFloat(timeString);
          if (!isNaN(timeNumber) && timeNumber >= 0 && timeNumber < 1) {
            // Convert Excel decimal time to hours and minutes
            const totalMinutes = Math.round(timeNumber * 24 * 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
          }
          
          // If in 24-hour format (with or without seconds), convert to 12-hour
          if (timeString.includes(':')) {
            const timeParts = timeString.split(':');
            const hours = parseInt(timeParts[0]);
            const minutes = timeParts[1];
            
            // Validate hours and minutes
            if (isNaN(hours) || hours < 0 || hours > 23) {
              return "10:00 AM"; // Default fallback for invalid hours
            }
            
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
          }
          
          return "10:00 AM"; // Default fallback
        };
  
        // Lookup mandiId based on the category
        const mandi = mandiData.find((mandi) => mandi.categories.includes(category) && mandi.state === selectedState);
        const mandiId = mandi ? mandi._id : "N/A";
  
        // Return the transformed object
        return {
          mandiId,
          category,
          subCategory,
          price,
          date,
          time: formatTime(time),
        };
      });
  
      handleSaveAll(transformedData);
    };
  
    reader.readAsArrayBuffer(file);
  };
      
      const handleSaveAll = async (changes) => {
        console.log("Saving changes", changes);
      
        if (changes.length === 0) {
          alert("No category prices to save.");
          return;
        }
      
        try {
          const result = await axios.post(
            `${Base_url}mandiRates/mandi-prices`,
            {
              mandiPrices: changes,
            }
          );

          // console.log("Category prices saved successfully:", result);
          setUpdate((prev)=>prev+1)
          if (result.status === 200) {
            alert("Category prices saved successfully.");
          }

        } catch (error) {
          console.error("Error saving category prices:", error);
          alert("Failed to save category prices.");
        }
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
      const tableRows = filteredData.flatMap((item, index) => {
        // Check if categoryPrices exists and is an array
        if (!item.categoryPrices || !Array.isArray(item.categoryPrices)) {
          return [];
        }
        
        return item.categoryPrices.map((price, subIndex) => {
          // Format the date properly
          const date = new Date(price.date);
          const formattedDate = date.toISOString().split('T')[0]; // This will give YYYY-MM-DD format
          
          return {
            Sno: subIndex + 1,
            date: formattedDate, // Use the formatted date
            Time: price.time || "N/A",
            State: item.mandi?.state || "N/A",
            City: item.mandi?.city || "N/A",
            Category: price.category || "N/A",
            SubCategory: price.subCategory || "N/A",
            Price: price.price || 0,
            "Price Difference": price.priceDifference?.difference || 0,
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
    if (selectedState && selectedState !== "All") {
      const filteredData = MarketData.filter(
        (mandi) => mandi.State === selectedState
      );
      console.log("filteredData ===>",filteredData);
      // Apply date range filter only if both dates are selected
      if (fromDate && toDate) {
      console.log("filteredData ===>",filteredData);
        const dateFilteredData = filteredData.filter(item => {
          // Convert the item's date to start of day in UTC
          const itemDate = new Date(item.date);
          const itemDateStart = new Date(Date.UTC(
            itemDate.getUTCFullYear(),
            itemDate.getUTCMonth(),
            itemDate.getUTCDate()
          ));

          // Convert from and to dates to start of day in UTC
          const from = new Date(fromDate + 'T00:00:00.000Z');
          const to = new Date(toDate + 'T23:59:59.999Z');

          return itemDateStart >= from && itemDateStart <= to;
        });

        
        setRows(dateFilteredData);
      } else {
        setRows(filteredData);
      }
    } else {
      // Apply only date range filter when no state is selected
      if (fromDate && toDate) {
        const dateFilteredData = MarketData.filter(item => {
          // Convert the item's date to start of day in UTC
          const itemDate = new Date(item.date);
          const itemDateStart = new Date(Date.UTC(
            itemDate.getUTCFullYear(),
            itemDate.getUTCMonth(),
            itemDate.getUTCDate()
          ));

          // Convert from and to dates to start of day in UTC
          const from = new Date(fromDate + 'T00:00:00.000Z');
          const to = new Date(toDate + 'T23:59:59.999Z');

          return itemDateStart >= from && itemDateStart <= to;
        });
        setRows(dateFilteredData);
      } else {
        setRows(MarketData);
      }
    }
  }, [selectedState, MarketData, fromDate, toDate]);
 

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
              {
                selectedState !== "All" && <Box>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ marginRight: "10px" }}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    style: { paddingTop: '8px', paddingBottom: '8px' }
                  }}
                />
                <TextField
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{ marginRight: "10px" }}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    style: { paddingTop: '8px', paddingBottom: '8px' }
                  }}
                />
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
                >
                  Upload Excel
                  <input
                    type="file"
                    hidden
                    onChange={handleImport}
                  />
                </Button>
              </Box>
              }
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

{
selectedState && selectedState !== "All" &&
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
}
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
    </Box>
  );
};