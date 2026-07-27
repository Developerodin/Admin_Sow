import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const SKELETON_ROW_COUNT = 8;

/**
 * Reusable MUI table with server-driven pagination.
 * Parent owns page/limit state and fetches data from the API.
 */
export const ServerPaginatedTable = ({
  rows = [],
  column = [],
  count = 0,
  page = 0,
  rowsPerPage = 50,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  loadingMessage = 'Loading data...',
  emptyMessage = 'No records found.',
  rowKeyField,
  rowsPerPageOptions = [25, 50, 100, 200],
}) => {
  const handleChangePage = (event, newPage) => {
    if (loading) return;
    onPageChange?.(event, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    if (loading) return;
    onRowsPerPageChange?.(event);
  };

  const showSkeleton = loading && rows.length === 0;
  const showOverlay = loading && rows.length > 0;
  const skeletonRows = Math.min(rowsPerPage, SKELETON_ROW_COUNT);

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
        }}
      >
        {loading && (
          <LinearProgress
            color="primary"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 4,
              height: 4,
            }}
          />
        )}

        <TableContainer sx={{ minHeight: 280, position: 'relative' }}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="server paginated table">
            <TableHead>
              <TableRow>
                {column.map((col, index) => (
                  <TableCell
                    key={`header-${col.name}-${index}`}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      fontSize: 15,
                      color: 'grey.700',
                      bgcolor: 'grey.50',
                    }}
                  >
                    {col.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                position: 'relative',
                opacity: showOverlay ? 0.45 : 1,
                transition: 'opacity 0.2s ease',
                pointerEvents: loading ? 'none' : 'auto',
              }}
            >
              {showSkeleton &&
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`}>
                    {column.map((col, cellIndex) => (
                      <TableCell
                        key={`skeleton-${rowIndex}-${col.name}-${cellIndex}`}
                        align="center"
                        sx={{ py: 1.5 }}
                      >
                        <Skeleton
                          variant="text"
                          animation="wave"
                          sx={{ mx: 'auto', width: cellIndex === 0 ? '40%' : '70%' }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={column.length || 1} align="center" sx={{ py: 6, border: 0 }}>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </TableCell>
                </TableRow>
              )}

              {!showSkeleton &&
                rows.map((row, index) => {
                  const rowKey =
                    rowKeyField && row[rowKeyField] != null
                      ? String(row[rowKeyField])
                      : `row-${index}`;
                  return (
                    <TableRow key={rowKey} tabIndex={-1} hover>
                      {column.map((col, cellIndex) => (
                        <TableCell
                          key={`${rowKey}-${col.name}-${cellIndex}`}
                          align="center"
                          sx={{ fontSize: '13px' }}
                        >
                          {row[col.name]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {showOverlay && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                top: 56,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                bgcolor: 'rgba(255, 255, 255, 0.55)',
                zIndex: 3,
              }}
            >
              <CircularProgress size={36} thickness={4} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {loadingMessage}
              </Typography>
            </Box>
          )}
        </TableContainer>
      </Paper>

      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={loading && rows.length === 0 ? 0 : count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? 'none' : 'auto',
        }}
      />
    </Box>
  );
};
