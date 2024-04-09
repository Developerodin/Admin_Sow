
import React,{useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { Box, Button } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from "axios";
import { errorMonitor } from 'events';
import CircularProgress from '@mui/material/CircularProgress';

import LinearProgress from '@mui/material/LinearProgress';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// function createData(
//   name: string,
//   checkbox:undefined,
  
// ) {
//   return { name,checkbox};
// }

// const rows = [
//   createData('Admin',<Checkbox {...label} />),
//   createData('Developer',<Checkbox {...label} />),
//   createData('Analyst',<Checkbox {...label} />),
//   createData('Support',<Checkbox {...label} />),
//   createData('Trial',<Checkbox {...label} />),
// ];

// const initvalues={
//   email:"",
//   name:"",
//   password:""
// }

// const column=[
//    {name:"Sno"},
//    {name:"Sno2"},
//    {name:"Sno3"},
//    {name:"Sno"},
//    {name:"Sno2"},
//    {name:"Sno3"},
// ]

// const rows=[
//    {sno:"1",nmae:"Aksahy",email:"aksahy09@gmail.com",sno2:"1",nmae2:"Aksahy",email2:"aksahy09@gmail.com"},
//    {sno:"2",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"3",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"4",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"5",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"1",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"2",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"3",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"4",nmae:"Aksahy",email:"aksahy09@gmail.com"},
//    {sno:"5",nmae:"Aksahy",email:"aksahy09@gmail.com"},
// ]


export const GenralTabel = (props) => {
  const { rows, column } = props;

  // Initialize state unconditionally
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Check if rows are available before rendering
  if (!rows) {
    return null; // or return a placeholder, error message, or loading indicator
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
    return (
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {column.map((el, index) => (
                  <TableCell key={index + 123} align="center" sx={{ fontWeight: "bold" }}>
                    {el.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((el, index) => {
                  let data = {};
                  let data2 = [];
                  for (let i = 0; i < Object.keys(el).length; i++) {
                    data = Object.keys(el)[i];
                    data2[i] = el[data];
                  }
                  return (
                    <TableRow key={index + 1234} tabIndex={-1}>
                      {data2.map((els, index) => (
                        <TableCell key={index + 13} align="center">
                          {els}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    );
  };
  