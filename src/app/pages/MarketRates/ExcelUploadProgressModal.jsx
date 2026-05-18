import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Fade,
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Chip,
  Alert,
  AlertTitle,
  LinearProgress,
  CircularProgress,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Base_url } from '../../Config/BaseUrl';

// Time-aware progress labels — picked based on elapsed seconds. We do NOT
// cycle a fixed step list any more because the looping "Step 1 of 5 → 5 of 5
// → 1 of 5" misled users on long uploads.
const PROGRESS_STAGES = [
  { until: 3,   label: 'Preparing rows…' },
  { until: 8,   label: 'Sending to server…' },
  { until: 20,  label: 'Saving rates to database…' },
  { until: 60,  label: 'Still working — finishing up on the server…' },
  { until: Infinity, label: 'This is taking longer than usual. Server may still be processing your batch.' },
];

const getProgressLabel = (elapsedSec) => {
  const stage = PROGRESS_STAGES.find((s) => elapsedSec < s.until);
  return stage ? stage.label : PROGRESS_STAGES[PROGRESS_STAGES.length - 1].label;
};

const formatElapsed = (sec) => {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
};

const downloadSkippedRowsExcel = (skippedEntries, fileName) => {
  if (!skippedEntries || skippedEntries.length === 0) return;
  const rows = skippedEntries.map((s, i) => ({
    '#': i + 1,
    'Mandi ID': s.mandiId || '',
    Category: s.category || '',
    'Sub Category': s.subCategory || '',
    Reason: s.reason || '',
  }));
  const headers = ['#', 'Mandi ID', 'Category', 'Sub Category', 'Reason'];
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  ws['!cols'] = [
    { wch: 5 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 50 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Skipped Entries');
  const safeName = (fileName || 'upload').replace(/\.(xlsx|xls|csv)$/i, '');
  XLSX.writeFile(wb, `${safeName}_server_skipped.xlsx`);
};

/**
 * Shows live progress + final result for the Excel bulk-upload flow.
 * Mirrors the UX of `MarketRatesAIModal` so the user sees the same
 * loader → success/partial/error pattern.
 *
 * Props:
 *   open      — controls visibility
 *   rows      — normalized rows ready for POST /mandiRates/mandi-prices
 *   fileName  — original Excel filename (used for download suggestions)
 *   onClose() — called when the user dismisses the modal
 *   onSuccess(result) — called once after a 2xx response (parent refreshes table)
 */
export const ExcelUploadProgressModal = ({
  open,
  rows,
  fileName,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const startedAtRef = useRef(0);
  const elapsedIntervalRef = useRef(null);
  const inFlightRef = useRef(false);

  const clearTimers = () => {
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }
  };

  useEffect(() => () => clearTimers(), []);

  // Kick off the upload exactly once per "open=true" session.
  // When the modal closes, reset everything so the next open starts clean.
  useEffect(() => {
    if (open && Array.isArray(rows) && rows.length > 0 && !inFlightRef.current) {
      doUpload();
    }
    if (!open) {
      clearTimers();
      inFlightRef.current = false;
      setLoading(false);
      setElapsedSec(0);
      setResult(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const doUpload = async () => {
    inFlightRef.current = true;
    setLoading(true);
    setResult(null);
    setError(null);
    setElapsedSec(0);

    startedAtRef.current = Date.now();

    // The API call is a single POST; we can't stream real per-step state.
    // Elapsed timer drives a time-aware status label (no looping steps).
    elapsedIntervalRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);

    try {
      const response = await axios.post(
        `${Base_url}mandiRates/mandi-prices`,
        { mandiPrices: rows },
        { headers: { 'Content-Type': 'application/json' } }
      );
      clearTimers();
      setLoading(false);
      setResult(response.data || {});
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      clearTimers();
      setLoading(false);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to upload market rates. Please try again.'
      );
    }
  };

  const handleClose = () => {
    if (loading) return; // do not allow dismissal while the request is in flight
    onClose && onClose();
  };

  const processed = result?.processed || 0;
  const skipped = result?.skipped || 0;
  const skippedEntries = result?.skippedEntries || [];
  const submittedCount = Array.isArray(rows) ? rows.length : 0;
  const hasResult = !!result;
  const fullSuccess = hasResult && processed > 0 && skipped === 0;
  const partialSuccess = hasResult && processed > 0 && skipped > 0;
  const allSkipped = hasResult && processed === 0;

  return (
    <Modal open={open} onClose={loading ? undefined : handleClose} closeAfterTransition>
      <Fade in={open}>
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
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Upload Market Rates (Excel)
                </Typography>
                {fileName && (
                  <Typography variant="caption" color="text.secondary">
                    File: {fileName}
                  </Typography>
                )}
              </Box>
              <IconButton onClick={handleClose} disabled={loading}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Live progress */}
            {loading && (
              <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={28} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Uploading {submittedCount} rate{submittedCount === 1 ? '' : 's'}…
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getProgressLabel(elapsedSec)}
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {elapsedSec < 20
                        ? 'Bulk save in progress…'
                        : 'Still working — please be patient.'}
                    </Typography>
                    <Chip
                      size="small"
                      label={`Elapsed: ${formatElapsed(elapsedSec)}`}
                      color={elapsedSec > 60 ? 'warning' : 'default'}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Please keep this window open until the upload finishes.
                  </Typography>
                </Stack>
              </Paper>
            )}

            {/* Network / unexpected failure */}
            {!loading && error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Upload failed</AlertTitle>
                {error}
              </Alert>
            )}

            {/* Result view */}
            {!loading && hasResult && (
              <>
                {fullSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Upload complete</AlertTitle>
                    {result.message ||
                      `Successfully uploaded ${processed} rate${processed === 1 ? '' : 's'}.`}
                  </Alert>
                )}
                {partialSuccess && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <AlertTitle>Partially uploaded</AlertTitle>
                    {result.message ||
                      `${processed} uploaded, ${skipped} skipped by the server.`}
                  </Alert>
                )}
                {allSkipped && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Nothing was uploaded</AlertTitle>
                    {result.message ||
                      'The server skipped all entries. See the table below for details.'}
                  </Alert>
                )}

                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip color="success" size="small" label={`Uploaded: ${processed}`} />
                  <Chip
                    color={skipped ? 'error' : 'default'}
                    size="small"
                    label={`Skipped: ${skipped}`}
                  />
                  <Chip size="small" label={`Submitted: ${submittedCount}`} />
                </Stack>

                {skippedEntries.length > 0 && (
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
                        Skipped by server ({skippedEntries.length})
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<FileDownloadIcon />}
                        onClick={() => downloadSkippedRowsExcel(skippedEntries, fileName)}
                      >
                        Download skipped Excel
                      </Button>
                    </Box>
                    <TableContainer sx={{ maxHeight: 320 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Mandi ID</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Sub Category</TableCell>
                            <TableCell>Reason</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {skippedEntries.map((s, i) => (
                            <TableRow key={i} hover>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell
                                sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                              >
                                {s.mandiId || '—'}
                              </TableCell>
                              <TableCell>{s.category || '—'}</TableCell>
                              <TableCell>{s.subCategory || '—'}</TableCell>
                              <TableCell sx={{ color: 'error.main', fontSize: '0.85rem' }}>
                                {s.reason || '—'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
              </>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleClose}
                disabled={loading}
                sx={{ backgroundColor: 'black' }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
