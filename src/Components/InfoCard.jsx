import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const InfoCard = ({Data}) => {
  const navigate = useNavigate()
  const handelView = (id)=>{
    navigate(`view/${id}`)
  }
  return (
    <Box sx={{width:"330px",height:"276px",border:"0.5px dashed grey",borderRadius:"5px",padding:"20px",overflow:"auto"}}>
    <Box sx={{display:"flex",justifyContent:"left",alignItems:"center"}}>
      <Box>
        <PersonIcon sx={{fontSize:"30px"}}/>
      </Box>
      <Box sx={{marginLeft:"10px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.name}</Typography>
      </Box>
    </Box>

    <Box sx={{display:"flex",justifyContent:"left",alignItems:"center",marginTop:"15px"}}>
      <Box>
        <LocalPhoneIcon sx={{fontSize:"30px"}}/>
      </Box>
      <Box sx={{marginLeft:"10px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.mobile}</Typography>
      </Box>
    </Box>

    <Box sx={{display:"flex",justifyContent:"left",marginTop:"15px"}}>
      <Box>
        <FmdGoodIcon sx={{fontSize:"30px"}}/>
      </Box>
      <Box sx={{marginLeft:"10px",height:"50px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.Address},{Data.pincode},{Data.city} {Data.country}</Typography>
      </Box>
    </Box>

    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"35px"}}>
      <Button variant='contained' size='large' expand sx={{backgroundColor:"black"}} onClick={()=>handelView(Data._id)}>View Details</Button>
    </Box>

</Box>
  )
}
