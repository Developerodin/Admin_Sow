import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Fade,
  IconButton,
  Typography,
  CircularProgress,
  LinearProgress,
  Alert,
  AlertTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Base_url } from '../../Config/BaseUrl';

const PROGRESS_STEPS = [
  'Parsing message with AI...',
  'Matching categories & sub-categories...',
  'Matching mandis against database...',
  'Saving rates to database...',
  'Finalizing...',
];

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 min safety cap

// Excel column headers — MUST match the upload template in MarketRates.jsx
const EXCEL_HEADERS = ['Mandi Name', 'Date', 'Category', 'Sub Category', 'Time', 'Price', 'Unit'];

const buildFailedExcelRows = (failedRates, fallbackDate, fallbackTime) => {
  return (failedRates || []).map((f) => ({
    'Mandi Name': f.mandi || '',
    Date: fallbackDate || '',
    Category: f.category || '',
    'Sub Category': f.subCategory || '',
    Time: fallbackTime || '',
    Price: f.price ?? '',
    Unit: f.unit || 'Kg',
  }));
};

const downloadFailedRatesExcel = (failedRates, parsed) => {
  const fallbackDate = parsed?.date || new Date().toISOString().split('T')[0];
  const fallbackTime = parsed?.time || '10:00 AM';
  const rows = buildFailedExcelRows(failedRates, fallbackDate, fallbackTime);

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: EXCEL_HEADERS });
  worksheet['!cols'] = [
    { wch: 20 }, // Mandi Name
    { wch: 12 }, // Date
    { wch: 20 }, // Category
    { wch: 20 }, // Sub Category
    { wch: 10 }, // Time
    { wch: 10 }, // Price
    { wch: 8 },  // Unit
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Failed Rates');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `FailedMarketRates_${today}.xlsx`);
};

