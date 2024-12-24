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
import { Base_url, Base_url2 } from "../../Config/BaseUrl";

export const MarketRates = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(""); // State to store the selected state
  const [apiData, setApiData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [update, setUpdate] = useState(0);
  const [mandiData, setMandiData] = useState([]);
  const [filteredMandiData, setFilteredMandiData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangetabs = (event, newValue) => {
    setValue(newValue);
  };

  const getMandi = async () => {
    try {
      const response = await axios.get(`${Base_url2}mandi`);
      setMandiData(response.data);
      console.log("Mandis all", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch mandis:", error);
    }
  };

  useEffect(() => {
    getMandi();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Base_url}api/unifiedPinCode`);
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
    console.log('Getting SubCategories', categoryName);
    try {
      const response = await axios.post(`${Base_url2}subcategories/category`, {
        categoryName: categoryName
      });

      console.log("sub category data of selected category ==>", response.data);
      setSubCategoryData((prevData) => ({
        ...prevData,
        [categoryName]: response.data
      }));
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.log("Error getting subcategory ==>", error);
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
    let serialNumber = 1;
    filteredMandiData.forEach((mandi) => {
      mandi.categories.forEach((category) => {
        dataToExport.push({
          "Sr No": serialNumber++,
          State: mandi.state || "N/A",
          City: mandi.city || "N/A",
          "Mandi Name": mandi.mandiname || "N/A",
          Category: category || "N/A",
          "Sub Category": "N/A",
          Price: "N/A",
          "Price Difference": "N/A",
        });
        if (subCategoryData[category]) {
          subCategoryData[category].forEach((subCategory) => {
            dataToExport.push({
              "Sr No": serialNumber++,
              State: mandi.state || "N/A",
              City: mandi.city || "N/A",
              "Mandi Name": mandi.mandiname || "N/A",
              Category: category || "N/A",
              "Sub Category": subCategory.name || "N/A",
              Price: subCategory.price || "N/A",
              "Price Difference": subCategory.priceDifference || "N/A",
            });
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
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      const newMandiData = json.map((row) => ({
        state: row.State,
        city: row.City,
        mandiname: row["Mandi Name"],
        categories: [row.Category],
      }));
      setMandiData(newMandiData);
    };
    reader.readAsArrayBuffer(file);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedYear = year < 10 ? `0${year}` : year;

    return `${formattedDay}:${formattedMonth}:${formattedYear}`;
  }

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
                >
                  Upload Excel
                  <input
                    type="file"
                    hidden
                    onChange={handleImport}
                  />
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
          <Box>
            <InputLabel>State</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedState} // Use the selected state
              label="State"
              onChange={handleStateChange} // Handle state change
            >
              {states.map((state, index) => (
                <MenuItem key={index} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
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

            {/* Display the filtered mandi data in a table format */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr No</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Mandi Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Sub Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Price Difference</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    let serialNumber = 1;
                    return filteredMandiData.map((mandi) => (
                      mandi.categories.map((category, catIndex) => (
                        <React.Fragment key={`${mandi._id}-${catIndex}`}>
                          <TableRow>
                            <TableCell>{serialNumber++}</TableCell>
                            <TableCell>{mandi.state || "N/A"}</TableCell>
                            <TableCell>{mandi.city || "N/A"}</TableCell>
                            <TableCell>{mandi.mandiname || "N/A"}</TableCell>
                            <TableCell>{category || "N/A"}</TableCell>
                            <TableCell>{"N/A"}</TableCell>
                            <TableCell>{"N/A"}</TableCell>
                            <TableCell>{"N/A"}</TableCell>
                          </TableRow>
                          {subCategoryData[category] && subCategoryData[category].map((subCategory, subCatIndex) => (
                            <TableRow key={`${mandi._id}-${catIndex}-${subCatIndex}`}>
                              <TableCell>{serialNumber++}</TableCell>
                              <TableCell>{mandi.state || "N/A"}</TableCell>
                              <TableCell>{mandi.city || "N/A"}</TableCell>
                              <TableCell>{mandi.mandiname || "N/A"}</TableCell>
                              <TableCell>{category || "N/A"}</TableCell>
                              <TableCell>{subCategory.name || "N/A"}</TableCell>
                              <TableCell>{subCategory.price || "N/A"}</TableCell>
                              <TableCell>{subCategory.priceDifference || "N/A"}</TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))
                    ));
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};