import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { Button, TextField, Card, CardContent, Box, TextareaAutosize } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Base_url } from '../../Config/BaseUrl';

const pad2 = (n) => String(n).padStart(2, '0');

/** Indian Standard Time (UTC+5:30) — used for default time regardless of device timezone */
const IST = 'Asia/Kolkata';

/** Value for <input type="time" /> (HH:mm 24h) in IST */
const getNowTimeInputValue = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const hour = parts.find((p) => p.type === 'hour')?.value;
  const minute = parts.find((p) => p.type === 'minute')?.value;
  if (hour == null || minute == null) {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
  let h = parseInt(hour, 10);
  if (h === 24) h = 0;
  return `${pad2(h)}:${pad2(parseInt(minute, 10))}`;
};

/** API expects e.g. "10:30 AM" (interpreted as IST when entered on this form) */
const timeInputTo12h = (hhmm) => {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) {
    return timeInputTo12h(getNowTimeInputValue());
  }
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${pad2(m)} ${period}`;
};

export const UpdateDailyRates = () => {
  const [timeInput, setTimeInput] = useState(getNowTimeInputValue);

  const [formData, setFormData] = useState({
    name: '',
    text: '',
    date: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      time: timeInputTo12h(timeInput),
    };
    console.log('Data ==>', payload);
    try {
      const response = await axios.post(`${Base_url}daily_rates/`, payload);
      console.log('Response:', response.data);
      setFormData({
        name: '',
        text: '',
        date: '',
      });
      setTimeInput(getNowTimeInputValue());
      handleBackButton();
    } catch (error) {
      console.error('Error submitting plan details:', error);
    }
  };

  const handleBackButton = () => {
    window.history.back();
  };


  return (
    <Card>
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          <div className="card-title m-0">
            <div
              onClick={handleBackButton}
              style={{
                backgroundColor: "#7265bd",
                width: "35px",
                height: "35px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              <ArrowBackIcon style={{ fontSize: "16px", color: "#fff" }} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "15px",
              }}
            >
              <h3 className="fw-bolder ">Update Daily Rate</h3>
            </div>
          </div>
        </Box>

        <Box
         
        >
          <form onSubmit={handleSubmit}>
          <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
                
              <TextField
                type="date"
                fullWidth
                margin="normal"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                label="Date"
              />

              <TextField
                type="time"
                fullWidth
                margin="normal"
                label="Time (IST)"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 60 }}
              />

<TextareaAutosize style={{width:"100%",padding:"10px"}} aria-label="Rates Text" name="text"
                value={formData.text}
                onChange={handleInputChange} minRows={6} placeholder="Rates Text" />
           


           
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
           
          </form>
        </Box>

      </CardContent>
    </Card>
  );
};
