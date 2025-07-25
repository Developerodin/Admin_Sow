import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Base_url } from '../../Config/BaseUrl';
import DeleteIcon from '@mui/icons-material/Delete';

export const DailyRate = () => {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState({});
  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [update, setUpdate] = useState(0);
  const [Data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${Base_url}daily_rates`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, [update]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Base_url}daily_rates/${id}`);
      setUpdate((prev) => prev + 1);
    } catch (error) {
      console.error('Error submitting plan details:', error);
    }
  };

  const handleSearch = () => {
    // Handle search logic
  };

  const handleResetFilter = () => {
    setSearchInput('');
    // Reset filter logic
  };

  const handelAddClick = () => {
    navigate('create-daily-rates');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedYear = year < 10 ? `0${year}` : year;

    return `${formattedDay}:${formattedMonth}:${formattedYear}`;
  };

  const handleReadMore = (content) => {
    setSelectedContent(content);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Card sx={{ minHeight: '100vh' }}>
        <CardContent>
          <Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                style={{
                  fontSize: '40px',
                  fontWeight: 600,
                  fontFamily: 'sans-serif',
                }}
              >
                Daily Rates
              </Typography>

              <Button
                variant="contained"
                style={{ marginLeft: '20px', background: '#FF8604' }}
                startIcon={<AddIcon />}
                onClick={handelAddClick}
              >
                Update
              </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '20px' }} />

            <Box
              sx={{
                display: 'flex',
                marginTop: '20px',
                justifyContent: 'left',
                alignItems: 'center',
              }}
            >
              <TextField
                label="Search"
                id="outlined-start-adornment"
                size="small"
                sx={{ m: 1, width: '250px' }}
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
                  marginLeft: '20px',
                  background: 'black',
                  height: '33px',
                }}
                startIcon={<FilterListIcon />}
              >
                A-Z
              </Button>
            </Box>
          </Box>

          <Box
            sx={{ width: '100%', marginTop: '20px', height: '70vh', overflow: 'auto' }}
          >
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
                        height: isExpanded ? 'auto' : '320px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '10px',
                        }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '21px' }}>
                          {el.name.toUpperCase()}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '15px',
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>
                          Date: {formatDate(el.date)}
                        </span>
                      </div>

                      <div 
                        style={{ 
                          textAlign: 'left',
                          flex: 1,
                          overflow: 'hidden',
                          marginBottom: '15px',
                        }}
                      >
                        {el.text.split(',').map((textPart, idx) => (
                          <Typography key={idx} style={{ marginBottom: '5px' }}>
                            {textPart}
                          </Typography>
                        ))}
                      </div>

                      {/* Action buttons - always visible at bottom */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          marginTop: 'auto',
                          paddingTop: '15px',
                          borderTop: '1px solid #f0f0f0',
                          gap: '15px',
                        }}
                      >
                        <div
                          onClick={() => handleReadMore(el.text)}
                          style={{ 
                            cursor: 'pointer', 
                            color: 'white',
                            backgroundColor: '#1976d2',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                            ':hover': {
                              backgroundColor: '#1565c0'
                            }
                          }}
                        >
                          Read More
                        </div>
                        
                        <DeleteIcon
                          style={{ 
                            color: '#c62828',
                            fontSize: '34px',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s',
                            ':hover': {
                              backgroundColor: '#ffebee'
                            }
                          }}
                          onClick={() => handleDelete(el._id)}
                        />
                      </div>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Typography variant="h6">Details</Typography>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>
  <DialogContent sx={{ height: '300px', overflowY: 'auto',whiteSpace:'pre-wrap' }}>
    <Typography
      
      sx={{
        
       
        
        textAlign: 'left',
      }}
    >
      {selectedContent}
    </Typography>
  </DialogContent>
</Dialog>

    </Box>
  );
};
