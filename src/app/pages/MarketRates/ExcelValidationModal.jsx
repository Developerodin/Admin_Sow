import React, { useMemo } from 'react';
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
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';

const EXCEL_HEADERS = ['Mandi Name', 'Date', 'Category', 'Sub Category', 'Time', 'Price', 'Unit'];

const renderQuoted = (val) => {
  if (val === '' || val === null || val === undefined) return <em style={{ color: '#999' }}>(empty)</em>;
  return <span style={{ fontFamily: 'monospace' }}>{`"${val}"`}</span>;
};

const downloadInvalidRowsExcel = (rowIssues, fileName) => {
  const rows = rowIssues.map((r) => ({
    'Row #': r.rowNumber,
    'Mandi Name': r.rowData['Mandi Name'] ?? '',
    Date: r.rowData.Date ?? '',
    Category: r.rowData.Category ?? '',
    'Sub Category': r.rowData['Sub Category'] ?? '',
    Time: r.rowData.Time ?? '',
    Price: r.rowData.Price ?? '',
    Unit: r.rowData.Unit ?? '',
    Issues: r.issues.map((i) => `${i.field}: ${i.issue}`).join(' | '),
  }));
  const headers = ['Row #', ...EXCEL_HEADERS, 'Issues'];
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  ws['!cols'] = [
    { wch: 8 }, { wch: 20 }, { wch: 12 }, { wch: 20 },
    { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 60 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invalid Rows');
  const safeName = (fileName || 'upload').replace(/\.(xlsx|xls|csv)$/i, '');
  XLSX.writeFile(wb, `${safeName}_invalid_rows.xlsx`);
};

export const ExcelValidationModal = ({
  open,
  onClose,
  onProceed,
  fileName,
  issues,
  validRowsCount,
  totalRowsCount,
}) => {
  const fileIssues = issues?.fileIssues || [];
  const columnIssues = issues?.columnIssues || [];
  const rowIssues = issues?.rowIssues || [];

  const errorCount = useMemo(() => {
    let n = fileIssues.length;
    n += columnIssues.filter((c) => c.severity !== 'warning').length;
    n += rowIssues.length;
    return n;
  }, [fileIssues, columnIssues, rowIssues]);

  const warningCount = useMemo(
    () => columnIssues.filter((c) => c.severity === 'warning').length,
    [columnIssues]
  );

  // Block proceed when there are file-level errors OR column-level errors.
  // Row-level issues alone still allow user to opt into "proceed with valid rows".
  const hasBlockingIssues =
    fileIssues.length > 0 || columnIssues.some((c) => c.severity !== 'warning');

  const canProceed = !hasBlockingIssues && validRowsCount > 0;

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 820 },
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
                  Excel upload validation failed
                </Typography>
                {fileName && (
                  <Typography variant="caption" color="text.secondary">
                    File: {fileName}
                  </Typography>
                )}
              </Box>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Banner */}
            {hasBlockingIssues ? (
              <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mb: 2 }}>
                <AlertTitle>Upload blocked</AlertTitle>
                Your file has structural problems (file or column-level). Fix the
                issues below and re-upload. No rates were uploaded.
              </Alert>
            ) : (
              <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 2 }}>
                <AlertTitle>Some rows could not be validated</AlertTitle>
                {validRowsCount} of {totalRowsCount} row(s) are valid. Review the
                invalid rows below, fix them, or proceed and upload only the
                valid rows.
              </Alert>
            )}

            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip
                color="error"
                size="small"
                label={`Errors: ${errorCount}`}
              />
              <Chip
                color={warningCount ? 'warning' : 'default'}
                size="small"
                label={`Warnings: ${warningCount}`}
              />
              <Chip
                size="small"
                label={`Total rows: ${totalRowsCount}`}
              />
              <Chip
                size="small"
                color={validRowsCount > 0 ? 'success' : 'default'}
                label={`Valid rows: ${validRowsCount}`}
              />
              <Chip
                size="small"
                color={rowIssues.length ? 'error' : 'default'}
                label={`Invalid rows: ${rowIssues.length}`}
              />
            </Stack>

            {/* Expected template — for quick reference */}
            <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: '#fafafa' }}>
              <Typography variant="caption" color="text.secondary">
                Expected column names (exact, case-sensitive, no extra spaces):
              </Typography>
              <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {EXCEL_HEADERS.map((h) => (
                  <Chip key={h} size="small" variant="outlined" label={h} />
                ))}
              </Box>
            </Paper>

            {/* File-level issues */}
            {fileIssues.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  File issues
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Issue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fileIssues.map((f, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ color: 'error.main' }}>{f.issue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* Column-level issues */}
            {columnIssues.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Column issues ({columnIssues.length})
                </Typography>
                <TableContainer sx={{ maxHeight: 280 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Column</TableCell>
                        <TableCell>Expected</TableCell>
                        <TableCell>Received</TableCell>
                        <TableCell>Issue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {columnIssues.map((c, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{c.column}</TableCell>
                          <TableCell>{renderQuoted(c.expected)}</TableCell>
                          <TableCell>{renderQuoted(c.received)}</TableCell>
                          <TableCell
                            sx={{
                              color: c.severity === 'warning' ? 'warning.main' : 'error.main',
                              fontSize: '0.85rem',
                            }}
                          >
                            {c.issue}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* Row-level issues */}
            {rowIssues.length > 0 && (
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
                    Row issues ({rowIssues.length})
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => downloadInvalidRowsExcel(rowIssues, fileName)}
                  >
                    Download invalid rows
                  </Button>
                </Box>

                <TableContainer sx={{ maxHeight: 360 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Excel row</TableCell>
                        <TableCell>Field</TableCell>
                        <TableCell>Expected</TableCell>
                        <TableCell>Received</TableCell>
                        <TableCell>Issue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowIssues.flatMap((r) =>
                        r.issues.map((i, idx) => (
                          <TableRow key={`${r.rowNumber}-${idx}`} hover>
                            <TableCell>{r.rowNumber}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{i.field}</TableCell>
                            <TableCell>{renderQuoted(i.expected)}</TableCell>
                            <TableCell>{renderQuoted(i.received)}</TableCell>
                            <TableCell sx={{ color: 'error.main', fontSize: '0.85rem' }}>
                              {i.issue}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              {canProceed && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={onProceed}
                >
                  Upload {validRowsCount} valid row{validRowsCount === 1 ? '' : 's'} anyway
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
