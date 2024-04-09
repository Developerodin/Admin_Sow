import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Box, Button, Typography } from '@mui/material';

export const B2BOrdersCard = ({Fun,Data}) => {
  return (
    <Box sx={{border:"0.5px dashed grey",borderRadius:"5px",padding:"20px"}}>
      
    <Box sx={{display:"flex",justifyContent:"left",alignItems:"center",marginTop:"15px"}}>
      <Box>
      <Typography sx={{fontSize:"17px"}}>From :</Typography>
      </Box>
      <Box sx={{marginLeft:"10px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.from.name}</Typography>
      </Box>
    </Box>

    <Box sx={{display:"flex",justifyContent:"left",alignItems:"center",marginTop:"15px"}}>
      <Box>
      <Typography sx={{fontSize:"17px"}}>To :</Typography>
      </Box>
      <Box sx={{marginLeft:"10px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.to.name}</Typography>
      </Box>
    </Box>

    <Box sx={{display:"flex",justifyContent:"left",alignItems:"center",marginTop:"15px"}}>
      <Box>
      <Typography sx={{fontSize:"17px"}}>Category :</Typography>
      </Box>
      <Box sx={{marginLeft:"10px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.details.category}</Typography>
      </Box>
    </Box>

    <Box sx={{display:"flex",justifyContent:"left",alignItems:"center",marginTop:"15px"}}>
      <Box>
        <LocalPhoneIcon sx={{fontSize:"30px"}}/>
      </Box>
      <Box sx={{marginLeft:"10px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.to.mobile}</Typography>
      </Box>
    </Box>

    <Box sx={{display:"flex",justifyContent:"left",marginTop:"15px"}}>
      <Box>
        <FmdGoodIcon sx={{fontSize:"30px"}}/>
      </Box>
      <Box sx={{marginLeft:"10px"}}>
        <Typography sx={{fontSize:"17px"}}>{Data.to.Address},{Data.to.pincode},{Data.to.city},{Data.to.country}</Typography>
      </Box>
    </Box>

    <Box sx={{marginTop:"20px"}}>
      <Typography sx={{fontSize:"20px"}}>Estimated Value</Typography>

      <Typography sx={{fontSize:"30px"}}>₹ {Data.totalAmount}</Typography>
    </Box>

    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"25px"}}>
      <Button variant='contained' size='large' onClick={()=>Fun()} expand sx={{backgroundColor:"black"}}>View</Button>
    </Box>

</Box>
  )
}
