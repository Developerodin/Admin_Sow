import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export const CategoriesCard = ({Data,fun,funEdit}) => {
  const navigate = useNavigate()
  const handelView =(id) =>{
    navigate(`view-categorie/${id}`)
 }



  return (
    <Box sx={{border:"0.5px dashed grey",borderRadius:"10px",padding:"5px",minHeight:"150px",maxHeight:"200px",position:"relative"}}>
        
        <Box>
            <Box>
                <Typography sx={{fontSize:"23px"}}>{Data.name.toUpperCase()}</Typography>
            </Box>

            <Box>
                <Typography sx={{fontSize:"18px",height:"50px"}}>Sub-categories : {Data.sub_category.length}</Typography>
            </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "45px", bottom: 5, position: "absolute", height: "50px", width: "100%" }}>
  <Button
    variant="contained"
    size="small"
    startIcon={<img src="https://img.icons8.com/ios/50/visible--v1.png" alt="visible" style={{ width: 17, height: 16, filter: "invert(100%)" }} />}
    sx={{ backgroundColor: "primary", color: "#fff", marginRight: "20px", marginLeft: "7px" }}
    onClick={() => handelView(Data._id)}
  >
    View
  </Button>
  <Button
    variant="contained"
    size="small"
    startIcon={<img src="https://img.icons8.com/ios/50/create-new.png" alt="create-new" style={{ width: 16, height: 16, filter: "invert(100%)" }} />}
    sx={{ backgroundColor: "primary", color: "#fff", marginRight: "20px" }}
    onClick={() => funEdit()}
  >
    Edit
  </Button>
  <Button
    variant="contained"
    size="small"
    startIcon={<img src="https://img.icons8.com/parakeet-line/50/delete-sign.png" alt="filled-trash" style={{ width: 16, height: 16, filter: "invert(100%)" }} />}
    sx={{ backgroundColor: "primary", color: "#fff", marginRight: "18px" }}
    onClick={() => fun(Data._id)}
  >
    Delete
  </Button>
</Box>


</Box>
  )
}
