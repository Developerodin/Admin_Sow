import React, { useEffect, useRef } from "react";
import {
  Modal,
  Box,
  IconButton,
  Backdrop,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const StateSelectModal = ({
  modalVisible,
  setModalVisible,
  handleComplete,
}) => {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
    animationRef.current?.play(10, 80);
  }, []);

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      open={modalVisible}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center", margin: 0 }}
    >
      <Fade in={modalVisible}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: -6.25,
          }}
        >
          <Box
            sx={{
              margin: 2.5,
              backgroundColor: "white",
              borderRadius: 1,
              padding: 2.5,
              width: "90%",
              maxHeight: "500px",
              boxShadow: 5,
            }}
          >
            <IconButton
              sx={{
                alignSelf: "flex-end",
                color: "#65be34",
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "90%",
                padding: 1,
              }}
            >
              {/* Add your content here */}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
