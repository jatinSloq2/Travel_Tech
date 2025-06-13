import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";

const PAGE_SIZE = 20;

const BookingTable = ({ bookings, type, currentPage, onPageChange }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-2">
        No {type} bookings found.
      </p>
    );
  }

  const totalPages = Math.ceil(bookings.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBookings = bookings.slice(startIndex, startIndex + PAGE_SIZE);

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table aria-label={`${type} bookings table`} >
        <TableHead>
          <TableRow>
            <TableCell>Booking ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Amount (₹)</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Review</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedBookings.map((b) => (
            <TableRow key={b._id || b.id} hover>
              <TableCell>{b._id || b.id}</TableCell>
              <TableCell>{b.userId}</TableCell>
              <TableCell>{b.status}</TableCell>
              <TableCell align="right">
                {(b.totalAmount || b.amount || 0).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(b.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {b.review ? (
                  <div>
                    <strong>Rating:</strong> {b.review.rating}/5
                  </div>
                ) : (
                  <em style={{ color: "#888" }}>Not Reviewed Yet</em>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              count={bookings.length}
              rowsPerPage={PAGE_SIZE}
              page={currentPage - 1} // MUI 0-based
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]} // Hide rowsPerPage selector
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count}`
              }
              component="td"
              colSpan={6}
              sx={{ "& .MuiTablePagination-root": { border: 0 } }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default BookingTable;
