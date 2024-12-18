import {
  Box, Button, Card, CardContent, Typography,
  Modal, TextField, MenuItem ,InputLabel,Select,FormControl,Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox, ListItemText,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BorderColor from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Base_url, Base_url2 } from '../../Config/BaseUrl';
import { GenralTabel } from '../../TabelComponents/GenralTable';
import { SelectStateModel } from '../../../_metronic/layout/components/Model/SelectStateModel';

export const MandiRates = () => {
  const [Data, setData] = useState([]);
  const [CategoriesData, setCategoriesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [update, setupdate] = useState(0);
  
  const [mandiData, setMandiData] = useState({
    mandiname: '',
    city: '',
    state: '',
    categories: []
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [apiData, setApiData] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Base_url}api/unifiedPinCode`);
        setApiData(response.data.data); 
        const uniqueStates = [...new Set(response.data.data.map(item => item.state_name))];
        setStates(uniqueStates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getUniqueCitiesByName = (addresses) => {
    const uniqueCities = {};
    addresses.forEach(address => {
      if (!uniqueCities[address.city_name]) {
        uniqueCities[address.city_name] = address.city_name;
      }
    });
    return Object.values(uniqueCities);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setMandiData(prev => ({ ...prev, state: selectedState, city: '' }));

    
    const filteredCities = getUniqueCitiesByName(
      apiData.filter(item => item.state_name === selectedState)
    );
    
    setCities(filteredCities);
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setMandiData(prev => ({ ...prev, city: selectedCity }));
  };

  const handleComplete = () => {
    console.log("Selected State and City:", mandiData);
  };

  
  const handleAddClick = () => {
    setMandiData({
      mandiname: '',
      city: '',
      state: '',
      categories: []
    });
    setIsEditing(false);
    setOpen(true);
  };

 
  const handleEditClick = async (id) => {
    try {
      const mandi = await getMandiById(id);
      setMandiData({
        mandiname: mandi.mandiname,
        city: mandi.city,
        state: mandi.state,
        categories: mandi.categories || []
      });
      setEditingId(id);
      setIsEditing(true);
      setOpen(true);
    } catch (error) {
      console.error(`Failed to load Mandi with ID ${id} for editing:`, error);
    }
  };


  const handleClose = () => {
    setOpen(false);
  };

  
  const getCategories = async () => {
    try {
      const response = await axios.get(`${Base_url2}categories`);
      setCategoriesData(response.data);
      console.log("Categories all", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  
  const getMandi = async () => {
    try {
      const response = await axios.get(`${Base_url2}mandi`);
      setData(response.data);
      console.log("Mandis all", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch mandis:", error);
    }
  };

  
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'category') {
      
      setMandiData((prevData) => ({
        ...prevData,
        categories: typeof value === 'string' ? value.split(',') : value,
      }));
    } else {
      setMandiData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  
  const handleSubmit = async () => {
    try {
      console.log('Mandi Data:', mandiData); 
      if (isEditing) {
        await updateMandi(editingId, mandiData);
        console.log(`Mandi with ID ${editingId} updated successfully.`);
      } else {
        await createMandi(mandiData);
        console.log('Mandi created successfully.');
      }
      getMandi(); 
      setOpen(false);
    } catch (error) {
      console.error('Failed to save Mandi:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteMandi(id);
      getMandi(); 
    } catch (error) {
      console.error('Failed to delete Mandi:', error);
    }
  };

  
  const deleteMandi = async (id) => {
    try {
      const response = await axios.delete(`${Base_url2}mandi/${id}`);
      console.log("Mandi deleted", response.data);
      setupdate((prev) => prev + 1);
      return response.data;
    } catch (error) {
      console.error('Failed to delete Mandi:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpen2(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteMandi(deleteId);
    }
    handleClose2();
  };

  const handleClose2 = () => {
    setOpen2(false);
    setDeleteId(null);
  };


  const createMandi = async (mandiData) => {
    try {
      const response = await axios.post(`${Base_url2}mandi`, mandiData);
      console.log("Mandi created", response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create Mandi:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const updateMandi = async (id, mandiData) => {
    try {
      const response = await axios.put(`${Base_url2}mandi/${id}`, mandiData);
      console.log("Mandi updated", response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update Mandi with ID ${id}:`, error);
    }
  };

  const getMandiById = async (id) => {
    try {
      const response = await axios.get(`${Base_url2}mandi/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to retrieve Mandi with ID ${id}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    getCategories();
    getMandi();
  }, []);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  };

  const columns = [
    { name: 'Mandi Name' },
    { name: 'Category' },
    { name: 'City' },
    { name: 'State' },
    { name: 'Delete' },
    { name: 'Update' }
  ];

  const rows = Data.map((el) => {
    return {
      title: el.mandiname || 'N/A',
      category: el.categories.length > 0 ? el.categories.join(', ') : 'N/A',
      city: el.city || 'N/A',
      state: el.state || 'N/A',
      delete: <DeleteIcon onClick={() => handleDeleteClick(el._id)} />,
      update: <BorderColor onClick={() => handleEditClick(el._id)} />
    };
  });

  

  return (
    <Box>
      <Card sx={{ minHeight: "100vh" }}>
        <CardContent>
          <Box>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography style={{ fontSize: "40px", fontWeight: 600, fontFamily: "sans-serif" }}>
                Mandi 
              </Typography>
              <Button variant="contained" style={{ marginLeft: "20px", background: "#FF8604" }} startIcon={<AddIcon />} onClick={handleAddClick}>
                Add Mandi
              </Button>
            </Box>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: "20px" }} />
          <GenralTabel column={columns} rows={rows} />
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              {isEditing ? 'Edit Mandi' : 'Add Mandi'}
            </Typography>
            <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
          </Box>
          <TextField
            fullWidth
            label="Mandi Name"
            name="mandiname"
            value={mandiData.mandiname}
            onChange={handleChange}
            sx={{ marginTop: "30px" }}
          />
      <FormControl fullWidth sx={{ marginTop: "30px" }}>
        <InputLabel>State</InputLabel>
        <Select
          value={mandiData.state}
          onChange={handleStateChange} // Trigger state change
        >
          {states.map((state, index) => (
            <MenuItem key={index} value={state}>{state}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginTop: "30px" }} disabled={!mandiData.state}>
        <InputLabel>City</InputLabel>
        <Select
          value={mandiData.city}
          onChange={handleCityChange} // Trigger city change
        >
          {cities.map((city, index) => (
            <MenuItem key={index} value={city}>{city}</MenuItem>
          ))}
        </Select>
      </FormControl>
          
      <TextField
      fullWidth
      select
      label="Category"
      name="categories"
      value={mandiData.categories}
      onChange={handleChange}
      sx={{ marginTop: "30px" }}
      SelectProps={{
        multiple: true,
        renderValue: (selected) => selected.join(', '),
      }}
    >
      {CategoriesData.map((category) => (
        <MenuItem key={category._id} value={category.name}>
          <ListItemText primary={category.name} />
          <Checkbox checked={mandiData.categories.indexOf(category.name) > -1} />
        </MenuItem>
      ))}
    </TextField>
          <Box sx={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog
          open={open2}
          onClose={handleClose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Mandi?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

     

    
    
    </Box>
  );
};
