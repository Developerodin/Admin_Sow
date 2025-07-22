import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import { Base_url } from "../../Config/BaseUrl";

const statusColors = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "error",
};

const cardMinHeight = 260; // consistent min height for all order cards

const OrderHistory = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${Base_url}b2bOrder/user/${id}`)
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Box>
      <Card sx={{ minHeight: "100vh" }}>
        <CardContent>
          <Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  fontSize: "40px",
                  fontWeight: 600,
                  fontFamily: "sans-serif",
                }}
              >
                Order History
              </Typography>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: "20px" }} />
          </Box>

          <Box sx={{ marginTop: "20px" }}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : orders.length === 0 ? (
              <Typography>No orders found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {orders.map((order) => (
                  <Grid item xs={12} md={12} key={order._id}>
                    <Card sx={{ minHeight: cardMinHeight }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" color="primary">
                            {order.orderNo}
                          </Typography>
                          <Chip
                            label={order.orderStatus}
                            color={statusColors[order.orderStatus] || "default"}
                            size="small"
                          />
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography>
                          <b>Category:</b> {order.category} / {order.subCategory}
                        </Typography>
                        <Typography>
                          <b>Weight:</b> {order.weight} {order.unit}
                        </Typography>
                        <Typography>
                          <b>Total Price:</b> ₹{order.totalPrice}
                        </Typography>
                        <Typography>
                          <b>Order By:</b> {order.orderBy?.name} ({order.orderBy?.registerAs})
                        </Typography>
                        <Typography>
                          <b>Order To:</b> {order.orderTo?.name} ({order.orderTo?.registerAs})
                        </Typography>
                        <Typography>
                          <b>Location:</b> {order.location?.googleAddress}
                        </Typography>
                        <Typography>
                          <b>Notes:</b> {order.notes}
                        </Typography>
                        <Typography>
                          <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
                        </Typography>
                        {order.photos && order.photos.length > 0 && (
                          <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                            {order.photos.map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`Order Photo ${idx + 1}`}
                                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderHistory;
