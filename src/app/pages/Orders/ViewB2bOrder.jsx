import React, { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { Base_url, Base_url2 } from '../../Config/BaseUrl';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const ViewB2bOrder = () => {
  const { id } = useParams(); 
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const getOrderById = async () => {
    try {
      const response = await axios.get(`${Base_url2}b2bOrder/${id}`);
      setOrderData(response.data);
      console.log("response data ==>", response.data);
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
          <>
            <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
              <div className="card-header cursor-pointer">
                <div className="card-title m-0">
                  <div onClick={handelGoBack} style={{ backgroundColor: "#7265bd", width: "35px", height: "35px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px" }}>
                    <ArrowBackIosIcon style={{ fontSize: "16px", color: "#fff" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "15px" }}>
                    <h3 className="fw-bolder ">{orderData.orderBy.registerAs} Details</h3>
                  </div>
                </div>
              </div>
              <div className="card-body p-9">
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Name</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.orderBy.name}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Phone</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.orderBy.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
              <div className="card-header cursor-pointer">
                <div className="card-title m-0">
                  <h3 className="fw-bolder m-0">{orderData.orderTo.registerAs} Details</h3>
                </div>
              </div>
              <div className="card-body p-9">
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Name</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.orderTo.name}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Phone</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.orderTo.phoneNumber}</span>
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
                    <span className={`fw-bolder fs-6 ${orderData.orderStatus === 'Pending' ? 'text-danger' : orderData.orderStatus === 'Complete' ? 'text-success' : ''}`}>
                      {orderData.orderStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Order No</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.orderNo}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Date</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{new Date(orderData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Category</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.category}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Sub Category</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.subCategory}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Weight</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.weight} {orderData.unit}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Amount</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">₹ {orderData.totalPrice}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Location</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.location.googleAddress}</span>
                  </div>
                </div>
                <div className="row mb-6">
                  <label className="col-lg-4 fw-bold text-muted">Notes</label>
                  <div className="col-lg-8">
                    <span className="fw-bolder fs-6">{orderData.notes}</span>
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