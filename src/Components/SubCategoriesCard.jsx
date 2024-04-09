import React from 'react'
import { Box, Button, Typography } from '@mui/material';
export const SubCategoriesCard = ({Data,fun,funEdit}) => {
  return (
    <Box sx={{border:"0.5px dashed grey",borderRadius:"5px",padding:"20px"}}>
        
    <Box>
        <Box>
            <Typography sx={{fontSize:"25px"}}>{Data.name}</Typography>
        </Box>
        <Box>
                <Typography sx={{fontSize:"18px"}}>Price : {Data.price} {Data.unit}</Typography>
        </Box>
       
    </Box>

<Box sx={{display:"flex",justifyContent:"right",alignItems:"center",marginTop:"10px"}}>
<Button variant='contained' size='small'  sx={{backgroundColor:"black",marginRight:"20px"}} onClick={()=>funEdit()} >Edit</Button>
      <Button variant='contained' size='small'  sx={{backgroundColor:"crimson"}}  onClick={()=>fun(Data._id)}>Delete</Button>
</Box>

</Box>
  )
}
