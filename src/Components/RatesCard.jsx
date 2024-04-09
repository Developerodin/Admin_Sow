import React from 'react'
import { Box, Button, Typography } from '@mui/material';
export const RatesCard = ({Data}) => {
  return (
    <Box sx={{border:"0.5px dashed grey",borderRadius:"5px",padding:"20px",height:"100px"}}>
        
    <Box>
        <Box>
            <Typography sx={{fontSize:"23px"}}>{Data.name}: ₹ {Data.price} {Data.unit} </Typography>
        </Box>

       
    </Box>

{/* <Box sx={{display:"flex",justifyContent:"right",alignItems:"center",marginTop:"10px"}}>
  <Button variant='contained' size='small' expand sx={{backgroundColor:"black"}}>Edit</Button>
</Box> */}

</Box>
  )
}
