import { Box, Button, Card, CardContent, Tab,InputAdornment, Tabs, Typography, TextField ,Dialog,DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,} from '@mui/material'
import React, { useEffect,useState } from 'react'
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
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Base_url  } from '../../Config/BaseUrl';
import { GenralTabel } from '../../TabelComponents/GenralTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColor from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';

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
export const Categories = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>{
    setOpen(false);
    setCategoryAddData({
      name: '',
      description: '',
      image: '',
      imageKey: ''
    })
    setSelectedImage(null);
  } 
  const [open2, setOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [open3, setOpen3] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () =>{
    setOpen2(false);
    setCategoryAddData({
      name: '',
      description: '',
      image: '',
      imageKey: ''
    })
    setSelectedImage(null);
    setImagePreview(null);
  } 
  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [update, setUpdate] = useState(0);
    const [subCategoryData, setSubCategoryData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  const [CategoriesData, setCategoriesData] = useState([]);
  const [categoryAddData, setCategoryAddData] = useState({
    name: '',
    description: '',
    image: '',
    imageKey: ''
  });
  const [ActiveCategory,setActiveCategory] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCategoryInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryAddData({
      ...categoryAddData,
      [name]: value,
    });
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
    CategoriesData.forEach((category) => {
      getSubCategoriesByCategoryName(category.name);
    });
  }, [CategoriesData]);


  

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

  const createCategory = async (name, description, image = '', imageKey = '') => {
    try {
      const categoryData = { name, description };
      if (image && imageKey) {
        categoryData.image = image;
        categoryData.imageKey = imageKey;
      }
      
      const response = await axios.post(`${Base_url}categories`, categoryData);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to get all categories
  const getCategories = async () => {
    try {
      const response = await axios.get(`${Base_url}categories`);
      setCategoriesData(response.data);
      console.log("Categories all", response.data)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to get a category by ID
  const getCategoryById = async (id) => {
    try {
      const response = await axios.get(`${Base_url}categories/${id}`);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to update a category
  const updateCategory = async (id, name, description, image = '', imageKey = '') => {
    try {
      const categoryData = { name, description };
      if (image && imageKey) {
        categoryData.image = image;
        categoryData.imageKey = imageKey;
      }
      
      const response = await axios.patch(`${Base_url}categories/${id}`, categoryData);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to delete a category
   const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(`${Base_url}categories/${id}`);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  const handelCategorySubmit = async () => {
    try {
      let imageUrl = '';
      let imageKey = '';
      
      if (selectedImage) {
        const uploadResult = await uploadImageToS3(selectedImage);
        imageUrl = uploadResult.url;
        imageKey = uploadResult.key;
      }
      
      await createCategory(categoryAddData.name, categoryAddData.description, imageUrl, imageKey);
      handleClose();
      setCategoryAddData({
        name: '',
        description: '',
        image: '',
        imageKey: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category. Please try again.');
    }
  }

  const handelEditCategorySubmit = async () => {
    try {
      let imageUrl = categoryAddData.image;
      let imageKey = categoryAddData.imageKey;
      
      if (selectedImage) {
        const uploadResult = await uploadImageToS3(selectedImage);
        imageUrl = uploadResult.url;
        imageKey = uploadResult.key;
      }
      
      await updateCategory(ActiveCategory, categoryAddData.name, categoryAddData.description, imageUrl, imageKey);
      handleClose2();
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    }
  }

  const handelEditCategoryOpen = (data) => {
    setActiveCategory(data._id);
    setCategoryAddData(data);
    if (data.image) {
      setImagePreview(data.image);
    }
    handleOpen2();
  }

  useEffect(()=>{
    getCategories()
  },[update])

  const handleDeleteClick = (ID) => {
    setDeleteId(ID);
    setOpen3(true);
  };

  const handleCloseone = () => {
    setOpen3(false);
    setDeleteId(null);
  };

  const updateTradableStatus = async (categoryId, tradable) => {
    try {
      const response = await axios.patch(`${Base_url}api/category/update-tradable/${categoryId}`, {
        tradable: tradable, // pass true or false
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

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteCategory(deleteId);
    }
    handleCloseone();
  };

  const columns = [
    { name: 'Image' },
    { name: 'Category' },
    { name: 'Sub Categories' },
    { name: "View Sub Categories" },
    { name: "Update" },
    { name: "Delete" },
  ];
  
  const rows = CategoriesData.map((el) => {
    const subCategories = subCategoryData[el.name] || [];
    return {
      Image: el.image ? (
        <Box
          style={{
            width: "60px",
            height: "60px",
            border: "2px solid #ddd",
            borderRadius: "8px",
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
            border: "2px solid #ddd",
            borderRadius: "8px",
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
      Category: el.name,
      "Sub Categories": subCategories.length,
      View: <RemoveRedEyeIcon onClick={()=>handelView(el._id)} />,
      Update: <BorderColor onClick={()=>handelEditCategoryOpen(el)} />,
      Delete: <DeleteIcon onClick={()=>handleDeleteClick(el._id)} />,
    };
  });

  return (
    <Box >

       <Card sx={{minHeight:"100vh"}}>
        <CardContent>

          <Box >
             

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <ThemeProvider theme={orangeTheme}>
        <Tabs value={value} onChange={handleChangetabs} aria-label="basic tabs example" textColor="primary"
        indicatorColor="primary"
       
        >
          <Tab label="Categories" {...a11yProps(0)}  style={{fontSize:"16px",fontWeight:600,color:`${value === 0 ? "#EE731B" : "#555555"}`,marginRight:"10px",borderRadius:"10px",marginBottom:"10px"}}/>
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
              
              <Button variant="contained" style={{marginLeft:"20px",background:"#FF8604"}} onClick={handleOpen} startIcon={<AddIcon />} >Add Category</Button>
            </Box>
            </Box>

         <GenralTabel rows={rows} column={columns} />
        
      </CustomTabPanel>

      {/* <CustomTabPanel value={value} index={1}>
      <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
         
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
              
              <Button variant="contained" style={{marginLeft:"20px",background:"#FF8604"}} startIcon={<AddIcon />} >Add Sub Category</Button>
            </Box>
            </Box>


            <Grid container spacing={2}>
                <Grid item xs={3}>
               <SubCategoriesCard  name={"Newspaper"}/>
                </Grid>
              </Grid>

        
      </CustomTabPanel> */}

     

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
          Add Category
          </Typography>

            <CloseIcon onClick={handleClose}/>
          </Box>
           
          
          <TextField
        fullWidth
        label="Enter Name Of Category"
        name="name"
        value={categoryAddData.name}
        onChange={handleCategoryInputChange}
        sx={{ marginTop: "30px" }}
      />

      <TextField
        fullWidth
        label="Enter Description"
        name="description"
        value={categoryAddData.description}
        onChange={handleCategoryInputChange}
        sx={{ marginTop: "20px" }}
      />

      {/* Image Upload Section */}
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
          Category Image
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
      <Button variant='contained' size='small' expand sx={{backgroundColor:"black"}} onClick={handelCategorySubmit} >Submit</Button>
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
          Edit Category
          </Typography>

            <CloseIcon onClick={handleClose2}/>
          </Box>
           
          
          <TextField
        fullWidth
        label="Enter Name Of Category"
        name="name"
        value={categoryAddData.name}
        onChange={handleCategoryInputChange}
        sx={{ marginTop: "30px" }}
      />

      <TextField
        fullWidth
        label="Enter Description"
        name="description"
        value={categoryAddData.description}
        onChange={handleCategoryInputChange}
        sx={{ marginTop: "20px" }}
      />

      {/* Image Upload Section */}
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
          Category Image
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
      <Button variant='contained' size='small' expand sx={{backgroundColor:"black"}} onClick={handelEditCategorySubmit} >Submit</Button>
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
              Are you sure you want to delete this category?
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

