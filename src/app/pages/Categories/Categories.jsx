import { Box, Button, Card, CardContent, Tab,InputAdornment, Tabs, Typography, TextField } from '@mui/material'
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
import { Base_url } from '../../Config/BaseUrl';
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
    })
  } 
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () =>{
    setOpen2(false);
    setCategoryAddData({
      name: '',
      description: '',
    })
  } 
  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [update, setUpdate] = useState([]);
  const [CategoriesData, setCategoriesData] = useState([]);
  const [categoryAddData, setCategoryAddData] = useState({
    name: '',
    description: '',
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

  const createCategory = async (name, description) => {
    try {
      const response = await axios.post(`${Base_url}api/category`, { name, description });
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to get all categories
  const getCategories = async () => {
    try {
      const response = await axios.get(`${Base_url}api/category`);
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
      const response = await axios.get(`${Base_url}api/category/${id}`);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to update a category
  const updateCategory = async (id, name, description) => {
    try {
      const response = await axios.put(`${Base_url}api/category/${id}`, { name, description });
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  // Function to delete a category
   const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(`${Base_url}api/category/${id}`);
      setUpdate((prev) =>prev+1)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  const handelCategorySubmit = ()=>{
    createCategory(categoryAddData.name, categoryAddData.description);
    handleClose();
    setCategoryAddData({
      name: '',
      description: '',
    })
  }

  const handelEditCategorySubmit = ()=>{
    updateCategory(ActiveCategory,categoryAddData.name, categoryAddData.description);
    handleClose2();
    
  }

  const handelEditCategoryOpen =(data)=>{
    setActiveCategory(data._id);
    setCategoryAddData(data)
    handleOpen2();

  }

  useEffect(()=>{
    getCategories()
  },[update])
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

         <Grid container spacing={2}>
          {
            CategoriesData && CategoriesData.map((el,index)=>{
              return <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <CategoriesCard Data ={el} fun={(id)=>deleteCategory(id)} funEdit={()=>handelEditCategoryOpen(el)} />
              </Grid>
            })
          }
                
              </Grid>
        
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
          
          <Box sx={{display:"flex",justifyContent:"right",alignItems:"center",marginTop:"15px"}}>
      <Button variant='contained' size='small' expand sx={{backgroundColor:"black"}} onClick={handelEditCategorySubmit} >Submit</Button>
    </Box>
        </Box>
      </Modal>
   </Box>
  )
}

