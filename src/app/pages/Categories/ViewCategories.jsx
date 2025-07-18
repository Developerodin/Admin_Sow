import { Box, Button, Card, CardContent, Tab,InputAdornment, Tabs, Typography, TextField,Dialog,DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from '@mui/material/styles'; 
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { InfoCard } from '../../../Components/InfoCard';
import Grid from "@mui/material/Grid";
import { CategoriesCard } from '../../../Components/CategoriesCard';
import { SubCategoriesCard } from '../../../Components/SubCategoriesCard';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Base_url } from '../../Config/BaseUrl';
import { GenralTabel } from '../../TabelComponents/GenralTable';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';


import axios from 'axios';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius:"10px",
  boxShadow: 24,
  p: 2,
};
const orangeTheme = createTheme({
  palette: {
    primary: {
      main: '#EE731B', // Set the main color to your desired shade of orange
    },
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export const ViewCategories = () => {
  const navigate = useNavigate()
  const{id} = useParams()
  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setSubCategoryAddData({
      name:"",
      price:"",
      unit:"kg",
      image: "",
      imageKey: ""
    })
    setSelectedImage(null);
    setImagePreview(null);
  };
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () =>{ 
    setOpen2(false)
    setSubCategoryAddData({
      name:"",
      price:"",
      unit:"kg",
      image: "",
      imageKey: ""
    })
    setSelectedImage(null);
    setImagePreview(null);
  };
  const [SubCategoriesData, setsubCategoriesData] = useState([]);
  const [subCategoryAddData,setSubCategoryAddData] = useState({
    name:"",
    price:"",
    unit:"kg",
    image: "",
    imageKey: ""
  });
  const [CategoryData,setCategoriesData] = useState(null)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangetabs = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = () => {
    // const filteredData = rows.filter((row) =>
    //   Object.values(row)
    //     .filter((value) => typeof value === 'string') // Filter only string values
    //     .some((value) =>
    //       value.toLowerCase().includes(searchInput.toLowerCase())
    //     )
    // );
    // setFilterRows(filteredData);
  };
  const handleResetFilter = () => {
    setSearchInput('');
    // setFilterRows(rows);
  };

  const handelView =(id) =>{
     navigate(`view-categorie/${id}`)
  }

  const handelGoBack = () => {
    window.history.back();
  }

  const handleSubCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryAddData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToS3 = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${Base_url}files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return {
          url: response.data.data.url,
          key: response.data.data.key
        };
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handelAddSubCategory = async () => {
    try {
      let imageUrl = '';
      let imageKey = '';
      
      if (selectedImage) {
        const uploadResult = await uploadImageToS3(selectedImage);
        imageUrl = uploadResult.url;
        imageKey = uploadResult.key;
      }
      
      await addSubcategory(id, subCategoryAddData.name, subCategoryAddData.price, subCategoryAddData.unit, imageUrl, imageKey);
      handleClose();
      setSubCategoryAddData({
        name:"",
        price:"",
        unit:"kg",
        image: "",
        imageKey: ""
      });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating subcategory:', error);
      alert('Error creating subcategory. Please try again.');
    }
  }

  const handelEditSubCategory = async (sub_id) => {
    try {
      let imageUrl = subCategoryAddData.image;
      let imageKey = subCategoryAddData.imageKey;
      
      if (selectedImage) {
        const uploadResult = await uploadImageToS3(selectedImage);
        imageUrl = uploadResult.url;
        imageKey = uploadResult.key;
      }
      
      await updateSubcategory(id, sub_id, subCategoryAddData.name, subCategoryAddData.price, subCategoryAddData.unit, imageUrl, imageKey);
      handleClose2();
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating subcategory:', error);
      alert('Error updating subcategory. Please try again.');
    }
  }

  const handelSubCategoryEditOpen = (index) => {
    const data = SubCategoriesData[index];
    setSubCategoryAddData(data);
    if (data.image) {
      setImagePreview(data.image);
    }
    handleOpen2();
  }

   const addSubcategory = async (categoryId, name, price, unit, image = '', imageKey = '') => {
    try {
      console.log("Adding subcategory with data:", { categoryId, name, description: unit, price: price, image, imageKey });
      const subcategoryData = { categoryId, name, description: unit, price: price };
      if (image && imageKey) {
        subcategoryData.image = image;
        subcategoryData.imageKey = imageKey;
      }
      
      const response = await axios.post(`${Base_url}subcategories`, subcategoryData);
      console.log("Response ==>",response.data)
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      console.log("Error ==>",error)
    }
  };
  
  // Function to update a subcategory
   const updateSubcategory = async (categoryId, subcategoryId, name, price, unit, image = '', imageKey = '') => {
    try {
      console.log("Updating subcategory with data:", { categoryId, name, description: unit, price, image, imageKey });
      const subcategoryData = { categoryId, name, description: unit, price };
      if (image && imageKey) {
        subcategoryData.image = image;
        subcategoryData.imageKey = imageKey;
      }
      
      const response = await axios.patch(`${Base_url}subcategories/${subcategoryId}`, subcategoryData);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to delete a subcategory
   const deleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      const response = await axios.delete(`${Base_url}subcategories/${subcategoryId}`);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const handelDeleteSubCategroy =(sub_id)=>{
    deleteSubcategory(id,sub_id)
  }

  const getCategoryById = async (id) => {
    try {
      const response = await axios.get(`${Base_url}subcategories/category/${id}`);
      setCategoriesData(response.data[0])
      setsubCategoriesData(response.data)
      
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  useEffect(()=>{
    getCategoryById(id)
  },[update])

  const handleDeleteClick = (ID) => {
    console.log('ID',ID)
    setDeleteId(ID);
    setOpen3(true);
  };

  const handleCloseone = () => {
    setOpen3(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteSubcategory(deleteId);
    }
    handleCloseone();
  };

  const updateTradableStatus = async (id, tradable) => {
    try {
      const response = await axios.patch(`${Base_url}subcategories/${id}`, {
        isTradable: tradable, // pass true or false
      });
  
      if (response.status === 200) {
        // console.log('Tradable status updated:', response.data);
        setUpdate((prev) =>prev+1)
        // You can handle further actions here, like showing a success message
      } else {
        console.error('Error updating tradable status:', response.data);
      }
    } catch (error) {
      console.error('Error making API request:', error);
    }
  };

  const columns = [
    { name: 'Image' },
    { name: 'Name' },
    { name: 'Price' },
    { name: 'Tradable' },
    { name: 'Update' },
    { name: 'Delete' },
  ];

  const rows = SubCategoriesData.map((el,index)=>{
    return {
      Image: el.image ? (
        <Box
          style={{
            width: "60px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
            margin: "0 auto"
          }}
        >
          <img 
            src={el.image} 
            alt={el.name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      ) : (
        <Box
          style={{
            width: "60px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            margin: "0 auto"
          }}
        >
          <PhotoSizeSelectActualIcon sx={{ fontSize: "24px", color: "#ccc" }} />
        </Box>
      ),
      Name:el.name,
      Price:`₹${el.price}`,
      Tradable:el.isTradable ? <Button variant="outlined" color='success' onClick={()=>updateTradableStatus(el._id,false)} >Active</Button> : <Button variant="outlined" color='error' onClick={()=>updateTradableStatus(el._id,true)} >In Active</Button>,
      Update:<BorderColorIcon  onClick={()=>handelSubCategoryEditOpen(index)}/>,
      Delete:<DeleteIcon onClick={()=>handelDeleteSubCategroy(el._id)}/>
    }
  });

  return (
    <Box >

       <Card sx={{minHeight:"100vh"}}>
        <CardContent>

          <Box >
             

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{marginBottom:"20px"}}>
                <ArrowBackIcon onClick={handelGoBack} sx={{fontSize:"20px"}}/>
            </Box>
      <ThemeProvider theme={orangeTheme}>
        <Tabs value={value} onChange={handleChangetabs} aria-label="basic tabs example" textColor="primary"
        indicatorColor="primary"
       
        >
          <Tab label={CategoryData ? CategoryData.name : "Sub Categories"} {...a11yProps(0)}  style={{fontSize:"16px",fontWeight:600,color:`${value === 0 ? "#EE731B" : "#555555"}`,marginRight:"10px",borderRadius:"10px",marginBottom:"10px"}}/>
          {/* <Tab label="Sub-Categories" {...a11yProps(1)} style={{fontSize:"16px",fontWeight:600,color:`${value === 1 ? "#EE731B" : "#555555"}`,marginRight:"10px",borderRadius:"10px",marginBottom:"10px"}} /> */}
         
        </Tabs>
        </ThemeProvider>
      </Box>

      
          </Box>
         

          <Box sx={{ width: '100%',height:"70vh",overflow:"auto" }}>
      

      

      <CustomTabPanel value={value} index={0}>
       
      <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
            {/* <TextField fullWidth label="Search" /> */}
            <Box sx={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <TextField
          label="Search"
          id="outlined-start-adornment"
          size='small'
          sx={{ m: 1, width: '250px' }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
          }}
          value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
        />

<Button variant="contained" style={{marginLeft:"20px",background:"black",height:"33px"}} startIcon={<FilterListIcon />} >A-Z</Button>
            </Box>
            



              <Box>
              
              <Button variant="contained" style={{marginLeft:"20px",background:"#FF8604"}} startIcon={<AddIcon />} onClick={handleOpen} >Add Sub-Category</Button>
            </Box>
            </Box>

            <GenralTabel rows={rows} column={columns} />
        
      </CustomTabPanel>

  

     

    </Box>
    
        </CardContent>
       </Card>

       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
          Add Sub Category
          </Typography>

            <CloseIcon onClick={handleClose}/>
          </Box>
           
          <TextField
        fullWidth
        label="Enter Name Of Sub Category"
        sx={{ marginTop: "30px" }}
        name="name"
        value={subCategoryAddData.name}
        onChange={handleSubCategoryInputChange}
      />
      <TextField
        fullWidth
        sx={{ marginTop: "30px" }}
        label="Price"
        name="price"
        type="number"
        value={subCategoryAddData.price}
        onChange={handleSubCategoryInputChange}
      />
      <TextField
        sx={{ marginTop: "30px" }}
        label="Unit"
        name="unit"
        value={subCategoryAddData.unit}
        onChange={handleSubCategoryInputChange}
      />

      {/* Image Upload Section */}
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
          Sub Category Image
        </Typography>
        
        {/* Image Preview */}
        {imagePreview && (
          <Box
            style={{
              width: "150px",
              height: "150px",
              border: "2px solid #ddd",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              backgroundColor: "#f9f9f9",
              marginBottom: "10px"
            }}
          >
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
        
        {/* File Input */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<PhotoSizeSelectActualIcon />}
        >
          {selectedImage ? selectedImage.name : "Choose Image"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

          <Box sx={{display:"flex",justifyContent:"right",alignItems:"center",marginTop:"15px"}}>
      <Button variant='contained' size='small' expand sx={{backgroundColor:"black"}} onClick={handelAddSubCategory}>Submit</Button>
    </Box>
        </Box>
      </Modal>


      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
          Edit Sub Category
          </Typography>

            <CloseIcon onClick={handleClose2}/>
          </Box>
           
          <TextField
        fullWidth
        label="Enter Name Of Sub Category"
        sx={{ marginTop: "30px" }}
        name="name"
        value={subCategoryAddData.name}
        onChange={handleSubCategoryInputChange}
      />
      <TextField
        fullWidth
        sx={{ marginTop: "30px" }}
        label="Price"
        name="price"
        type="number"
        value={subCategoryAddData.price}
        onChange={handleSubCategoryInputChange}
      />
      <TextField
        sx={{ marginTop: "30px" }}
        label="Unit"
        name="unit"
        value={subCategoryAddData.description}
        onChange={handleSubCategoryInputChange}
      />

      {/* Image Upload Section */}
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
          Sub Category Image
        </Typography>
        
        {/* Image Preview */}
        {imagePreview && (
          <Box
            style={{
              width: "150px",
              height: "150px",
              border: "2px solid #ddd",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              backgroundColor: "#f9f9f9",
              marginBottom: "10px"
            }}
          >
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
        
        {/* File Input */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<PhotoSizeSelectActualIcon />}
        >
          {selectedImage ? selectedImage.name : "Choose New Image"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

          <Box sx={{display:"flex",justifyContent:"right",alignItems:"center",marginTop:"15px"}}>
      <Button variant='contained' size='small' expand sx={{backgroundColor:"black"}} onClick={()=>handelEditSubCategory(subCategoryAddData._id)}>Submit</Button>
    </Box>
        </Box>
      </Modal>
      <Dialog
          open={open3}
          onClose={handleCloseone}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this sub-category?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseone} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
   </Box>
  )
}

