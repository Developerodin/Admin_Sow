import { Box, Button, Card, CardContent, Tab,InputAdornment, Tabs, Typography, TextField } from '@mui/material'
import React, { useEffect , useState} from 'react'
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { createTheme } from "@mui/material/styles";
import * as XLSX from 'xlsx';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from '../../Config/BaseUrl'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';







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
export const CreateExcelRates = () => {
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);
  const [searchInput, setSearchInput] = React.useState('');
   const [update,setUpdate] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangetabs = (event, newValue) => {
    setValue(newValue);
  };

  const handleBackButton = () => {
    window.history.back();
  };

  const [data, setData] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
      setIsDataReady(true); // Data is ready to be saved
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    if (isDataReady) {
      
      const dataToSend = JSON.stringify({
        items: data 
      });
  
      try {
        const response = await axios.post(`${Base_url}api/excel_data`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log("Data saved successfully", response.data);
      } catch (error) {
        console.error("Error saving data", error);
      }
    } else {
      console.log("No data to save");
    }
  };
  
  
  

//   useEffect(() => {
    
//     const fetchPlans = async () => {
//       try {
//         const response = await axios.get(`${Base_url}api/market_rates`); 
//         console.log('Fetched plans:', response.data);
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching plans:', error);
//       }
//     };

//     fetchPlans(); // Call the fetchPlans function when the component mounts
//   }, [update]);


 


  return (
    <Box >

       <Card sx={{minHeight:"100vh"}}>
        <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        onClick={handleBackButton}
        sx={{
          backgroundColor: "#7265bd",
          width: "35px",
          height: "35px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          cursor: "pointer",
          marginRight: "10px" 
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "16px", color: "#fff" }} />
      </Box>

      <Typography sx={{ fontSize: "34px", fontWeight: 600, fontFamily: "sans-serif" }}>
        Add Market Rates
      </Typography>
    </Box>
           

            <Box sx={{ borderBottom: 1, borderColor: 'divider',marginTop:"20px" }}>
     
      </Box>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Upload Excel File</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      {data.length > 0 && (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '20px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      padding: '10px',
                      borderBottom: '2px solid #ddd',
                      backgroundColor: '#f4f4f4',
                    }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSave}
            style={{
              textAlign: 'center',
              margin: '20px auto',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '4px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Save Data to Database
          </button>
        </>
      )}
    </div>



   
    
        </CardContent>
       </Card>

       
   </Box>
  )
}

