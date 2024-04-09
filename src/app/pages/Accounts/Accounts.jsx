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
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { InfoCard } from "../../../Components/InfoCard";
import Grid from "@mui/material/Grid";
import { OrdersCard } from "../../../Components/OrdersCard";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
const orangeTheme = createTheme({
  palette: {
    primary: {
      main: "#29BD7F", // Set the main color to your desired shade of orange
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
export const Accounts = () => {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    fontSize: "16px",
    textAlign: "left",
    padding: "8px",
  };

  const [value, setValue] = React.useState(0);
  const [searchInput, setSearchInput] = React.useState("");

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
    
  };

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
                  Accounts
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  style={{ marginLeft: "20px", background: "#FF8604" }}
                  size="large"
                >
                  Stock
                </Button>
              </Box>
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

          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 0.7, padding: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "20px" }}>
                    Current Accounts
                  </Typography>
                </Box>

                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    style={{
                      backgroundColor: "#FF86041A",
                      color: "#FF8604",
                      borderColor: "#FF8604",
                    }}
                    startIcon={<AddIcon />}
                  >
                    Expense
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: "20px", background: "black" }}
                    startIcon={<AddIcon />}
                  >
                    Invoice
                  </Button>

                  <UnfoldMoreIcon
                    sx={{ marginLeft: "20px", fontSize: "30px" }}
                  />

                  <AutorenewIcon
                    sx={{ marginLeft: "20px", fontSize: "30px" }}
                  />
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
                      label="Credit"
                      {...a11yProps(0)}
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: `${value === 0 ? "#29BD7F" : "#555555"}`,
                        marginRight: "5px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                    <Tab
                      label="Debit"
                      {...a11yProps(1)}
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: `${value === 1 ? "#29BD7F" : "#555555"}`,
                        marginRight: "5px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                    <Tab
                      label="Due"
                      {...a11yProps(2)}
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: `${value === 2 ? "#29BD7F" : "#555555"}`,
                        marginRight: "5px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                  </Tabs>
                </ThemeProvider>
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
                  <Box>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={{ ...thTdStyle }}>Name</th>
                          <th style={thTdStyle}>Amt.</th>
                          <th style={thTdStyle}>Date</th>
                          <th style={thTdStyle}>Due Date</th>
                          <th style={thTdStyle}>Remarks</th>
                          <th style={thTdStyle}></th>
                        </tr>
                      </thead>
                      <tbody>
                        <br />
                        <tr style={{ border: "1px solid #E4E4E4" }}>
                          <td style={thTdStyle}>Sundhir Bomchnad</td>
                          <td style={{ ...thTdStyle, color: "#29BD7F" }}>
                            ₹ 15,654
                          </td>
                          <td style={{ ...thTdStyle, color: "#525252" }}>
                            12 Dec 2023
                          </td>
                          <td
                            style={{
                              ...thTdStyle,
                              color: "crimson",
                              background: "#FFE5E5",
                            }}
                          >
                            22 Dec 2023
                          </td>
                          <td style={thTdStyle}>Service Charge</td>
                          <td style={thTdStyle}>
                            <MoreVertIcon />
                          </td>
                        </tr>
                        <br />
                        <tr style={{ border: "1px solid #E4E4E4" }}>
                          <td style={thTdStyle}>Sundhir Bomchnad</td>
                          <td style={{ ...thTdStyle, color: "#29BD7F" }}>
                            ₹ 15,654
                          </td>
                          <td style={{ ...thTdStyle, color: "#525252" }}>
                            12 Dec 2023
                          </td>
                          <td
                            style={{
                              ...thTdStyle,
                              color: "crimson",
                              background: "#FFE5E5",
                            }}
                          >
                            22 Dec 2023
                          </td>
                          <td style={thTdStyle}>Service Charge</td>
                          <td style={thTdStyle}>
                            <MoreVertIcon />
                          </td>
                        </tr>
                        <br />
                        <tr style={{ border: "1px solid #E4E4E4" }}>
                          <td style={thTdStyle}>Sundhir Bomchnad</td>
                          <td style={{ ...thTdStyle, color: "#29BD7F" }}>
                            ₹ 15,654
                          </td>
                          <td style={{ ...thTdStyle, color: "#525252" }}>
                            12 Dec 2023
                          </td>
                          <td
                            style={{
                              ...thTdStyle,
                              color: "crimson",
                              background: "#FFE5E5",
                            }}
                          >
                            22 Dec 2023
                          </td>
                          <td style={thTdStyle}>Service Charge</td>
                          <td style={thTdStyle}>
                            <MoreVertIcon />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                  Item Two
                </CustomTabPanel>

                <CustomTabPanel value={value} index={2}>
                  Item Three
                </CustomTabPanel>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
