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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { Base_url } from "../../Config/BaseUrl";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as XLSX from "xlsx";
import icon from "./trend.png";
import logo from "./scrap-img.jpeg";

export const MarketRatesView = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [prices, setPrices] = useState({});
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);

  const getMandiById = async (id) => {
    try {
      const response = await axios.get(`${Base_url}api/mandi/${id}`);
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
        `${Base_url}api/mandi_rates/history/mandi/${id}`
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching Mandi history:", error);
    }
  };

  useEffect(() => {
    getMandiById(id);
    handleGetMandiHistory();
  }, [id]);

  const handlePriceChange = (category, value) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [category]: value,
    }));
  };

  const handleSave = async (category) => {
    const newPrice = prices[category];
    if (!newPrice) {
      alert("Price cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(
        `${Base_url}api/mandi_rates/category-prices/${id}/${category}`,
        {
          newPrice,
        }
      );

      if (response.status === 200) {
        alert(`Price for ${category} updated successfully.`);
        handleGetMandiHistory(); // Fetch history again after saving
      } else {
        alert(`Failed to update price for ${category}.`);
      }
    } catch (error) {
      console.error("Failed to save price:", error);
      alert(
        `Error updating price for ${category}: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
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
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const handleBackButton = () => {
    window.history.back();
  };

  const handleSaveAll = async () => {
    const categoryPrices = Object.entries(prices).map(([category, price]) => ({
      category,
      price,
    }));

    try {
      const result = await axios.post(
        `${Base_url}api/mandi_rates/category-prices`,
        {
          mandi: id,
          categoryPrices,
        }
      );

      if (result.status === 200) {
        alert("Category price saved successfully.");
        handleGetMandiHistory();
      } else {
        alert("Category price saved successfully.");
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
                View Market Rates
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
                <Box sx={{ marginTop: "50px" }}>
                  <Grid container spacing={2}>
                    {history.map((entry, idx) =>
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
                              <Box style={{ display: 'flex' }}>
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
                              </Box>
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
  </Box>
);
};
