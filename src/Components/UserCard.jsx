import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListIcon from "@mui/icons-material/List";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HomeIcon from "@mui/icons-material/Home";
export const UserCard = ({ Data, fun }) => {
  return (
    <Card sx={{ borderRadius: "5px", height: "300px", position: "relative" }}>
      <CardContent>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Box sx={{ marginRight: "20px" }}>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1px solid grey",
                  borderRadius: "100px",
                }}
                src="https://img.icons8.com/papercut/60/user.png"
                alt="user"
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: "16px" }}>
                {Data.name.charAt(0).toUpperCase() + Data.name.slice(1)}
              </Typography>

              <Typography
                sx={{ fontSize: "14px", color: "#2E8760", marginTop: "5px" }}
              >
                {Data.mobile}
                {Data.status ? (
                  <span
                    style={{
                      color: "#fff",
                      width: "50px",
                      height: "50px",
                      background: "green",
                      padding: "3px",
                      fontSize: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    {" "}
                    Active
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#fff",
                      width: "50px",
                      height: "50px",
                      background: "crimson",
                      padding: "3px",
                      fontSize: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    {" "}
                    In Active
                  </span>
                )}
              </Typography>
              <Typography
                style={{ color: "#2E8760", fontSize: "14px", marginTop: "5px" }}
              >
                {Data.email}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              marginTop: "20px",
              marginLeft: "10px",
              height: "70px",
            }}
          >
            <HomeIcon sx={{ marginRight: "10px", color: "#2E8760" }} />
            <Typography sx={{ color: "#2E8760", fontSize: "13px" }}>
              {" "}
              {Data.Address} {Data.pincode},{Data.city},{Data.country}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              marginLeft: "10px",
              height: "100%",
            }}
          >
            {/* <Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <ListIcon sx={{color:"crimson"}}/>
     
                <Typography sx={{fontSize:"14px",marginLeft:"10px"}}>Assigned <span style={{color:"crimson"}}>966</span></Typography>
            </Box> */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "10px",
              }}
            >
              <ReceiptIcon sx={{ color: "#2E8760" }} />

              <Typography sx={{ fontSize: "14px", marginLeft: "10px" }}>
                Orders <span style={{ color: "#2E8760" }}>852</span>
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ backgroundColor: "black" }}
              onClick={() => fun()}
            >
              View
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
