import { Box, Button, Card, CardContent, Tab,InputAdornment, Tabs, Typography, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { InfoCard } from '../../../Components/InfoCard';
import Grid from "@mui/material/Grid";
import { OrdersCard } from '../../../Components/OrdersCard';
import { UserCard } from '../../../Components/UserCard';
import { useNavigate } from 'react-router-dom';
import { Base_url } from '../../Config/BaseUrl';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth:"500px",
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
export const Users = () => {

  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [AllUsersData,setUsersData] = useState([])
  const [update,setupdate] = useState(0);
  const [open, setOpen] = useState(false);
  const [OrdersData,setOrderData] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedUserData(null)
  }
  const [SelectedUserData,setSelectedUserData] = useState(null);
const navigate = useNavigate()
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

  const handelAddUsers = () =>{
    navigate("users_add")
  }

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${Base_url}api/users`);

      if (response.status === 200) {
        const fetchedUsers = response.data;
        // setCategories(fetchedCategories);

        console.log("Fetch users == >",fetchedUsers)
        
        setUsersData(fetchedUsers)

      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const deleteUser = async(ID) => {
    try{
      const res = await axios.delete(`${Base_url}api/users/${ID}`);
      console.log(res)
      setupdate((prev)=>prev+1)
    }
    catch(err){
      console.log("Error",err)
    }
  }

  const handelViewUserClick = (userId)=>{
    navigate(`/users/view/${userId}`);
    
  }



  useEffect(()=>{
    fetchUser()
  },[])

  return (
    <Box >

       <Card sx={{minHeight:"100vh"}}>
        <CardContent>

          <Box >
          <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <Box>
            <Typography style={{fontSize:"40px",fontWeight:600,fontFamily:"sans-serif"}} >
             Users
            </Typography>
            </Box>
           

            <Box>
              <Button variant="contained" style={{backgroundColor:"black"}}>Departments</Button>
              <Button variant="contained" style={{marginLeft:"20px",background:"#FF8604"}} startIcon={<AddIcon />} onClick={handelAddUsers} >Add User</Button>
            </Box>
          </Box>
             

      <Box sx={{display:"flex",marginTop:"20px",justifyContent:"left",alignItems:"center"}}>
            {/* <TextField fullWidth label="Search" /> */}
            
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
          </Box>
         
         <Box sx={{marginTop:"50px"}}>
         <Grid container spacing={2}>
          {
            AllUsersData && AllUsersData.map((el,index)=>{
              return <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <UserCard Data={el} fun={()=>handelViewUserClick(el._id)}/>
              </Grid>
            })
          }
                

              </Grid>

         </Box>
          
    
        </CardContent>
       </Card>

       
   </Box>
  )
}