export const MarketRatesAIModal = ({ modalVisible, setModalVisible, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressStepIdx, setProgressStepIdx] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [progressNote, setProgressNote] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showRawDetails, setShowRawDetails] = useState(false);

  // Refs to keep polling/cleanup safe across renders + unmount
  const pollTimerRef = useRef(null);
  const stepIntervalRef = useRef(null);
  const elapsedIntervalRef = useRef(null);
  const startedAtRef = useRef(0);
  const cancelledRef = useRef(false);

  const clearTimers = () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      clearTimers();
    };
  }, []);

  const resetProgress = () => {
    clearTimers();
    setProgressStepIdx(0);
    setElapsedSec(0);
    setProgressNote('');
  };

  const startProgressTickers = () => {
    startedAtRef.current = Date.now();
    setProgressStepIdx(0);
    setElapsedSec(0);

    // Cycle the step label so the user sees ongoing activity for the long
    // OpenAI + vector-matching call. Real per-step state isn't streamed by
    // the API so we cycle visually until completion.
    stepIntervalRef.current = setInterval(() => {
      setProgressStepIdx((idx) => (idx + 1) % PROGRESS_STEPS.length);
    }, 2500);

    elapsedIntervalRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
  };

  const handleClose = () => {
    cancelledRef.current = true;
    clearTimers();
    setModalVisible(false);
    setMessage('');
    setResponse(null);
    setError(null);
    setLoading(false);
    resetProgress();
    setShowRawDetails(false);
  };

  const finishWithSuccess = (data) => {
    if (cancelledRef.current) return;
    clearTimers();
    setResponse(data);
    setLoading(false);
    if (onSuccess) onSuccess(data);
  };

  const finishWithError = (msg) => {
    if (cancelledRef.current) return;
    clearTimers();
    setError(msg);
    setLoading(false);
  };

  // Polls the async job endpoint until the backend reports completion.
  // Production default returns 202 + jobId; without polling the user would
  // never see the final success/failure result — that was the missing-toast bug.
  const pollJob = (jobId) => {
    const startedAt = Date.now();
    setProgressNote(`Job queued (id: ${jobId.slice(0, 8)}…). Polling for results…`);

    const tick = async () => {
      if (cancelledRef.current) return;

      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        finishWithError(
          'Parsing is taking longer than expected. Please check Market Rates list shortly; the job is still running on the server.'
        );
        return;
      }

      try {
        const res = await axios.get(`${Base_url}market-rates/parse/jobs/${jobId}`);
        const body = res.data || {};

        // Backend contract:
        //   202 + status:'pending'   → keep polling
        //   200 + status:'completed' → success payload with data
        //   200 + status:'failed'    → success:false + message
        if (body.status === 'pending') {
          pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
          return;
        }
        if (body.status === 'failed' || body.success === false) {
          finishWithError(body.message || 'AI parsing job failed on the server.');
          return;
        }
        if (body.status === 'completed' && body.success) {
          finishWithSuccess(body);
          return;
        }
        // Unknown state — retry once
        pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
      } catch (err) {
        // Transient network errors should retry; persistent ones bail after timeout
        console.warn('Poll attempt failed, retrying:', err?.message);
        pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
      }
    };

    tick();
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    cancelledRef.current = false;
    setLoading(true);
    setError(null);
    setResponse(null);
    startProgressTickers();

    try {
      const result = await axios.post(
        `${Base_url}market-rates/parse`,
        { message: message.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const body = result.data || {};

      // Async path (prod default): 202 with jobId — start polling.
      // The previous code treated this 202 as terminal success, which is why
      // the production "success" toast appeared empty/missing.
      if (result.status === 202 || body.status === 'pending' || body.jobId) {
        pollJob(body.jobId);
        return;
      }

      if (body.success) {
        finishWithSuccess(body);
      } else {
        finishWithError(body.message || 'Failed to parse market rates');
      }
    } catch (err) {
      console.error('Error parsing market rates:', err);
      finishWithError(
        err.response?.data?.message ||
          err.message ||
          'Failed to parse market rates. Please try again.'
      );
    }
  };

  const failedRates = response?.data?.failed || [];
  const updatedCount = response?.data?.updated?.mandiCategoryPrices || 0;
  const matchedMandiCount = response?.data?.matched?.mandis?.length || 0;
  const hasFailures = failedRates.length > 0;
  const hasAnySuccess = updatedCount > 0;

  return (
    <Modal open={modalVisible} onClose={loading ? undefined : handleClose} closeAfterTransition>
      <Fade in={modalVisible}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 720 },
            maxHeight: '92vh',
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
              <IconButton onClick={handleClose} sx={{ color: '#65be34' }} disabled={loading}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Loading / progress view */}
            {loading && (
              <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={28} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Processing your market rates...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {PROGRESS_STEPS[progressStepIdx]}
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      Step {progressStepIdx + 1} of {PROGRESS_STEPS.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Elapsed: {elapsedSec}s
                    </Typography>
                  </Box>

                  {progressNote && (
                    <Alert severity="info" sx={{ py: 0.5 }}>
                      {progressNote}
                    </Alert>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Please keep this window open. Large messages can take 30–60 seconds while the AI
                    matches mandis and categories.
                  </Typography>
                </Stack>
              </Paper>
            )}

            {/* Input view (only when not loading and no response yet) */}
            {!loading && !response && (
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
                  <Button variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    sx={{ backgroundColor: 'black' }}
                  >
                    Parse Market Rates
                  </Button>
                </Box>
              </>
            )}

            {/* Result view */}
            {!loading && response && (
              <>
                {hasAnySuccess && !hasFailures && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Success</AlertTitle>
                    {response.message || 'Market rates added successfully!'}
                  </Alert>
                )}

                {hasAnySuccess && hasFailures && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <AlertTitle>Partially completed</AlertTitle>
                    {response.message ||
                      `${updatedCount} rate(s) added, ${failedRates.length} failed.`}
                  </Alert>
                )}

                {!hasAnySuccess && hasFailures && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>No rates were added</AlertTitle>
                    {response.message ||
                      `All ${failedRates.length} rate(s) failed validation. See details below.`}
                  </Alert>
                )}

                {!hasAnySuccess && !hasFailures && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {response.message || 'No rates were parsed from the message.'}
                  </Alert>
                )}

                {/* Summary chips */}
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    color="success"
                    label={`Saved: ${updatedCount}`}
                    size="small"
                  />
                  <Chip
                    color={hasFailures ? 'error' : 'default'}
                    label={`Failed: ${failedRates.length}`}
                    size="small"
                  />
                  <Chip label={`Matched mandis: ${matchedMandiCount}`} size="small" />
                  {response?.data?.parsed?.date && (
                    <Chip label={`Date: ${response.data.parsed.date}`} size="small" />
                  )}
                  {response?.data?.parsed?.time && (
                    <Chip label={`Time: ${response.data.parsed.time}`} size="small" />
                  )}
                </Stack>

                {/* Failed rates detail table */}
                {hasFailures && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Failed rates ({failedRates.length})
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<FileDownloadIcon />}
                        onClick={() =>
                          downloadFailedRatesExcel(failedRates, response.data?.parsed)
                        }
                      >
                        Download Failed Rates Excel
                      </Button>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Fix the highlighted fields, then re-upload via the Upload Excel button on
                      Market Rates.
                    </Typography>

                    <TableContainer sx={{ maxHeight: 320 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Mandi</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Sub Category</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell>Missing / Invalid</TableCell>
                            <TableCell>Reason</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {failedRates.map((f, idx) => (
                            <TableRow key={idx} hover>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>{f.mandi || <em style={{ color: '#b00' }}>—</em>}</TableCell>
                              <TableCell>{f.category || <em style={{ color: '#b00' }}>—</em>}</TableCell>
                              <TableCell>
                                {f.subCategory || <em style={{ color: '#b00' }}>—</em>}
                              </TableCell>
                              <TableCell align="right">
                                {f.price !== null && f.price !== undefined && f.price !== ''
                                  ? f.price
                                  : <em style={{ color: '#b00' }}>—</em>}
                              </TableCell>
                              <TableCell>
                                {(f.missingFields || []).map((m) => (
                                  <Chip
                                    key={m}
                                    label={m}
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                              </TableCell>
                              <TableCell sx={{ color: 'error.main', fontSize: '0.8rem' }}>
                                {f.reason}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}

                {/* Warnings (text list — backward-compat) */}
                {response.data?.warnings?.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fffbe6' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Warnings ({response.data.warnings.length})
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, m: 0 }}>
                      {response.data.warnings.map((w, i) => (
                        <Typography
                          key={i}
                          component="li"
                          variant="body2"
                          sx={{ color: 'warning.main' }}
                        >
                          {w}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                )}

                {/* Raw response (debug) */}
                <Box sx={{ mb: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setShowRawDetails((v) => !v)}
                  >
                    {showRawDetails ? 'Hide' : 'Show'} response details (debug)
                  </Button>
                  <Collapse in={showRawDetails}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 1,
                        maxHeight: 320,
                        overflow: 'auto',
                        bgcolor: '#f5f5f5',
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                        }}
                      >
                        {JSON.stringify(response.data, null, 2)}
                      </Typography>
                    </Paper>
                  </Collapse>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
