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
    Switch,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import AddIcon from "@mui/icons-material/Add";
  import BorderColorIcon from '@mui/icons-material/BorderColor';
  import DeleteIcon from '@mui/icons-material/Delete';
  import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
  import PropTypes from "prop-types";
  import { createTheme } from "@mui/material/styles";
  import { ThemeProvider } from "@mui/material/styles";
  import SearchIcon from "@mui/icons-material/Search";
  import FilterListIcon from "@mui/icons-material/FilterList";
  import { InfoCard } from "../../../Components/InfoCard";
  import Grid from "@mui/material/Grid";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { Base_url } from "../../Config/BaseUrl";
  import { toAbsoluteUrl } from "../../../_metronic/helpers";
  import { GenralTabel } from "../../TabelComponents/GenralTable";
  import Checkbox from "@mui/material/Checkbox";
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  
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
  export const RequestVendors = () => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);
    const [searchInput, setSearchInput] = React.useState("");
    const [AllVendorsData, setVendorsData] = useState([]);
    const [update, setupdate] = useState(0);
    const [CollectorsData, setCollectorsData] = useState([]);
    const [WholesalersData, setWholesalersData] = useState([]);
    const [MediatorsData, setMediatorsData] = useState([]);
    const [FactoryData, setFactoryData] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleChangetabs = (event, newValue) => {
      setValue(newValue);
    };
    
    const handleBackButton = () => {
        window.history.back();
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
      setSearchInput("");
      // setFilterRows(rows);
    };
  
    const handelAddVendors = () => [navigate("add")];
  
    const fetchB2BUser = async () => {
        try {
          const response = await axios.get(`${Base_url}api/b2b`);
      
          if (response.status === 200) {
            const fetchedB2BUsers = response.data;
            console.log("Fetch users == >", fetchedB2BUsers);
      
            
            const fifteenDaysAgo = new Date();
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      
            
            const recentB2BUsers = fetchedB2BUsers.filter((user) => {
              return new Date(user.createdAt) >= fifteenDaysAgo;
            });
      
            setVendorsData(recentB2BUsers);
      
            const MediatorsData = recentB2BUsers.filter((el) => el.registerAs === "Mediators");
            const WholesalersData = recentB2BUsers.filter((el) => el.registerAs === "Wholesalers");
            const FactoryData = recentB2BUsers.filter((el) => el.registerAs === "Factory");
            const CollectorsData = recentB2BUsers.filter((el) => el.registerAs === "Collectors");
      
            setMediatorsData(MediatorsData);
            setWholesalersData(WholesalersData);
            setFactoryData(FactoryData);
            setCollectorsData(CollectorsData);
          } else {
            console.error("Error fetching categories:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error.message);
        }
      };
  
    const deleteUser = async (ID) => {
      try {
        const res = await axios.delete(`${Base_url}api/b2b/${ID}`);
        console.log(res);
        setupdate((prev) => prev + 1);
      } catch (err) {
        console.log("Error", err);
      }
    };
  
    const handleDeleteClick = (ID) => {
      setDeleteId(ID);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setDeleteId(null);
    };
  
    const handleConfirmDelete = async () => {
      if (deleteId) {
        await deleteUser(deleteId);
      }
      handleClose();
    };
  
    useEffect(() => {
      fetchB2BUser();
    }, [update]);
  
    const handelView = (id)=>{
      navigate(`view/${id}`)
    }
  
    const handelUpdate = (id)=>{
      navigate(`edit/${id}`)
    }
    const handleStatusChange = (event,userId) => {
      const newStatus = event.target.checked;
      updateUserStatus(userId,newStatus);
    };
  
    const updateUserStatus = async (userId,status1) => {
      try {
        const response = await axios.patch(`${Base_url}api/b2b/updateStatus/${userId}`, { status:status1 });
  
        if (response.status === 200) {
          // setMessage('User status updated successfully.');
          setupdate((prev) => prev + 1);
        } else {
          // setMessage(`Error: ${response.data.message}`);
          console.log("err =>",response.data.message)
        }
      } catch (err) {
        // setMessage(`Error: ${err.response ? err.response.data.message : err.message}`);
        console.log("error  ==>",err)
      }
    };
  
    const columns = [
      { name: "Name" },
      { name: "Email" },
      { name: "Phone" },
      { name: "Address" },
      { name: "City" },
      { name: "Status" },
      { name: "Active" },
      { name: "View" },
      { name: "Update" },
      { name: "Delete" }
    ];
  
    const rows = CollectorsData.map((collector, index) => ({
      name: collector.name,
      email: collector.email,
      phone: collector.mobile,
      address: collector.Address,
      city: collector.city,
      status: collector.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
      active: <Switch checked={collector.status} onChange={(e)=>handleStatusChange(e,collector._id)} />,
      view: <RemoveRedEyeIcon onClick={()=>handelView(collector._id)}/>,
      update: <BorderColorIcon onClick={() => handelUpdate(collector._id)}/>,
      delete: <DeleteIcon onClick={() => handleDeleteClick(collector._id)}/>
    }));
  
    const rows2 = WholesalersData.map((wholesaler, index) => ({
      name: wholesaler.name,
      email: wholesaler.email,
      phone: wholesaler.mobile,
      address: wholesaler.Address,
      city: wholesaler.city,
      status: wholesaler.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
      active: <Switch checked={wholesaler.status} onChange={(e)=>handleStatusChange(e,wholesaler._id)} />,
      view: <RemoveRedEyeIcon onClick={()=>handelView(wholesaler._id)}/>,
      update: <BorderColorIcon onClick={() => handelUpdate(wholesaler._id)}/>,
      delete: <DeleteIcon onClick={() => handleDeleteClick(wholesaler._id)}/>
    }));
  
    const rows3 = MediatorsData.map((mediator, index) => ({
      name: mediator.name,
      email: mediator.email,
      phone: mediator.mobile,
      address: mediator.Address,
      city: mediator.city,
      status: mediator.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
      active: <Switch checked={mediator.status} onChange={(e)=>handleStatusChange(e,mediator._id)} />,
      view: <RemoveRedEyeIcon onClick={()=>handelView(mediator._id)}/>,
      update: <BorderColorIcon onClick={() => handelUpdate(mediator._id)}/>,
      delete: <DeleteIcon onClick={() => handleDeleteClick(mediator._id)}/>
    }));
  
    const rows4 = FactoryData.map((factory, index) => ({
      name: factory.name,
      email: factory.email,
      phone: factory.mobile,
      address: factory.Address,
      city: factory.city,
      status: factory.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
      active: <Switch checked={factory.status} onChange={(e)=>handleStatusChange(e,factory._id)} />,
      view: <RemoveRedEyeIcon onClick={()=>handelView(factory._id)}/>,
      update: <BorderColorIcon onClick={() => handelUpdate(factory._id)}/>,
      delete: <DeleteIcon onClick={() => handleDeleteClick(factory._id)}/>
    }));
  
  
  
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

                <Box style={{display: "flex", alignItems: "center"}}>
                <Box
        onClick={handleBackButton}
       
      >
        <ArrowBackIcon sx={{ fontSize: "32px", color: "black",marginRight: "10px" }} />
      </Box>
                  <Typography
                    style={{
                      fontSize: "40px",
                      fontWeight: 600,
                      fontFamily: "sans-serif",
                    }}
                  >
                    Requests Vendors
                  </Typography>
                </Box>
  
                {/* <Box>
                  <Button
                    variant="outlined"
                    style={{
                      backgroundColor: "#FF86041A",
                      color: "#FF8604",
                      borderColor: "#FF8604",
                    }}
                  >
                    Requests
                  </Button>
                  <Button
                    variant="contained"
                    style={{ marginLeft: "20px", background: "#FF8604" }}
                    startIcon={<AddIcon />}
                    onClick={handelAddVendors}
                  >
                    Add Vendor
                  </Button>
                </Box> */}
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
                      label="Scrap collectors"
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
                      label="Scrap Wholesalers"
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
                    <Tab
                      label="Scrap Mediators"
                      {...a11yProps(2)}
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: `${value === 2 ? "#EE731B" : "#555555"}`,
                        marginRight: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                    <Tab
                      label="Scrap Factory"
                      {...a11yProps(2)}
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: `${value === 3 ? "#EE731B" : "#555555"}`,
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
  
            <Box
              sx={{
                width: "100%",
                marginTop: "20px",
                height: "70vh",
                overflow: "auto",
              }}
            >
             <CustomTabPanel value={value} index={0}>
            {CollectorsData && CollectorsData.length > 0 ? (
              <GenralTabel rows={rows} column={columns} />
            ) : (
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", height: "300px" }}>
                  <img
                    src={toAbsoluteUrl("/media/illustrations/dozzy-1/5-dark.png")}
                    style={{ height: "90%" }}
                    alt=""
                  />
                  <h2>No Collectors Data Found</h2>
                </div>
              </Grid>
            )}
          </CustomTabPanel>
  
          <CustomTabPanel value={value} index={1}>
            {WholesalersData && WholesalersData.length > 0 ? (
              <GenralTabel rows={rows2} column={columns} />
            ) : (
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", height: "300px" }}>
                  <img
                    src={toAbsoluteUrl("/media/illustrations/dozzy-1/5-dark.png")}
                    style={{ height: "90%" }}
                    alt=""
                  />
                  <h2>No Wholesalers Data Found</h2>
                </div>
              </Grid>
            )}
          </CustomTabPanel>
  
          <CustomTabPanel value={value} index={2}>
            {MediatorsData && MediatorsData.length > 0 ? (
              <GenralTabel rows={rows3} column={columns} />
            ) : (
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", height: "300px" }}>
                  <img
  
                    src={toAbsoluteUrl("/media/illustrations/dozzy-1/5-dark.png")}  
                    style={{ height: "90%" }}
                    alt=""
                  />
                  <h2>No Mediators Data Found</h2>
                </div>
              </Grid>
            )}
          </CustomTabPanel>
  
          <CustomTabPanel value={value} index={3}>
            {FactoryData && FactoryData.length > 0 ? (
              <GenralTabel rows={rows4} column={columns} />
            ) : (
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", height: "300px" }}>
                  <img
                    src={toAbsoluteUrl("/media/illustrations/dozzy-1/5-dark.png")}
                    style={{ height: "90%" }}
                    alt=""
                  />
                  <h2>No Factory Data Found</h2>
                </div>
              </Grid>
            )}
          </CustomTabPanel>
           <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };
  