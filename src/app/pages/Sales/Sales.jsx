import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { ChartsWidget3 } from '../../../_metronic/partials/widgets';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
export const Sales = () => {
  const navigate = useNavigate()
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const thTdStyle = {
   fontSize:"16px",
    textAlign: 'left',
    padding: '8px',
};

const handelCreateInvoice = ()=>{
  navigate("create-invoice/")
}


const handelSalesView = ()=>{
  navigate("sales-view/")
}

  return (
    <Box >

       <Card sx={{minHeight:"100vh"}}>
        <CardContent>
        <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px dashed grey"}}>
            <Box>
            <Typography style={{fontSize:"40px",fontWeight:600,fontFamily:"sans-serif"}} >
             Sales
            </Typography>
            </Box>
           

            <Box>
              
              <Button variant="contained" style={{marginLeft:"5px",background:"#FF8604"}} onClick={handelCreateInvoice} startIcon={<AddIcon />} >Create Invoice</Button>
              <Button variant="contained" style={{marginLeft:"20px",background:"blue" ,width:"auto"}} onClick={handelSalesView} > View Invoice</Button>

            </Box>
          </Box>

        <Box sx={{display:"flex",marginTop:"30px"}}>

<Box style={{flex:1.7,height:"80vh"}}>
      <Box>
        <Typography sx={{fontSize:"30px"}}>Total Revenue : ₹ 45,000</Typography>
      </Box>

      <Box sx={{marginTop:"50px"}}>
      <ChartsWidget3 className='card-xl-stretch mb-xl-8'/>
      </Box>

      <Box sx={{display:"flex",marginLeft:"70px"}}>
        <Typography style={{fontSize:"18px"}}>X = Time Period</Typography>
        <Typography style={{fontSize:"18px",marginLeft:"20px"}}>Y = Sales</Typography>
      </Box>
</Box>

<Box style={{flex:1,height:"80vh"}}>
       
           <Box>
           <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={{ ...thTdStyle }}>Name</th>
                        <th style={thTdStyle}>Credit</th>
                        <th style={thTdStyle}>Date</th>
                        <th style={thTdStyle}></th>
                    </tr>
                </thead>
                <tbody >
                    <tr>
                        <td style={thTdStyle}>Ankit dixit</td>
                        <td style={thTdStyle}>₹ 45,000</td>
                        <td style={thTdStyle}>23 March 2023</td>
                        <td style={thTdStyle}>
                          <MoreVertIcon/>
                        </td>
                    </tr>
                  
                    <tr>
                        <td style={thTdStyle}>Ankit dixit</td>
                        <td style={thTdStyle}>₹ 45,000</td>
                        <td style={thTdStyle}>23 March 2023</td>
                        <td style={thTdStyle}>
                          <MoreVertIcon/>
                        </td>
                    </tr>

                    <tr>
                        <td style={thTdStyle}>Ankit dixit</td>
                        <td style={thTdStyle}>₹ 45,000</td>
                        <td style={thTdStyle}>23 March 2023</td>
                        <td style={thTdStyle}>
                          <MoreVertIcon/>
                        </td>
                    </tr>
                </tbody>
            </table>
           </Box>

</Box>

        </Box>
    
        </CardContent>
       </Card>

       
   </Box>
    
  )
} 
