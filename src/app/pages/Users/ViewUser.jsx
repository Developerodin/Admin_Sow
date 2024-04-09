import React, { useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Base_url } from "../../Config/BaseUrl";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { ThemColor } from "../../Them/ThemColor";

export const ViewUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const getUserById = async () => {
    try {
      const response = await axios.get(`${Base_url}api/users`);
      const filteredUser = response.data.find((user) => user._id === id);
      if (filteredUser) {
        console.log("User data:", filteredUser);
        setUserData(filteredUser);
        setError(null);
      } else {
        setError(`No order found with ID ${id}`);
      }
    } catch (error) {
      console.error("Error fetching User details:", error);
      setError(
        error.message || "An error occurred while fetching user details."
      );
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
            <div className="card-title m-0" >
           
            <div onClick={handelGoBack} style={{backgroundColor:"#7265bd",width:"35px",height:"35px",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"10px"}}>
                <ArrowBackIosIcon style={{fontSize:"16px",color:"#fff"}}/>
             </div>

             <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginLeft:"15px"}}>
             <h1 className="fw-bolder " >User Details</h1>
               </div>            
            </div>
          
            </div>
          <div className="card-body p-9"> 
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Status</label>
              <div className="col-lg-8">
                <span
                  className={`fw-bolder fs-6 ${
                    userData.status ? "text-success" : "text-danger"
                  }`}
                >
                  {userData.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Name</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.name}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Email</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.email}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Phone</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.mobile}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Gender</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.gender}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">
                Date of birth
              </label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.dob}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Address</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.Address}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Pin Code</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.pincode}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">City</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.city}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Country</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.country}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Created At</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.createdAt}</span>
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 fw-bold text-muted">Updated At</label>
              <div className="col-lg-8">
                <span className="fw-bolder fs-6">{userData.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
