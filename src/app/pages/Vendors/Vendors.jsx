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
  Modal,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import CloseIcon from '@mui/icons-material/Close';
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


const orangeTheme = createTheme({
  palette: {
    primary: {
      main: "#EE731B", 
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
export const Vendors = () => {
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
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [selectedKycData, setSelectedKycData] = useState(null);
  const [kycDataMap, setKycDataMap] = useState({});
  const [kycLoadingMap, setKycLoadingMap] = useState({});
  const [kycStatusUpdate, setKycStatusUpdate] = useState({
    status: '',
    remarks: ''
  });
  const [isUpdatingKyc, setIsUpdatingKyc] = useState(false);
  const [currentKycUserId, setCurrentKycUserId] = useState(null);

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
    setSearchInput("");
    // setFilterRows(rows);
  };

  const handelAddVendors = () => [navigate("add")];

  const handelRequest = () => [navigate("request-vendors")];

   const fetchB2BUser = async () => {
    try {
      const response = await axios.get(`${Base_url}b2bUser`);
      const fetchedB2BUsers = response.data.results;
  
      console.log("Fetch users == 125>", fetchedB2BUsers);
      if (fetchedB2BUsers && fetchedB2BUsers.length > 0) {
        console.log("First user structure:", fetchedB2BUsers[0]);
        console.log("Available fields:", Object.keys(fetchedB2BUsers[0]));
        console.log("ID field value:", fetchedB2BUsers[0].id);
        console.log("_ID field value:", fetchedB2BUsers[0]._id);
      }
  
      setVendorsData(fetchedB2BUsers);
  
      const MediatorsData = fetchedB2BUsers.filter((el) => el.registerAs === "Mediator");
      const WholesalersData = fetchedB2BUsers.filter((el) => el.registerAs === "Wholesaler");
      const FactoryData = fetchedB2BUsers.filter((el) => el.registerAs === "Factory");
      const CollectorsData = fetchedB2BUsers.filter((el) => el.registerAs === "Retailer");
  
      setMediatorsData(MediatorsData);
      setWholesalersData(WholesalersData);
      setFactoryData(FactoryData);
      setCollectorsData(CollectorsData);

      // Fetch KYC data for all users
      await fetchKycDataForAllUsers(fetchedB2BUsers);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchKycDataForAllUsers = async (users) => {
    console.log("Fetching KYC data for all users:", users.length);
    
    // Fetch KYC data for all users in parallel
    const kycPromises = users.map(async (user) => {
      const userId = user.id || user._id;
      if (userId) {
        try {
          const response = await axios.get(`${Base_url}b2bUser/kyc/${userId}`);
          console.log(`KYC Response for user ${userId}:`, response.data);
          if (response.data) {
            return { userId, data: response.data.data };
          } else {
            return { userId, data: null };
          }
        } catch (error) {
          console.error(`Error fetching KYC data for user ${userId}:`, error);
          return { userId, data: null };
        }
      }
      return { userId: null, data: null };
    });

    try {
      const results = await Promise.all(kycPromises);
      
      // Update the KYC data map with all results
      const newKycDataMap = {};
      results.forEach(({ userId, data }) => {
        if (userId) {
          newKycDataMap[userId] = data;
        }
      });
      
      setKycDataMap(newKycDataMap);
      console.log("Updated KYC data map:", newKycDataMap);
    } catch (error) {
      console.error("Error fetching KYC data for all users:", error);
    }
  };

  const deleteUser = async (ID) => {
    try {
      const res = await axios.delete(`${Base_url}b2bUser/${ID}`);
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
    console.log("useEffect called");
    fetchB2BUser();
  }, [update]);

  const handelView = (id)=>{
    navigate(`view/${id}`)
  }

  const handelUpdate = (id)=>{
    console.log("id ==>",id)
    navigate(`edit/${id}`)
  }
  const handleStatusChange = (event,userId) => {
    const newStatus = event.target.checked;
    updateUserStatus(userId,newStatus);
  };

  const updateUserStatus = async (userId,status1) => {
    try {
      const response = await axios.patch(`${Base_url}b2bUser/updateStatus/${userId}`, { status:status1 });

      if (response.status === 200) {
        
        setupdate((prev) => prev + 1);
      } else {
        
        console.log("err =>",response.data.message)
      }
    } catch (err) {
      
      console.log("error  ==>",err)
    }
  };

  const fetchKycData = async (userId) => {
    setKycLoadingMap(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await axios.get(`${Base_url}b2bUser/kyc/${userId}`);
      console.log("KYC Response ========>", response.data);
      if (response.data ) {
        setKycDataMap(prev => ({ ...prev, [userId]: response.data.data }));
      } else {
        setKycDataMap(prev => ({ ...prev, [userId]: null }));
      }
    } catch (error) {
      console.error("Error fetching KYC data for user:", userId, error);
      setKycDataMap(prev => ({ ...prev, [userId]: null }));
    } finally {
      setKycLoadingMap(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleKycClick = async (userId) => {
    // Set the selected KYC data and open modal
    setSelectedKycData(kycDataMap[userId]);
    setKycModalOpen(true);
    setCurrentKycUserId(userId);
  };

  const handleKycModalClose = () => {
    setKycModalOpen(false);
    setSelectedKycData(null);
    setKycStatusUpdate({ status: '', remarks: '' });
    setCurrentKycUserId(null);
  };

  const handleKycStatusChange = (event) => {
    setKycStatusUpdate(prev => ({
      ...prev,
      status: event.target.value
    }));
  };

  const handleKycRemarksChange = (event) => {
    setKycStatusUpdate(prev => ({
      ...prev,
      remarks: event.target.value
    }));
  };

  const updateKycStatus = async () => {
    if (!selectedKycData || !kycStatusUpdate.status) {
      alert('Please select a status');
      return;
    }

    setIsUpdatingKyc(true);
    try {
      const response = await axios.post(`${Base_url}b2bUser/kyc-status`, {
        kycId: selectedKycData._id,
        status: kycStatusUpdate.status,
        remarks: kycStatusUpdate.remarks
      });

      if (response.status === 200) {
        // Update the local KYC data
        const updatedKycData = {
          ...selectedKycData,
          status: kycStatusUpdate.status,
          remarks: kycStatusUpdate.remarks
        };
        
        setSelectedKycData(updatedKycData);
        
        // Update the KYC data map using currentKycUserId
        setKycDataMap(prev => ({
          ...prev,
          [currentKycUserId]: updatedKycData
        }));

        // Reset the form
        setKycStatusUpdate({ status: '', remarks: '' });
        
        alert('KYC status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating KYC status:', error);
      alert('Error updating KYC status: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUpdatingKyc(false);
    }
  };

  const getKycStatusButton = (userId) => {
    const kycData = kycDataMap[userId];
    
    // If KYC data exists, show the actual status
    if (kycData) {
      const status = kycData.status;
      let color = 'warning';
      if (status === 'approved') color = 'success';
      else if (status === 'rejected') color = 'error';
      
      return (
        <Button 
          variant="outlined" 
          size="small" 
          color={color}
          onClick={() => handleKycClick(userId)}
        >
          {status ? status.toUpperCase() : 'PENDING'}
        </Button>
      );
    }
    
    // If no KYC data, show "Incomplete"
    return (
      <Button 
        variant="outlined" 
        size="small" 
        color="warning"
        onClick={() => handleKycClick(userId)}
      >
        Incomplete
      </Button>
    );
  };

  const columns = [
    { name: "Name" },
    { name: "Email" },
    { name: "Phone" },
    // { name: "Address" },
    // { name: "City" },
    { name: "Status" },
    { name: "KYC Status" },
    { name: "Active" },
    { name: "View" },
    { name: "Update" },
    { name: "Delete" }
  ];

  const rows = CollectorsData.map((collector, index) => ({
    name: collector.name,
    email: collector.email,
    phone: collector.phoneNumber,
    // address: collector.Address,
    // city: collector.city,
    status: collector.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
    kycStatus: getKycStatusButton(collector.id),
    active: <Switch checked={collector.status} onChange={(e)=>handleStatusChange(e,collector.id)} />,
    view: <RemoveRedEyeIcon onClick={()=>handelView(collector.id)}/>,
    update: <BorderColorIcon onClick={() => handelUpdate(collector.id)}/>,
    delete: <DeleteIcon onClick={() => handleDeleteClick(collector.id)}/>
  }));

  const rows2 = WholesalersData.map((wholesaler, index) => ({
    name: wholesaler.name,
    email: wholesaler.email,
    phone: wholesaler.phoneNumber,
    // address: wholesaler.Address,
    // city: wholesaler.city,
    status: wholesaler.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
    kycStatus: getKycStatusButton(wholesaler.id),
    active: <Switch checked={wholesaler.status} onChange={(e)=>handleStatusChange(e,wholesaler.id)} />,
    view: <RemoveRedEyeIcon onClick={()=>handelView(wholesaler.id)}/>,
    update: <BorderColorIcon onClick={() => handelUpdate(wholesaler.id)}/>,
    delete: <DeleteIcon onClick={() => handleDeleteClick(wholesaler.id)}/>
  }));

  const rows3 = MediatorsData.map((mediator, index) => ({
    name: mediator.name,
    email: mediator.email,
    phone: mediator.phoneNumber,
    // address: mediator.Address,
    // city: mediator.city,
    status: mediator.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
    kycStatus: getKycStatusButton(mediator.id),
    active: <Switch checked={mediator.status} onChange={(e)=>handleStatusChange(e,mediator.id)} />,
    view: <RemoveRedEyeIcon onClick={()=>handelView(mediator.id)}/>,
    update: <BorderColorIcon onClick={() => handelUpdate(mediator.id)}/>,
    delete: <DeleteIcon onClick={() => handleDeleteClick(mediator.id)}/>
  }));

  const rows4 = FactoryData.map((factory, index) => ({
    name: factory.name,
    email: factory.email,
    phone: factory.phoneNumber,
    // address: factory.Address,
    // city: factory.city,
    status: factory.status ? <Button color='success' variant="contained" >Active</Button> : <Button color='error' variant="contained">Inactive</Button>,
    kycStatus: getKycStatusButton(factory.id),
    active: <Switch checked={factory.status} onChange={(e)=>handleStatusChange(e,factory.id)} />,
    view: <RemoveRedEyeIcon onClick={()=>handelView(factory.id)}/>,
    update: <BorderColorIcon onClick={() => handelUpdate(factory.id)}/>,
    delete: <DeleteIcon onClick={() => handleDeleteClick(factory.id)}/>
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
              <Box>
                <Typography
                  style={{
                    fontSize: "40px",
                    fontWeight: 600,
                    fontFamily: "sans-serif",
                  }}
                >
                  Vendors
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  onClick={handelRequest}
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

        {/* KYC Details Modal */}
        <Modal
          open={kycModalOpen}
          onClose={handleKycModalClose}
          aria-labelledby="kyc-modal-title"
          aria-describedby="kyc-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              borderRadius: '10px',
              boxShadow: 24,
              p: 4,
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}
            >
              <Typography variant="h5" component="h2" style={{ fontWeight: "bold" }}>
                KYC Details
              </Typography>
              <CloseIcon 
                onClick={handleKycModalClose} 
                style={{ cursor: "pointer", fontSize: "24px" }}
              />
            </Box>

            {selectedKycData ? (
              <Box>
                {/* GST Number */}
                <Box style={{ marginBottom: "20px" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    GST Number
                  </Typography>
                  <Typography variant="body1" style={{ padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                    {selectedKycData.gstinNumber || "Not provided"}
                  </Typography>
                </Box>

                {/* Status */}
                <Box style={{ marginBottom: "20px" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Status
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color={
                      selectedKycData.status === 'approved' ? 'success' :
                      selectedKycData.status === 'rejected' ? 'error' : 'warning'
                    }
                    style={{ textTransform: 'uppercase' }}
                  >
                    {selectedKycData.status || 'pending'}
                  </Button>
                </Box>

                {/* Images */}
                <Box style={{ marginBottom: "20px" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "15px" }}>
                    Documents
                  </Typography>
                  <Box style={{ display: "flex", gap: "20px" }}>
                    {/* Owner Image */}
                    <Box>
                      <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        Owner Image
                      </Typography>
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
                          backgroundColor: "#f9f9f9"
                        }}
                      >
                        {selectedKycData.OwnerImage ? (
                          <img 
                            src={selectedKycData.OwnerImage} 
                            alt="Owner" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <PhotoSizeSelectActualIcon sx={{ fontSize: "40px", color: "#ccc" }} />
                        )}
                      </Box>
                    </Box>

                    {/* Warehouse Image */}
                    <Box>
                      <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        Warehouse Image
                      </Typography>
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
                          backgroundColor: "#f9f9f9"
                        }}
                      >
                        {selectedKycData.WareHouseImage ? (
                          <img 
                            src={selectedKycData.WareHouseImage} 
                            alt="Warehouse" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <PhotoSizeSelectActualIcon sx={{ fontSize: "40px", color: "#ccc" }} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Additional Info */}
                <Box>
                  <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Additional Information
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Created: {selectedKycData.createdAt ? new Date(selectedKycData.createdAt).toLocaleDateString() : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Last Updated: {selectedKycData.updatedAt ? new Date(selectedKycData.updatedAt).toLocaleDateString() : "N/A"}
                  </Typography>
                </Box>

                {/* KYC Status Update Section */}
                <Box style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "20px" }}>
                    Update KYC Status
                  </Typography>
                  
                  <Box style={{ marginBottom: "20px" }}>
                    <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
                      Status
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={kycStatusUpdate.status}
                        onChange={handleKycStatusChange}
                        displayEmpty
                        size="small"
                      >
                        <MenuItem value="">
                          <em>Select Status</em>
                        </MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box style={{ marginBottom: "20px" }}>
                    <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "bold" }}>
                      Remarks (Optional)
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={kycStatusUpdate.remarks}
                      onChange={handleKycRemarksChange}
                      placeholder="Add any remarks or comments..."
                      size="small"
                    />
                  </Box>

                  <Box style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <Button
                      variant="outlined"
                      onClick={handleKycModalClose}
                      disabled={isUpdatingKyc}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={updateKycStatus}
                      disabled={!kycStatusUpdate.status || isUpdatingKyc}
                      startIcon={isUpdatingKyc ? <CircularProgress size={20} /> : null}
                    >
                      {isUpdatingKyc ? 'Updating...' : 'Update Status'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box style={{ textAlign: "center", padding: "40px" }}>
                <Typography variant="h6" color="textSecondary">
                  No KYC data available for this user
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
                  The user has not completed their KYC verification process.
                </Typography>
              </Box>
            )}
          </Box>
        </Modal>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
