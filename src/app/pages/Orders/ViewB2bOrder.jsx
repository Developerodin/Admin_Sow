import React, { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { Base_url } from '../../Config/BaseUrl';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const ViewB2bOrder = () => {
  const { id } = useParams(); 
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const getOrderById = async () => {
    try {
      const response = await axios.get(`${Base_url}api/b2b_orders`);
      const filteredOrder = response.data.find(order => order._id === id);
      if (filteredOrder) {
        console.log('Order data:', filteredOrder);
        setOrderData(filteredOrder);
        setError(null);
      } else {
        setError(`No order found with ID ${id}`);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'An error occurred while fetching order details.');
    }
  };

  useEffect(() => {
    getOrderById(); 
  }, [id]); 

const handelGoBack = () => {
  window.history.back();
};


  

  return (
    
    <div>
      
      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        orderData && (
          <><div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
                <div className="card-header cursor-pointer">
                  <div className="card-title m-0">

                  <div onClick={handelGoBack} style={{backgroundColor:"#7265bd",width:"35px",height:"35px",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"10px"}}>
                <ArrowBackIosIcon style={{fontSize:"16px",color:"#fff"}}/>
             </div>
             <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginLeft:"15px"}}>
                    <h3 className="fw-bolder " >{orderData.form ? orderData.from.registerAs : 'Default'}  Details</h3>
                  </div>
                  </div>


                </div>
                <div className="card-body p-9">
                  <div className="row mb-6">
                    <label className="col-lg-4 fw-bold text-muted">Name</label>
                    <div className="col-lg-8">
                      <span className="fw-bolder fs-6">{orderData.from ? orderData.from.name : 'Default Name'}</span>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 fw-bold text-muted">Email</label>
                    <div className="col-lg-8">
                      <span className="fw-bolder fs-6">{orderData.from ?  orderData.from.email : 'Default'}</span>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 fw-bold text-muted">Phone</label>
                    <div className="col-lg-8">
                      <span className="fw-bolder fs-6">{orderData.from ? orderData.from.mobile : 'Default'}</span>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 fw-bold text-muted">Address</label>
                    <div className="col-lg-8">
                      <span className="fw-bolder fs-6">{orderData.from ? orderData.from.Address : 'Default'}</span>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 fw-bold text-muted">City</label>
                    <div className="col-lg-8">
                      <span className="fw-bolder fs-6">{orderData.from ? orderData.from.city : 'Default'}</span>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 fw-bold text-muted">Country</label>
                    <div className="col-lg-8">
                      <span className="fw-bolder fs-6">{orderData.from ? orderData.from.country : 'Default'}</span>
                    </div>
                  </div>
                </div>
              </div><div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
                  <div className="card-header cursor-pointer">
                    <div className="card-title m-0">
                      <h3 className="fw-bolder m-0">{orderData.to.registerAs }  Details</h3>
                    </div>
                  </div>
                  <div className="card-body p-9">
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Name</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.to.name}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Email</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.to.email}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Phone</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.to.mobile}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Address</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.to.Address}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">City</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.to.city}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Country</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.to.country}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
                
                <div className="card-header cursor-pointer">
                    <div className="card-title m-0">
                      <h3 className="fw-bolder m-0">Order Details</h3>
                    </div>
                  </div>
                  <div className="card-body p-9">
                  <div className="row mb-6">
                 <label className="col-lg-4 fw-bold text-muted">Status</label>
            <div className="col-lg-8">
        <span
      className={`fw-bolder fs-6 ${orderData.status === 'pending' ? 'text-danger' : orderData.status === 'complete' ? 'text-success' : ''}`}
    >
      {orderData.status.toUpperCase()}
    </span>
  </div>
</div>
                    
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted"> Date</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.orderDate}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Order From</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.from ? orderData.from.name : 'Default'}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Order To</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.to.name}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Category</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.details.category}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Sub Category</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.details.sub_category}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Quantity</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6">{orderData.details.quantity}</span>
                      </div>
                    </div>
                    <div className="row mb-6">
                      <label className="col-lg-4 fw-bold text-muted">Amount</label>
                      <div className="col-lg-8">
                        <span className="fw-bolder fs-6"> ₹ {orderData.totalAmount}</span>
                      </div>
                    </div>




              </div>
              </div>

                
                
          </>
        )
      )}
    </div>
  );
};


