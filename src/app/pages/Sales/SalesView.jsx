// Import the necessary modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Base_url } from '../../Config/BaseUrl';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { ThemColor } from "../../Them/ThemColor";

export const SalesView = () => {
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState([]);

    const thTdStyle = {
        fontSize: "16px",
    };

    useEffect(() => {
        axios.get(`${Base_url}api/invoices`)
            .then(response => {
                console.log(response.data);
                setSalesData(response.data);
            })
            .catch(error => {
                console.error('Error fetching sales data:', error);
            });
    }, []);


    const handleDeleteInvoice = async (invoiceId) => {
        try {
            await axios.delete(`${Base_url}api/invoices/${invoiceId}`);
            
            setSalesData(prevSalesData => prevSalesData.filter(sale => sale._id !== invoiceId));
            console.log("Invoice deleted successfully");
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };  

    const handleViewInvoice = (invoiceId) => {
        console.log("Invoice ID:", invoiceId);
        navigate(`/sales/sales-view/view/${invoiceId}`);
    }

    const handleGoBack = () => {
        window.history.back();
    };   
 

    return (
        <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
            <div className="card-header cursor-pointer">
                <div className="card-title m-0" >
                    <div onClick={handleGoBack} style={{ backgroundColor: "#7265bd", width: "35px", height: "35px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px" }}>
                        <ArrowBackIosIcon style={{ fontSize: "16px", color: "#fff" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "15px" }}>
                        <h1 className="fw-bolder" >Invoices Details</h1>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0, wordWrap: 'break-word', backgroundColor: '#fff', backgroundClip: 'border-box', border: '0px solid transparent', borderRadius: '0px' }}>
                        <div className="card-body text-center" style={{ flexGrow: 1, flexShrink: 1, flexBasis: 'auto', padding: '1.25rem' }}>
                            <h5 className="card-title m-b-0" style={{ position: 'relative', fontWeight: '600', marginBottom: '10px' }}>Invoices</h5>
                        </div>
                        <div className="table-responsive" style={{ flexGrow: 1 }}>
                            <table className="table" style={{ width: '100%', maxWidth: '100%', marginBottom: '1rem', backgroundColor: 'transparent' }}>
                                <thead className="thead-light">
                                    <tr>
                                        <th></th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Product</th>
                                        <th scope="col">Gst NO</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">VIEW</th>
                                        <th scope="col">DELETE</th>
                                    </tr>
                                </thead>
                                <tbody className="customtable">
                                    {salesData.map((sale, index) => (
                                        <tr key={index}>
                                            <th></th>
                                            <td>{sale.customerName}</td>
                                            <td>{sale.productName}</td>
                                            <td>{sale.gstNumber}</td>
                                            <td>{sale.email}</td>
                                            <td style={thTdStyle}>
                                                <Button
                                                    variant="contained"
                                                    style={{ backgroundColor: `${ThemColor.buttons}` }}
                                                    onClick={() => handleViewInvoice(sale._id)} 
                                                >
                                                    VIEW
                                                </Button>
                                            </td>
                                            <td style={thTdStyle}>
                                                <Button
                                                    variant="contained"
                                                    sx={{ bgcolor: "orange" }}
                                                    onClick={() => handleDeleteInvoice(sale._id)}
                                                >
                                                    DELETE
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
