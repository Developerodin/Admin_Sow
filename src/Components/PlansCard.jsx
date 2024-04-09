import React,{useEffect, useState} from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
export const PlansCard = ({plan}) => {


  
  const [plans, setPlans] = useState([])

  useEffect(() => {
    // const plansData = async () => {
    //   try {
    //     const data = await axios.get(`${Base_url}api/plans`);
    //     console.log("plans Data" ,data.data)
    //     setPlans(data.data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // plansData()
    console.log("plan ==>",plan);
  }
  ,[]);
     
  

  return (
    <Card sx={{ width: '280px', height: '476px', borderRadius: '5px' }}>
      <CardContent sx={{ padding: 0, margin: 0 }}>
        {/* {plans.map((plan,index) => ( */}
          <Box >
            <Box  sx={{ height: 'auto', background: 'black', padding: '20px' }}>
              <Typography sx={{ color: '#fff', fontSize: '17px' }}>{plan.name} Plan</Typography>
              <Typography sx={{ color: '#fff', fontSize: '25px', textAlign: 'left', marginTop: '20px' }}>
                ₹ {plan.price} / <span style={{ fontSize: '16px', color: 'grey' }}>{plan.priceType}</span>
              </Typography>
            </Box>
  
            <Box sx={{ padding: '20px' }}>
              <Box>
                <Typography sx={{ fontSize: '18px' }}>Features</Typography>
              
                <Typography sx={{ fontSize: '14px', color: 'grey' }}>Everything In Your {plan.name} Plan</Typography>
              </Box>
  
              
              
                <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '15px' }}>
                  <Box>
                    <CheckCircleIcon sx={{ fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ marginLeft: '10px' }}>
                    <Typography sx={{ fontSize: '14px' }}>{plan.features}</Typography>
                  </Box>
                </Box>
                <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '15px' }}>
                  <Box>
                    <CheckCircleIcon sx={{ fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ marginLeft: '10px' }}>
                    <Typography sx={{ fontSize: '14px' }}>{plan.features}</Typography>
                  </Box>
                </Box>
                <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '15px' }}>
                  <Box>
                    <CheckCircleIcon sx={{ fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ marginLeft: '10px' }}>
                    <Typography sx={{ fontSize: '14px' }}>{plan.features}</Typography>
                  </Box>
                </Box>
                <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '15px' }}>
                  <Box>
                    <CheckCircleIcon sx={{ fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ marginLeft: '10px' }}>
                    <Typography sx={{ fontSize: '14px' }}>{plan.features}</Typography>
                  </Box>
                </Box>
                <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '15px' }}>
                  <Box>
                    <CheckCircleIcon sx={{ fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ marginLeft: '10px' }}>
                    <Typography sx={{ fontSize: '14px' }}>{plan.features}</Typography>
                  </Box>
                </Box>
                <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '15px' }}>
                  <Box>
                    <CheckCircleIcon sx={{ fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ marginLeft: '10px' }}>
                    <Typography sx={{ fontSize: '14px' }}>{plan.features}</Typography>
                  </Box>
                </Box>
              
  
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25px' }}>
                <Button variant='contained' size='large' sx={{ backgroundColor: '#FF8604' }}>Get Started</Button>
              </Box>
            </Box>
          </Box>
        {/* ))} */}
      </CardContent>
    </Card>
  );
  
}
