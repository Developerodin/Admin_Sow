import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { Print } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Base_url } from "../../Config/BaseUrl";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRef } from "react";
import generatePDF from "react-to-pdf";

export const Invoices = () => {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);

  const targetRef = useRef();

  // Define options for PDF generation
  const options = {
    filename: "invoice.pdf",
    // Specify margins in mm

    format: "A4", // Scale factor for PDF rendering
    // Add more options as needed
  };

  const getInvoiceById = async () => {
    try {
      const response = await axios.get(`${Base_url}api/invoices`);
      const filteredUser = response.data.find((invoice) => invoice._id === id);
      if (filteredUser) {
        console.log("User data:", filteredUser);
        setInvoiceData(filteredUser);
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
    getInvoiceById();
  }, [id]);

  const handelGoBack = () => {
    window.history.back();
  };

  return (
    <div>
      {invoiceData && (
        <Container>
          <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
            <div className="card-header cursor-pointer">
              <div className="card-title m-0">
                <div
                  onClick={handelGoBack}
                  style={{
                    backgroundColor: "#7265bd",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "10px",
                  }}
                >
                  <ArrowBackIosIcon
                    style={{ fontSize: "16px", color: "#fff" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "15px",
                  }}
                >
                  <h1 className="fw-bolder">Invoices Details</h1>
                </div>
              </div>
            </div>
            <Card>
              <CardContent style={{ marginLeft: "20px" }}>
                <div
                  ref={targetRef}
                  style={{ margin: "20px", padding: "20px" }}
                >
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="text-muted">
                        <Typography variant="h5" className="font-size-16 mb-3">
                          Billed To:
                        </Typography>
                        <Typography variant="h5" className="font-size-15 mb-2">
                          {invoiceData.customerName}
                        </Typography>
                        <Typography variant="body1" className="mb-1">
                          {invoiceData.address}
                        </Typography>
                        <Typography variant="body1" className="mb-1">
                          {invoiceData.email}
                        </Typography>
                        <Typography variant="body1">
                          {invoiceData.contactNumber}
                        </Typography>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted text-sm-end">
                        <div className="mt-4">
                          <Typography
                            variant="h5"
                            className="font-size-15 mb-1"
                          >
                            Invoice Date:
                          </Typography>
                          <Typography variant="body1">12 Oct, 2020</Typography>
                        </div>
                        <div className="mt-4">
                          <Typography
                            variant="h5"
                            className="font-size-15 mb-1"
                          >
                            Order No:
                          </Typography>
                          <Typography variant="body1">
                            {invoiceData._id}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Typography variant="h5" className="font-size-15">
                      Order Summary
                    </Typography>
                    <div className="table-responsive">
                      <Table className="table align-middle table-nowrap table-centered mb-0">
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: "70px" }}>No.</TableCell>
                            <TableCell>Item</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell
                              className="text-end"
                              style={{ width: "120px" }}
                            >
                              Total
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell scope="row">01</TableCell>
                            <TableCell>
                              <div>
                                <Typography
                                  variant="h5"
                                  className="text-truncate font-size-14 mb-1"
                                >
                                  {invoiceData.productName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="text-muted mb-0"
                                >
                                  {invoiceData.productDescription}
                                </Typography>
                              </div>
                            </TableCell>
                            <TableCell>₹{invoiceData.pricePerUnit}</TableCell>
                            <TableCell>{invoiceData.quantity}</TableCell>
                            <TableCell className="text-end">
                              ₹{invoiceData.pricePerUnit}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              scope="row"
                              colSpan={4}
                              className="border-0 text-end"
                            >
                              Total
                            </TableCell>
                            <TableCell className="border-0 text-end">
                              <Typography
                                variant="h4"
                                className="m-0 fw-semibold"
                              >
                                ₹{invoiceData.totalAmount}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                    </div>
                  <div className="d-print-none mt-4">
                    <div
                      className="float-end"
                      style={{ marginBottom: "15px", marginLeft: "50%" }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => generatePDF(targetRef, options)}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                        startIcon={<Print />}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      )}
    </div>
  );
};
