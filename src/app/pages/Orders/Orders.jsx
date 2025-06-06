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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { Base_url } from "../../Config/BaseUrl";
import axios from "axios";
import { GenralTabel } from "../../TabelComponents/GenralTable";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";    

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "80%",
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
export const Orders = () => {
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
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [update, setupdate] = useState(0);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${Base_url}b2cOrder`); // Adjust the endpoint accordingly
      console.log("Orders data =>", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      const response = await axios.delete(`${Base_url}b2cOrder/${id}`);
      setupdate((prev) => prev + 1);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error.response.data;
    }
  };
  
  const handleDeleteClick = (ID) => {
    setDeleteId(ID);
    setOpen1(true);
  };
  
  const handleCloseone = () => {
    setOpen1(false);
    setDeleteId(null);
  };

  const handleViewClick = (ID) => {
    navigate(`/orders/view/${ID}`);
  };
  
  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteOrder(deleteId);
    }
    handleCloseone();
  };

  const handelAddorder = () => {
    navigate("add");
  };

  const handleUpdateOrder = (orderId) => {
    navigate(`edit/${orderId}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { name: 'Order No' },
    { name: 'Order From' },
    { name: 'Order To' },
    { name: 'Category' },
    { name: 'Total Amount' },
    { name: 'Status' },
    { name: 'Order Date' },
    { name: 'Location' },
    { name: 'View' },
    { name: 'Update' },
    { name: 'Delete' },
  ];

  const rows = orders.map((order) => {
    // Calculate total amount from items
    const totalAmount = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Get categories from items
    const categories = order.items.map(item => item.category).join(', ');
    
    // Get order from name
    const orderFrom = order.orderBy ? `${order.orderBy.firstName} ${order.orderBy.lastName}` : 'N/A';
    
    // Get order to name
    const orderTo = order.orderTo ? order.orderTo.name : 'N/A';
    
    // Get location
    const location = order.location ? order.location.googleAddress : 'N/A';

    return {
      'Order No': order.orderNo,
      'Order From': orderFrom,
      'Order To': orderTo,
      'Category': categories,
      'Total Amount': totalAmount,
      'Status': order.orderStatus === 'Pending' ? (
        <Button color='warning' variant="contained">Pending</Button>
      ) : (
        <Button color='success' variant="contained">New</Button>
      ),
      'Order Date': new Date(order.createdAt).toLocaleDateString(),
      'Location': location,
      'View': <RemoveRedEyeIcon onClick={() => handleViewClick(order._id)} />,
      'Update': <BorderColorIcon onClick={() => handleUpdateOrder(order._id)} />,
      'Delete': <DeleteIcon onClick={() => handleDeleteClick(order._id)}/>,
    };
  });

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
                  Orders
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  style={{ marginLeft: "20px", background: "#FF8604" }}
                  startIcon={<AddIcon />}
                  onClick={handelAddorder}
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
                    label="Incoming Orders"
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
                    label="Assigned"
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

          <Box
            sx={{
              width: "100%",
              marginTop: "20px",
              height: "70vh",
              overflow: "auto",
            }}
          >
            <CustomTabPanel value={value} index={0}>
              {/* <Grid container spacing={2}>
                {orders &&
                  orders.map((el, index) => {
                    return (
                      <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                        <OrdersCard
                          Fun={handleOpen}
                          name={"Ankit Dixit"}
                          value={"45,000"}
                          phone={"9251466357"}
                          address={
                            "Plot Number 116, Lane Number 4, Rathore Nagar, Vaishali Nagar, 302039"
                          }
                          Data={el}
                        />
                      </Grid>
                    );
                  })}
              </Grid> */}
              <GenralTabel rows={rows} column={columns} />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              Item Two
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
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              label="Search"
              id="outlined-start-adornment"
              size="small"
              sx={{ width: "250px" }}
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

            <CloseIcon
              onClick={handleClose}
              sx={{ marginTop: "-20px", fontSize: "23px" }}
            />
          </Box>

          <Box sx={{ marginTop: "20px" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thTdStyle }}>Name</th>
                  <th style={thTdStyle}>Contect no</th>
                  <th style={thTdStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={thTdStyle}>Ankit dixit</td>
                  <td style={thTdStyle}>9251466357</td>
                  <td style={thTdStyle}>
                    <Button
                      variant="outlined"
                      sx={{ color: "black", borderColor: "black" }}
                    >
                      Assign Order
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td style={thTdStyle}>Ankit dixit</td>
                  <td style={thTdStyle}>9251466357</td>
                  <td style={thTdStyle}>
                    <Button
                      variant="outlined"
                      sx={{ color: "black", borderColor: "black" }}
                    >
                      Assign Order
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td style={thTdStyle}>Ankit dixit</td>
                  <td style={thTdStyle}>9251466357</td>
                  <td style={thTdStyle}>
                    <Button
                      variant="outlined"
                      sx={{ color: "black", borderColor: "black" }}
                    >
                      Assign Order
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={open1}
        onClose={handleCloseone}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseone}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
