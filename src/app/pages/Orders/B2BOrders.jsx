import {
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  InputAdornment,
  Tabs,
  Typography,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { InfoCard } from "../../../Components/InfoCard";
import Grid from "@mui/material/Grid";
import { OrdersCard } from "../../../Components/OrdersCard";
import { useNavigate } from "react-router-dom";
import { Base_url } from "../../Config/BaseUrl";
import axios from "axios";
import { B2BOrdersCard } from "../../../Components/B2BOrderCard";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "500px",

  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
};
const orangeTheme = createTheme({
  palette: {
    primary: {
      main: "#EE731B", // Set the main color to your desired shade of orange
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export const B2BOrders = () => {
  const navigate = useNavigate();
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    fontSize: "16px",
    textAlign: "center",
    padding: "8px",
  };
  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const [open, setOpen] = useState(false);
  const [OrdersData, setOrderData] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedOrderData(null);
  };
  const [SelectedOrderData, setSelectedOrderData] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangetabs = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = () => {};
  const handleResetFilter = () => {
    setSearchInput("");
    // setFilterRows(rows);
  };

  const createOrder = async (from, to, details, totalAmount, status) => {
    try {
      const response = await axios.post(`${Base_url}api/b2b_orders`, {
        from,
        to,
        details,
        totalAmount,
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to get all B2B orders
  const getOrders = async () => {
    try {
      const response = await axios.get(`${Base_url}api/b2b_orders`);
      console.log("data",response.data);
      setOrderData(response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to get a B2B order by ID
  const getOrderById = async (id) => {
    try {
      const response = await axios.get(`${Base_url}api/b2b_orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to update a B2B order
  const updateOrder = async (id, from, to, details, totalAmount, status) => {
    try {
      const response = await axios.put(`${Base_url}api/b2b_orders/${id}`, {
        from,
        to,
        details,
        totalAmount,
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to delete a B2B order
  const deleteOrder = async (id) => {
    try {
      const response = await axios.delete(`${Base_url}api/b2b_orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const handelOrderClick = () => {
    navigate("add");
  };

  const handleViewOrderClick = (orderId) => {
    navigate(`/b2b_orders/view/${orderId}`);
  };

  useEffect(() => {
    getOrders();
  }, []);

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
                  Vendors Orders
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  style={{ marginLeft: "20px", background: "#FF8604" }}
                  startIcon={<AddIcon />}
                  onClick={handelOrderClick}
                >
                  Add Order
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                marginTop: "20px",
              }}
            >
              <ThemeProvider theme={orangeTheme}>
                <Tabs
                  value={value}
                  onChange={handleChangetabs}
                  aria-label="basic tabs example"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    label="Orders"
                    {...a11yProps(0)}
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: `${value === 0 ? "#EE731B" : "#555555"}`,
                      marginRight: "10px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                  <Tab
                    label="Completed"
                    {...a11yProps(1)}
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: `${value === 1 ? "#EE731B" : "#555555"}`,
                      marginRight: "10px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                </Tabs>
              </ThemeProvider>
            </Box>

            <Box
              sx={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              {/* <TextField fullWidth label="Search" /> */}

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

          {/* <Box sx={{ borderBottom: 1, borderColor: 'divider',marginTop:"20px" }}>
      <ThemeProvider theme={orangeTheme}>
        <Tabs value={value} onChange={handleChangetabs} aria-label="basic tabs example" textColor="primary"
        indicatorColor="primary"
       
        >
          <Tab label="Orders" {...a11yProps(0)}  style={{fontSize:"16px",fontWeight:600,color:`${value === 0 ? "#EE731B" : "#555555"}`,marginRight:"10px",borderRadius:"10px",marginBottom:"10px"}}/>
          <Tab label="Completed" {...a11yProps(1)} style={{fontSize:"16px",fontWeight:600,color:`${value === 1 ? "#EE731B" : "#555555"}`,marginRight:"10px",borderRadius:"10px",marginBottom:"10px"}} />
         
        </Tabs>
        </ThemeProvider>
      </Box>

      <Box sx={{display:"flex",marginTop:"20px",justifyContent:"left",alignItems:"center"}}>
       
            
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
            </Box> */}
          

         

          <Box sx={{ width: '100%',marginTop:"20px",height:"70vh",overflow:"auto" }}>
      

      

      <CustomTabPanel value={value} index={0}>
       

         <Grid container spacing={2}>
            {
                OrdersData && OrdersData.map((el,index)=>{
                   return <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                    <B2BOrdersCard Fun={()=>handleViewOrderClick(el)} Data={el}/>
                    </Grid>
                
                    })}
              </Grid>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
