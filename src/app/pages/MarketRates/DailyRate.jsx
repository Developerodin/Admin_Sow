import { Box, Button, Card, CardContent, Tab,InputAdornment, Tabs, Typography, TextField } from '@mui/material'
import React, { useEffect , useState} from 'react'
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { InfoCard } from '../../../Components/InfoCard';
import Grid from "@mui/material/Grid";
import { OrdersCard } from '../../../Components/OrdersCard';
import { PlansCard } from '../../../Components/PlansCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from '../../Config/BaseUrl'; 
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
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
export const DailyRate = () => {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState({});
  const [value, setValue] = React.useState(0);
  const [searchInput, setSearchInput] = React.useState('');
   const [update,setUpdate] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangetabs = (event, newValue) => {
    setValue(newValue);
  };

  const [Data, setData] = useState([]);


  useEffect(() => {
    
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${Base_url}api/daily_rates`); 
        console.log('Fetched plans:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans(); // Call the fetchPlans function when the component mounts
  }, [update]);


  const handleDelete = async (id) => {
   
     try {
        // Send a POST request to the backend API endpoint
        const response = await axios.delete(`${Base_url}api/daily_rates/${id}`);
        console.log('Response:', response.data);
        setUpdate((prev)=>prev+1)
        // Optionally, you can redirect the user or show a success message here
      } catch (error) {
        console.error('Error submitting plan details:', error);
        // Optionally, you can show an error message to the user
      }
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

  const handelAddClick = ()=>{
    navigate("create-daily-rates")
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100; // Get last two digits of the year
  
    // Add leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedYear = year < 10 ? `0${year}` : year;
  
    return `${formattedDay}:${formattedMonth}:${formattedYear}`;
  }

  const handleReadMore = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box >

       <Card sx={{minHeight:"100vh"}}>
        <CardContent>

          <Box >
          <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <Box>
            <Typography style={{fontSize:"40px",fontWeight:600,fontFamily:"sans-serif"}} >
             Daily Rates
            </Typography>
            </Box>
           

            <Box>
              
              <Button variant="contained" style={{marginLeft:"20px",background:"#FF8604"}} startIcon={<AddIcon />} onClick={handelAddClick}>Update</Button>
            </Box>
          </Box>
             

          <Box sx={{ borderBottom: 1, borderColor: 'divider',marginTop:"20px" }}>
     
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
         

          <Box sx={{ width: '100%',marginTop:"20px",height:"70vh",overflow:"auto" }}>
      
          <Grid container spacing={2}>
      {Data.map((el, index) => {
        const isExpanded = expandedCards[index];
        return (
          <Grid key={index} item xs={6}>
            <div
              style={{
                border: '1px solid #e0e0e0',
                padding: '20px',
                borderRadius: '20px',
                height: isExpanded ? 'auto' : '275px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '21px' }}>{el.name.toUpperCase()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>Date: {formatDate(el.date)}</span>
              </div>

              <div style={{ textAlign: 'left' }}>
                {el.text.split(',').map((textPart, idx) => (
                  <Typography key={idx}>{textPart}</Typography>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: '20px' }}>
                <CancelOutlinedIcon
                  onClick={() => handleDelete(el._id)}
                  style={{ fontSize: '24px', color: 'crimson', marginRight: '20px' }}
                />
              </div>

              {!isExpanded && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    padding: '5px 10px',
                  }}
                >
                  <Button onClick={() => handleReadMore(index)} variant="contained" color="primary">
                    Read More
                  </Button>
                </div>
              )}
            </div>
          </Grid>
        );
      })}
    </Grid>


    </Box>
    
        </CardContent>
       </Card>

       
   </Box>
  )
}

