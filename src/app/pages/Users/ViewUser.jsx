import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Button } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Base_url, Base_url2 } from "../../Config/BaseUrl";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const ViewUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const getUserById = async () => {
    try {
      const response = await axios.get(`${Base_url2}b2cUser/${id}`);
      console.log("User data:", response.data);
      setUserData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching User details:", error);
      setError(error.message || "An error occurred while fetching user details.");
    }
  };

  useEffect(() => {
    getUserById();
  }, [id]);

  const handelGoBack = () => {
    window.history.back();
  };

  return (
    <div>
      {userData && (
        <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
          <div className="card-header cursor-pointer">
            <div className="card-title m-0">
              <div onClick={handelGoBack} style={{backgroundColor:"#7265bd",width:"35px",height:"35px",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"10px"}}>
                <ArrowBackIosIcon style={{fontSize:"16px",color:"#fff"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginLeft:"15px"}}>
                <h1 className="fw-bolder">User Details</h1>
              </div>            
            </div>
          </div>
          <div className="card-body p-9">
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Status</label>
              <div className="col-lg-8">
                <Button 
                  variant="contained" 
                  size="small"
                  color={userData.status === 'active' ? 'success' : 'error'}
                >
                  {userData.status === 'active' ? 'Active' : 'Inactive'}
                </Button>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Name</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{`${userData.firstName} ${userData.lastName}`}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Email</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.email}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Phone Number</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.phoneNumber}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Profile Type</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.profileType}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">KYC Status</label>
              <div className="col-lg-8">
                <Button 
                  variant="contained" 
                  size="small"
                  color={userData.isKYCVerified ? 'success' : 'error'}
                >
                  {userData.isKYCVerified ? 'Verified' : 'Not Verified'}
                </Button>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Referral Code</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.referralCode}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

