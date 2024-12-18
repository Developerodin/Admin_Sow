import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { Base_url, Base_url2 } from "../../Config/BaseUrl";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as XLSX from "xlsx";
import icon from "./trend.png";
import logo from "./scrap-img.jpeg";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';


export const MarketRatesView = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [prices, setPrices] = useState({});
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [open2, setOpen2] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);
const [selectedPrice, setSelectedPrice] = useState('');
const [update, setupdate] = useState(0);
  const getMandiById = async (id) => {
    try {
      const response = await axios.get(`${Base_url2}mandi/${id}`);
      setData(response.data);

      const initialPrices = response.data.categories.reduce((acc, category) => {
        acc[category] = "";
        return acc;
      }, {});
      setPrices(initialPrices);
    } catch (error) {
      console.error(`Failed to retrieve Mandi with ID ${id}:`, error);
    }
  };

  const handleGetMandiHistory = async () => {
    try {
      const response = await axios.get(
        `${Base_url2}mandiRates/history/mandi/${id}`
      );
      setHistory(response.data);
      setFilteredHistory(response.data);
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("Error fetching Mandi history:", error);
    }
  };

  useEffect(() => {
    getMandiById(id);
    handleGetMandiHistory();
  }, [id,update]);

  const handlePriceChange = (category, value) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [category]: value,
    }));
  };

    const handleUpdatePrice = async () => {
    const newPrice = selectedPrice.trim(); // Trim the price to remove any leading/trailing spaces
    if (!newPrice) {
      alert("Price cannot be empty.");
      return;
    }
  
    try {
      const response = await axios.patch(
        `${Base_url2}mandiRates/${id}/${selectedCategory}`,
        {
          newPrice,
        }
      );
  
      if (response.status === 200) {
        alert(`Price for ${selectedCategory} updated successfully.`);
        handleGetMandiHistory();
        handleClose(); // Close the modal after successful update
      } else {
        alert(`Failed to update price for ${selectedCategory}.`);
      }
    } catch (error) {
      console.error("Failed to save price:", error);
      alert(
        `Error updating price for ${selectedCategory}: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
  };


  const handleOpen = (category, price) => {
    setSelectedCategory(category);
    setSelectedPrice(price);
    setOpen2(true);
  };
  
  const handleClose = () => {
    setOpen2(false);
    setSelectedCategory(null);
    setSelectedPrice('');
  };

const handleDelete = async (category) => {

  try {
    await axios.delete(`${Base_url2}mandiRates/${id}/${category}`);
    handleGetMandiHistory();
    setupdate((prev)=>prev+1)
  } catch (error) {
    console.error('Error submitting plan details:', error);
  }
};


  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const filtered = history.filter((entry) => {
      
      const entryDate = new Date(entry.createdAt);
      
      return entryDate >= startDate && entryDate <= endDate;
    });
    console.log('filter data',filtered);

    setFilteredHistory(filtered);
  };
 

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const handleBackButton = () => {
    window.history.back();
  };

   const handleSaveAll = async () => {
    
    const categoryPrices = Object.entries(prices)
      .filter(([category, price]) => price.trim() !== "")
      .map(([category, price]) => ({
        category,
        price,
      }));
  
    if (categoryPrices.length === 0) {
      alert("No category prices to save.");
      return;
    }
  
    try {
      const result = await axios.post(
        `${Base_url2}mandiRates`,
        {
          mandi: id,
          categoryPrices,
        }
      );
  
      if (result.status === 200) {
        alert("Category price saved successfully.");
        handleGetMandiHistory();
        setupdate((prev)=>prev+1)
      } else {
        alert("Category price saved successfully.");
        handleGetMandiHistory();
        setupdate((prev)=>prev+1)
        
      }
    } catch (error) {
      console.error("Error saving category prices:", error);
      alert(
        `Error saving category prices: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
  };

  const handleExport = () => {
    const categoryPrices = Object.entries(prices).map(([category, price]) => ({
      category,
      price,
    }));

    const worksheet = XLSX.utils.json_to_sheet(categoryPrices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category Prices");
    XLSX.writeFile(workbook, "CategoryPrices.xlsx");
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
      const newPrices = {};
      json.forEach((row) => {
        newPrices[row.category] = row.price;
      });
      setPrices(newPrices);
      setOpen(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const dataToRender = filteredHistory.length > 0 ? filteredHistory : history;

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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box onClick={handleBackButton}>
                <ArrowBackIcon
                  sx={{
                    fontSize: "26px",
                    color: "black",
                    marginRight: "10px",
                  }}
                />
              </Box>
              <Typography
                style={{
                  fontSize: "36px",
                  fontWeight: 600,
                  fontFamily: "sans-serif",
                }}
              >
                {data.mandiname}
              </Typography>
            </Box>
            <Box style={{ display: "flex", gap: "20px" }}>
              <Button
                variant="contained"
                style={{ marginLeft: "20px", background: "#FF8604" }}
                startIcon={<AddIcon />}
                onClick={handleSaveAll}
              >
                Save All
              </Button>
              <Button
                variant="contained"
                onClick={handleExport}
                startIcon={<AddIcon />}
                style={{ marginLeft: "10px", background: "#FF8604" }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AddIcon />}
                style={{ marginLeft: "10px", background: "#FF8604" }}
              >
                Import
              </Button>
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Typography id="modal-title" variant="h6" component="h2">
                    Import Excel File
                  </Typography>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImport}
                    style={{ marginTop: "20px" }}
                  />
                </Box>
              </Modal>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", marginTop: "20px" }}
        />
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {data.categories &&
            data.categories.map((category, index) => (
              <Box
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                  }}
                >
                  <TextField
                    required
                    variant="standard"
                    sx={{ flex: 0.5 }}
                    id={`category-${index}`}
                    label="Category Name"
                    value={category}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    sx={{ flex: 0.5 }}
                    id={`price-${index}`}
                    label="Price"
                    value={prices[category] || ""}
                    onChange={(e) =>
                      handlePriceChange(category, e.target.value)
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ background: "#FF8604", height: "30px" }}
                    onClick={handleSaveAll}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            ))}
          <div
            style={{ border: "1px solid #e0e0e0", marginTop: "20px" }}
          ></div>
          <div>
            {history.length > 0 && (
              <Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography style={{ fontSize: "25px" }}>
                    Mandi Price History
                  </Typography>
                </Box>
                <div
                  style={{ border: "1px solid #e0e0e0", marginTop: "20px" }}
                ></div>
                <Box
                  style={{
                    display: "flex",  
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  {/* <TextField
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
              /> */}
                  <Box style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Button variant="contained"
                    size="small"
                    sx={{ background: "#FF8604", height: "30px" }} onClick={handleFilter}>
                  Filter
                </Button>
                <IconButton onClick={handleGetMandiHistory}>
                  <RefreshIcon />
                </IconButton>

              </Box>
                  </Box>
                  

                <Box sx={{ marginTop: "50px" }}>
                  <Grid container spacing={2}>
                    {dataToRender.map((entry, idx) =>
                      entry.categoryPrices.map((categoryPrice) => (
                        <Grid key={categoryPrice._id} item xs={12} sm={6} md={4}>
                          <Box
                            style={{
                              border: "1px solid grey",
                              borderRadius: "10px",
                              padding: "10px",
                            }}
                          >
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography>{categoryPrice.category}</Typography>
                              <Typography>{categoryPrice.price}</Typography>
                            </Box>
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="subtitle1">
                                {formatDate(entry.createdAt)}
                              </Typography>
                                <Box style={{gap:20}}>
                                {/* <DeleteIcon onClick={() => handleDelete(categoryPrice.category)}/> */}
                                <EditRoundedIcon
                  style={{ color: "#000" }}
                  onClick={() => handleOpen(categoryPrice.category, categoryPrice.price)}
                />
                                  </Box>
                              {/* <Box style={{ display: 'flex' }}>
                                <Typography
                                  variant="subtitle1"
                                  style={{ marginRight: '10px', color: '#e41010' }}
                                >
                                  20%
                                </Typography>
                                <Box>
                                  <img
                                    src={icon}
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      objectFit: "cover",
                                    }}
                                    alt="icon"
                                  />
                                </Box>
                              </Box> */}
                            </Box>
                          </Box>
                        </Grid>
                      ))
                    )}
                  </Grid>
                </Box>
              </Box>
            )}
          </div>
        </Box>
      </CardContent>
    </Card>
       <Modal
      open={open2}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '1px solid #000',
          borderRadius: '10px',
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          {selectedCategory}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Price"
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleUpdatePrice}>
          Update
        </Button>
      </Box>
    </Modal>
  </Box>
);
};
