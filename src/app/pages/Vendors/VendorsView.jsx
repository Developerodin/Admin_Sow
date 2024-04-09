import React, { useEffect, useState } from "react";
import {
  ChartsWidget1,
  ListsWidget5,
  TablesWidget1,
  TablesWidget5,
} from "../../../_metronic/partials/widgets";
import { KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers";
import { Link, useParams } from "react-router-dom";
import { Dropdown1 } from "../../../_metronic/partials";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_url } from "../../Config/BaseUrl";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import CloseIcon from "@mui/icons-material/Close";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { ThemColor } from "../../Them/ThemColor";
import ListSharpIcon from "@mui/icons-material/ListSharp";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
};
export const VendorsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Base_url}api/b2b/${id}`);
        const responseData = response.data;

        if (
          responseData &&
          responseData.categories &&
          Array.isArray(responseData.categories)
        ) {
          setCategories(responseData.categories);
        } else {
          console.error("Unexpected response data structure:", responseData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    const selectedCategory = categories.find(
      (category) => category.name === categoryName
    );
    setSelectedCategory(selectedCategory);
  };

  const handleEditSubCategory = (subCategory) => {
    console.log("Editing subCategory:", subCategory);
    handelSubCategoryEdit(subCategory);
  };

  const handleDeleteSubCategory = (subCategory) => {
    console.log("Deleting subCategory:", subCategory);
    deleteSubcategoryByIndex(userData._id, subCategoryIndex);
  };

  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    setOpen2(false);
    setSubCategoryData({
      name: "",
      price: "",
      unit: "",
    });
  };

  const [open3, setOpen3] = React.useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => {
    setOpen3(false);
    setSubCategoryData({
      name: "",
      price: "",
      unit: "",
    });
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    fontSize: "16px",
    textAlign: "center",
    padding: "8px",
  };
  

  const thTdStyle2 = {
    fontSize: "16px",
    textAlign: "left",
    padding: "8px",
  };

  const Data = [
    {
      id: 1,
      name: "Emma Smith",
      avatar: "/media/avatars/300-6.jpg",
      totalExperience: "5 years",
      totalClasses: "350",
      job: "Hatha Yoga",
      online: false,
      color: "primary",
    },
    {
      id: 2,
      name: "Melody Macy",
      color: "danger",
      totalExperience: "3 years",
      totalClasses: "150",
      job: "Vinyasa Yoga",
      online: true,
    },
    {
      id: 3,
      name: "Max Smith",
      avatar: "/media/avatars/300-1.jpg",
      totalExperience: "2 years",
      totalClasses: "90",
      job: "Ashtanga Yoga",
      online: true,
    },
    {
      id: 4,
      name: "Sean Bean",
      avatar: "/media/avatars/300-5.jpg",
      totalExperience: "2 years",
      totalClasses: "150",
      job: "Power Yoga",
      online: true,
    },
    {
      id: 5,
      name: "Brian Cox",
      avatar: "/media/avatars/300-25.jpg",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Bikram Yoga",
      online: true,
    },
    {
      id: 6,
      name: "Mikaela Collins",
      color: "warning",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Jivamukti Yoga",
      online: true,
    },
    {
      id: 7,
      name: "Francis Mitcham",
      avatar: "/media/avatars/300-9.jpg",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Iyengar Yoga",
      online: true,
    },
    {
      id: 8,
      name: "Olivia Wild",
      color: "danger",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Anusara Yoga",
      online: true,
    },
    {
      id: 9,
      name: "Neil Owen",
      color: "primary",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Sivananda Yoga",
      online: true,
    },
    {
      id: 10,
      name: "Dan Wilson",
      avatar: "/media/avatars/300-23.jpg",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Viniyoga",
      online: true,
    },
    {
      id: 11,
      name: "Emma Bold",
      color: "danger",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Kundalini Yoga",
      online: true,
    },
    {
      id: 12,
      name: "Ana Crown",
      avatar: "/media/avatars/300-12.jpg",
      totalExperience: "3 years",
      totalClasses: "250",
      job: "Yin Yoga",
      online: true,
    },
  ];

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [state2, setState2] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [state3, setState3] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  // const [loading, setLoading] = useState(true);
  const [SubCategories, setSubCategories] = useState([]);
  const [ProfileData, setProfileData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [update, setupdate] = useState(0);
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    price: "",
    unit: "",
  });
  const [subCategoryIndex, setSubCategoryIndex] = useState("");
  const [CategoryEditData, setCategoryEditData] = useState("");

  const handelChatClick = () => {
    navigate("chats/");
  };
  const handleCategoryEditOpen = () => {
    setCategoryEditData(userData.category);
    handleOpen();
  };
  const handleSubCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryInputChange = (e) => {
    setCategoryEditData(e.target.value);
  };

  const handelCategoryEditSubmit = () => {
    const CategoryData = {
      category: CategoryEditData,
    };
    updateCategory(userData._id, CategoryData);
    setCategoryEditData("");
    handleClose();
  };

  const handelSubCategoryEdit = (el, index) => {
    setSubCategoryData(el);
    setSubCategoryIndex(index);
    handleOpen2();
  };

  const handelSubCategoryEditSubmit = () => {
    updateSubcategoryByIndex(userData._id, subCategoryIndex, subCategoryData);
    handleClose2();
  };

  const handelSubCategoryAddSubmit = () => {
    addSubcategory(userData._id, subCategoryData);
    handleClose3();
    setSubCategoryData({
      name: "",
      price: "",
      unit: "",
    });
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 550, padding: "20px" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div
        style={{
          height: "30px",
          backgroundColor: "orange",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#fff", marginTop: "10px" }}> Adhar Card Details </p>
      </div>

      <div>
        <div style={{ marginTop: "20px" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thTdStyle }}>Name</th>
                <th style={thTdStyle}>Addhar Number</th>
                <th style={thTdStyle}>Address</th>
                <th style={thTdStyle}></th>
              </tr>
            </thead>
            <tbody>
              {userData && userData.adharData ? (
                <tr>
                  <td style={thTdStyle}>{userData.adharData.Name}</td>
                  <td style={thTdStyle}> {userData.adharData.AdhharNo}</td>
                  <td style={thTdStyle}>{userData.adharData.Address}</td>
                  <td style={thTdStyle}>
                    <MoreVertIcon />
                  </td>
                </tr>
              ) : (
                <h2>No Addhar Data Yet</h2>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            marginTop: "20px",
            padding: "10px",
          }}
        >
          <div style={{ marginRight: "20px" }}>
            <span>Front</span>
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
              }}
            >
              <PhotoSizeSelectActualIcon sx={{ fontSize: "40px" }} />
            </div>
          </div>

          <div>
            <span>Back</span>
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
              }}
            >
              <PhotoSizeSelectActualIcon sx={{ fontSize: "40px" }} />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "30px",
          backgroundColor: "orange",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <p style={{ color: "#fff", marginTop: "10px" }}> Pan Card Details </p>
      </div>

      <div>
        <div style={{ marginTop: "20px" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thTdStyle2 }}>Pan Card</th>

                <th style={thTdStyle2}></th>
              </tr>
            </thead>
            <tbody>
              {userData && userData.panNo ? (
                <tr>
                  <td style={thTdStyle2}>{userData.panNo}</td>

                  <td style={thTdStyle2}>
                    <MoreVertIcon />
                  </td>
                </tr>
              ) : (
                <h2>No Pan Card Data Yet</h2>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            marginTop: "20px",
            padding: "10px",
          }}
        >
          <div style={{ marginRight: "20px" }}>
            <span>Front</span>
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
              }}
            >
              <PhotoSizeSelectActualIcon sx={{ fontSize: "40px" }} />
            </div>
          </div>

          <div>
            <span>Back</span>
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
              }}
            >
              <PhotoSizeSelectActualIcon sx={{ fontSize: "40px" }} />
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </Box>
  );

  const toggleDrawer2 = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState2({ ...state2, [anchor]: open });
  };

  const list2 = (anchor) => (
    <Box sx={{ width: 550, padding: "20px" }} role="presentation">
      <div>
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <Button
            onClick={handleCategoryEditOpen}
            variant="outlined"
            style={{
              backgroundColor: "#FF86041A",
              color: "#FF8604",
              borderColor: "#FF8604",
            }}
          >
            Edit Categorie
          </Button>
        </div>

        <div>
          <Select
            value={selectedCategory ? selectedCategory.name : "Select Category"}
            variant="standard"
            placeholder="Select Category"
            sx={{
              borderRadius: "20px",
              fontWeight: "bold",
              color: "#fff",
              marginTop: "10px",
              width: "100%",
              textAlign: "center",
              backgroundColor: "orange",
            }}
            onChange={handleCategoryChange}
          >
            <MenuItem
              value={"Select Category"}
              sx={{
                color: "black",
                borderRadius: "5px",
              }}
            >
              Select Category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.name}
                value={category.name}
                sx={{
                  color: "black",
                  borderRadius: "5px",
                }}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <div
            style={{
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <KeyboardDoubleArrowDownIcon sx={{ fontSize: "35px" }} />
          </div>

          <div
            style={{
              height: "30px",
              backgroundColor: "grey",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "#fff", marginTop: "10px" }}>
              {userData && userData.category}{" "}
            </p>
          </div>

          <div
            style={{
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <KeyboardDoubleArrowDownIcon sx={{ fontSize: "35px" }} />
          </div>

          <div
            style={{
              height: "30px",
              backgroundColor: "grey",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "#fff", marginTop: "10px" }}>Sub Categories </p>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <Button
              onClick={handleOpen3}
              variant="outlined"
              style={{
                backgroundColor: "#FF86041A",
                color: "#FF8604",
                borderColor: "#FF8604",
              }}
            >
              Add Sub Categorie
            </Button>
          </div>
          {selectedCategory && (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thTdStyle}>Sub Category</th>
                  <th style={thTdStyle}>Price</th>
                  <th style={thTdStyle}>Unit</th>
                  <th style={thTdStyle}>Edit</th>
                  <th style={thTdStyle}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {selectedCategory.sub_category.length > 0 ? (
                  selectedCategory.sub_category.map((subCategory, index) => (
                    <tr key={index}>
                      <td style={thTdStyle}>{subCategory.name}</td>
                      <td style={thTdStyle}>₹ {subCategory.price}</td>
                      <td style={thTdStyle}>{subCategory.unit}</td>
                      <td style={thTdStyle}>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: `${ThemColor.buttons}` }}
                          sx={{ mr: 1 }}
                          onClick={() => handleEditSubCategory(subCategory)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td style={thTdStyle}>
                        <Button
                          variant="contained"
                          sx={{ ml: 1, bgcolor: "orange" }}
                          onClick={() => handleDeleteSubCategory(subCategory)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <Box
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      justifyContent: "center",
                    }}
                  >
                    <h2 style={{ justifyContent: "center" }}>
                      No Sub Category Yet
                    </h2>
                  </Box>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Box>
  );

  const toggleDrawer3 = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState3({ ...state2, [anchor]: open });
  };

  const list3 = (anchor) => (
    <Box
      sx={{ width: 450, padding: "20px" }}
      role="presentation"
      onClick={toggleDrawer3(anchor, false)}
      onKeyDown={toggleDrawer3(anchor, false)}
    >
      <div
        style={{
          height: "30px",
          backgroundColor: "orange",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#fff", marginTop: "10px" }}>Orders </p>
      </div>
    </Box>
  );

  // Function to add a subcategory
  const addSubcategory = async (userId, subcategoryData) => {
    console.log("Add Subcategory ========>");
    try {
      const response = await axios.post(
        `${Base_url}api/b2b/${userId}/subcategories`,
        subcategoryData
      );
      setupdate((prev) => prev + 1);
      return response.data;
    } catch (error) {
      console.error("Error adding subcategory:", error);
      throw error;
    }
  };

  // Function to update a subcategory by index
  const updateSubcategoryByIndex = async (
    userId,
    subcategoryIndex,
    subcategoryData
  ) => {
    console.log("Update Subcategory ========>");
    try {
      const response = await axios.patch(
        `${Base_url}api/b2b/${userId}/subcategories/${subcategoryIndex}`,
        subcategoryData
      );
      setupdate((prev) => prev + 1);
      return response.data;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      throw error;
    }
  };

  // Function to delete a subcategory by index
  const deleteSubcategoryByIndex = async (userId, subcategoryIndex) => {
    try {
      const response = await axios.delete(
        `${Base_url}api/b2b/${userId}/subcategories/${subcategoryIndex}`
      );
      setupdate((prev) => prev + 1);
      return response.data;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  };

  // Function to update the category
  const updateCategory = async (userId, categoryData) => {
    try {
      const response = await axios.patch(
        `${Base_url}api/b2b/${userId}/category`,
        categoryData
      );
      setupdate((prev) => prev + 1);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Base_url}api/b2b/${id}`);

      if (response.status === 200) {
        console.log("DAta =====>", response.data);
        setUserData(response.data);
      } else {
        console.error("Error fetching data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const handelBack = () => {
    window.history.back();
  };
  useEffect(() => {
    const ProfileDataFilter = Data.filter((el) => {
      return el.id === parseInt(id);
    });
    // console.log("Data =>",ProfileDataFilter)
    setProfileData(Data[0]);
    fetchData();
  }, [update]);
  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div
            onClick={handelBack}
            style={{
              backgroundColor: "#7265bd",
              width: "35px",
              height: "35px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <ArrowBackIosIcon style={{ fontSize: "20px", color: "#fff" }} />
          </div>
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                {userData && (
                  <span
                    className={`symbol-label bg-light-${ProfileData.color} text-${ProfileData.color} fs-5 fw-bolder`}
                  >
                    {userData.name.charAt(0)}
                  </span>
                )}

                {userData && userData.status ? (
                  <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
                ) : (
                  <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-danger rounded-circle border border-4 border-white h-20px w-20px"></div>
                )}
              </div>
            </div>

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <a
                      href="#"
                      className="text-gray-800 text-hover-primary fs-2 fw-bolder me-1"
                    >
                      {userData && userData.name}
                    </a>
                    <a href="#">
                      <KTSVG
                        path="/media/icons/duotune/general/gen026.svg"
                        className="svg-icon-1 svg-icon-primary"
                      />
                    </a>
                  </div>

                  <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    {/* <span
                      onClick={handelChatClick}
                      className="d-flex align-items-center text-gray-400 text-hover-primary mb-2 me-3"
                    >
                      <KTSVG
                        path="/media/icons/duotune/communication/com003.svg"
                        className="svg-icon-4 me-1"
                      />
                      Chat
                    </span> */}
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap flex-stack">
                <div className="d-flex flex-column flex-grow-1 pe-8">
                  <div className="d-flex flex-wrap">
                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div className="d-flex align-items-center">
                        <KTSVG
                          path="/media/icons/duotune/arrows/arr066.svg"
                          className="svg-icon-3 svg-icon-success me-2"
                        />
                        <div className="fs-2 fw-bolder">
                          {userData && userData.sub_category
                            ? userData.sub_category.length
                            : 0}
                        </div>
                      </div>

                      <div className="fw-bold fs-6 text-gray-400">Category</div>
                    </div>

                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div className="d-flex align-items-center">
                        <KTSVG
                          path="/media/icons/duotune/arrows/arr066.svg"
                          className="svg-icon-3 svg-icon-success me-2"
                        />
                        <div className="fs-2 fw-bolder">
                          {userData && userData.sub_category}
                        </div>
                      </div>

                      <div className="fw-bold fs-6 text-gray-400">
                        Sub Category
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {
 teacherData && teacherData.images && teacherData.images.length > 0 &&  <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
  <div className="card-header cursor-pointer">
    <div className="card-title m-0">
      <h3 className="fw-bolder m-0">Trainer Images</h3>
    </div>
  </div>

  <div className="card-body p-9">
  
  <div style={{display:"flex",alignItems:"center"}}>
  { teacherData.images.map((el)=>{
              return  (
                <img
                style={{marginRight:"30px",height:"150px",width:"150px"}}
                  src={`${Base_url}api/${el.path}`}
                  alt="Metronic"
                />
              )
            }) 
          }
  </div>
         

  </div>
</div>
} */}

      <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <div className="card-header cursor-pointer">
          <div className="card-title m-0">
            <h3 className="fw-bolder m-0">Profile Details</h3>
          </div>
        </div>

        <div className="card-body p-9">
          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Gender</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.gender}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Dob</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.dob}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Register As</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.registerAs}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Email</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.email}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Phone</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.mobile}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Joining Date</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.createdAt}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Address</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.Address},{userData && userData.pincode}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">City</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.city}
              </span>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Country</label>

            <div className="col-lg-8">
              <span className="fw-bolder fs-6 text-dark">
                {userData && userData.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <div className="card-header cursor-pointer">
          <div className="card-title m-0">
            <h3 className="fw-bolder m-0">Information</h3>
          </div>
        </div>

        <div className="card-body p-9">
          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Category</label>

            <div className="col-lg-8">
              <a className="fw-bold fs-6 text-dark text-hover-primary">
                <Button
                  variant="outlined"
                  onClick={toggleDrawer2("right", true)}
                >
                  View
                </Button>
              </a>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Orders </label>

            <div className="col-lg-8">
              <a className="fw-bold fs-6 text-dark text-hover-primary">
                <Button
                  variant="outlined"
                  onClick={toggleDrawer3("right", true)}
                >
                  View
                </Button>
              </a>
            </div>
          </div>

          <div className="row mb-7">
            <label className="col-lg-4 fw-bold text-muted">Documents</label>

            <div className="col-lg-8">
              <a className="fw-bold fs-6 text-dark text-hover-primary">
                <Button
                  variant="outlined"
                  onClick={toggleDrawer("right", true)}
                >
                  View
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row gy-10 gx-xl-10">
        {/* <div className="col-xl-6">
          <ChartsWidget1 className="card-xxl-stretch mb-5 mb-xl-10" />
        </div> */}

        {/* <div className='col-xl-6'>
          <TablesWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div> */}
        <div className="col-xl-12">
          <ListsWidget5 className="card-xxl-stretch mb-5 mb-xl-10" />
        </div>
      </div>

      <div>
        <Drawer
          anchor={`right`}
          open={state[`right`]}
          onClose={toggleDrawer(`right`, false)}
        >
          {list(`right`)}
        </Drawer>

        <Drawer
          anchor={`right`}
          open={state2[`right`]}
          onClose={toggleDrawer2(`right`, false)}
        >
          {list2(`right`)}
        </Drawer>

        <Drawer
          anchor={`right`}
          open={state3[`right`]}
          onClose={toggleDrawer3(`right`, false)}
        >
          {list3(`right`)}
        </Drawer>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Edit Category
            </Typography>

            <CloseIcon onClick={handleClose} />
          </Box>

          <TextField
            fullWidth
            label="Enter Name Of Category"
            sx={{ marginTop: "30px" }}
            value={CategoryEditData}
            onChange={handleCategoryInputChange}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              expand
              sx={{ backgroundColor: "black" }}
              onClick={handelCategoryEditSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Edit Sub Category
            </Typography>

            <CloseIcon onClick={handleClose2} />
          </Box>

          <TextField
            fullWidth
            label="Enter Name Of Sub Category"
            sx={{ marginTop: "30px" }}
            name="name"
            value={subCategoryData.name}
            onChange={handleSubCategoryInputChange}
          />
          <TextField
            sx={{ marginTop: "30px" }}
            label="Price"
            name="price"
            value={subCategoryData.price}
            onChange={handleSubCategoryInputChange}
          />
          <TextField
            sx={{ marginTop: "30px" }}
            label="Unit"
            name="unit"
            value={subCategoryData.unit}
            onChange={handleSubCategoryInputChange}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              expand
              sx={{ backgroundColor: "black" }}
              onClick={() => handelSubCategoryEditSubmit()}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={open3}
        onClose={handleClose3}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Add Sub Category
            </Typography>

            <CloseIcon onClick={handleClose3} />
          </Box>

          <TextField
            fullWidth
            label="Enter Name Of Sub Category"
            sx={{ marginTop: "30px" }}
            name="name"
            value={subCategoryData.name}
            onChange={handleSubCategoryInputChange}
          />
          <TextField
            sx={{ marginTop: "30px" }}
            label="Price"
            name="price"
            value={subCategoryData.price}
            onChange={handleSubCategoryInputChange}
          />
          <TextField
            sx={{ marginTop: "30px" }}
            label="Unit"
            name="unit"
            value={subCategoryData.unit}
            onChange={handleSubCategoryInputChange}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              expand
              sx={{ backgroundColor: "black" }}
              onClick={() => handelSubCategoryAddSubmit()}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
