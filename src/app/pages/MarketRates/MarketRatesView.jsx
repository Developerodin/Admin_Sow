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
import { Base_url } from "../../Config/BaseUrl";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as XLSX from "xlsx";
import icon from "./trend.png";
import logo from "./scrap-img.jpeg";
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
      const response = await axios.get(`${Base_url}mandi/${id}`);
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
        `${Base_url}mandiRates/history/mandi/${id}`
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
        `${Base_url}mandiRates/${id}/${selectedCategory}`,
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
    await axios.delete(`${Base_url}mandiRates/${id}/${category}`);
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
        `${Base_url}mandiRates`,
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

  </Box>
);
};
