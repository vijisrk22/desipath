import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, TextField, Pagination, CircularProgress, Box 
} from "@mui/material";

export default function ZipcodesAdmin() {
  const [zipcodes, setZipcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const perPage = 50;

  const fetchZipcodes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/zipcodes?page=${page}&perPage=${perPage}&search=${search}`);
      setZipcodes(res.data.data);
      setTotalPages(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching zipcodes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZipcodes();
  }, [page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchZipcodes();
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <Box className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <Box className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Typography variant="h5" className="font-bold text-gray-800">
            📍 Zipcode Master List 
            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full inline-block align-middle font-bold">
              {total.toLocaleString()} Total
            </span>
          </Typography>
          <Typography variant="body2" className="text-gray-500">Manage all geographic coordinates in the system</Typography>
        </div>
        <TextField
          size="small"
          placeholder="Search Zip, City or State..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold text-gray-600">Zipcode</TableCell>
              <TableCell className="font-bold text-gray-600">City</TableCell>
              <TableCell className="font-bold text-gray-600">State</TableCell>
              <TableCell className="font-bold text-gray-600">Latitude</TableCell>
              <TableCell className="font-bold text-gray-600">Longitude</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : zipcodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography className="text-gray-400 font-medium">No zipcodes found matching your criteria</Typography>
                </TableCell>
              </TableRow>
            ) : (
              zipcodes.map((zip) => (
                <TableRow key={zip.id} hover>
                  <TableCell className="font-mono text-blue-600 font-bold">{zip.zip}</TableCell>
                  <TableCell className="font-medium">{zip.city}</TableCell>
                  <TableCell>{zip.state_name}</TableCell>
                  <TableCell className="text-gray-500 text-xs">{zip.lat}</TableCell>
                  <TableCell className="text-gray-500 text-xs">{zip.lng}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="p-4 border-t border-gray-100 flex justify-center">
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(e, v) => setPage(v)} 
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
}
