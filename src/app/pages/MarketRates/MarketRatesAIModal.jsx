import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Modal, 
  TextField, 
  Fade, 
  IconButton, 
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Base_url } from '../../Config/BaseUrl';

export const MarketRatesAIModal = ({
  modalVisible,
  setModalVisible,
  onSuccess,
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setModalVisible(false);
    setMessage('');
    setResponse(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await axios.post(
        `${Base_url}market-rates/parse`,
        {
          message: message.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (result.data.success) {
        setResponse(result.data);
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setError(result.data.message || 'Failed to parse market rates');
      }
    } catch (err) {
      console.error('Error parsing market rates:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to parse market rates. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={modalVisible}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={modalVisible}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'auto',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                Market Rates AI
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{ color: '#65be34' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {!response ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Enter your market rate message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Paste or type your market rate information here..."
                  sx={{ mb: 2 }}
                  disabled={loading}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !message.trim()}
                    sx={{ backgroundColor: 'black' }}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  >
                    {loading ? 'Processing...' : 'Parse Market Rates'}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Alert severity="success" sx={{ mb: 3 }}>
                  {response.message || 'Market rates added successfully!'}
                </Alert>

                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 3,
                    maxHeight: '400px',
                    overflow: 'auto',
                    bgcolor: '#f5f5f5',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Response Details:
                  </Typography>
                  
                  {response.data && (
                    <Box sx={{ mb: 2 }}>
                      {response.data.parsed && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Parsed:
                          </Typography>
                          <Typography variant="body2" component="pre" sx={{ 
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          }}>
                            {JSON.stringify(response.data.parsed, null, 2)}
                          </Typography>
                        </Box>
                      )}

                      {response.data.matched && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Matched:
                          </Typography>
                          <Typography variant="body2" component="pre" sx={{ 
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          }}>
                            {JSON.stringify(response.data.matched, null, 2)}
                          </Typography>
                        </Box>
                      )}

                      {response.data.updated && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Updated:
                          </Typography>
                          <Typography variant="body2" component="pre" sx={{ 
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          }}>
                            {JSON.stringify(response.data.updated, null, 2)}
                          </Typography>
                        </Box>
                      )}

                      {response.data.warnings && response.data.warnings.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Warnings:
                          </Typography>
                          <Box component="ul" sx={{ pl: 2 }}>
                            {response.data.warnings.map((warning, index) => (
                              <Typography
                                key={index}
                                component="li"
                                variant="body2"
                                sx={{ color: 'warning.main' }}
                              >
                                {warning}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    sx={{ backgroundColor: 'black' }}
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

