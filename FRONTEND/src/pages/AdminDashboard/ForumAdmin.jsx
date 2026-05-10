import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress 
} from '@mui/material';
import { Edit, Delete, Add, Link as LinkIcon, WarningAmber } from '@mui/icons-material';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function ForumAdmin() {
  const [subforums, setSubforums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingSubforum, setEditingSubforum] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '💬' });

  // Delete Post by URL state
  const [postUrl, setPostUrl] = useState('');
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  // Confirmation Dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Delete',
    color: 'error'
  });

  const closeConfirm = () => setConfirmDialog(prev => ({ ...prev, open: false }));

  const triggerConfirm = (title, message, onConfirm, confirmText = 'Delete', color = 'error') => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeConfirm();
      },
      confirmText,
      color
    });
  };

  useEffect(() => {
    fetchSubforums();
  }, []);

  const fetchSubforums = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/forum/subforums');
      if (res.data.success) {
        setSubforums(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subforums");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subforum = null) => {
    if (subforum) {
      setEditingSubforum(subforum);
      setFormData({ name: subforum.name, description: subforum.description || '', icon: subforum.icon || '💬' });
    } else {
      setEditingSubforum(null);
      setFormData({ name: '', description: '', icon: '💬' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      if (editingSubforum) {
        await api.put(`/api/admin/forum/subforums/${editingSubforum.id}`, formData);
        toast.success("Subforum updated");
      } else {
        await api.post('/api/admin/forum/subforums', formData);
        toast.success("Subforum created");
      }
      setIsModalOpen(false);
      fetchSubforums();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save subforum");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSubforum = async (id) => {
    triggerConfirm(
      "Delete Subforum?",
      "Are you sure you want to delete this subforum? This will not delete posts but might cause orphaned categories.",
      async () => {
        try {
          await api.delete(`/api/admin/forum/subforums/${id}`);
          toast.success("Subforum deleted");
          fetchSubforums();
        } catch (err) {
          toast.error("Deletion failed");
        }
      }
    );
  };

  const handleDeletePostByUrl = async () => {
    if (!postUrl.trim()) return toast.warning("Please enter a post URL");
    
    triggerConfirm(
      "Confirm Post Deletion",
      `Are you sure you want to delete the post at this URL?\n\n${postUrl}`,
      async () => {
        setIsDeletingPost(true);
        try {
          const res = await api.post('/api/admin/forum/posts/delete-by-url', { url: postUrl });
          if (res.data.success) {
            toast.success(res.data.message);
            setPostUrl('');
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete post. Check the URL.");
        } finally {
          setIsDeletingPost(false);
        }
      }
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="800" gutterBottom>Forum Management</Typography>
      
      {/* Delete Post by URL Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #eee' }} elevation={0}>
        <Typography variant="h6" fontWeight="700" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon color="primary" /> Delete Post by URL
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Quickly remove any inappropriate post by pasting its full URL (e.g., http://localhost:3000/forum/post/my-post-slug).
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            fullWidth 
            placeholder="Paste post URL here..." 
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            size="small"
          />
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeletePostByUrl}
            disabled={isDeletingPost}
            sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 'bold' }}
          >
            {isDeletingPost ? <CircularProgress size={20} color="inherit" /> : "Delete Post"}
          </Button>
        </Box>
      </Paper>

      {/* Subforums Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="700">Subforums / Categories</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpenModal()}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', bgcolor: '#2563eb' }}
        >
          Create Subforum
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #eee' }} elevation={0}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Icon</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Slug</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : subforums.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No subforums created yet.
                </TableCell>
              </TableRow>
            ) : (
              subforums.map((sub) => (
                <TableRow key={sub.id} hover>
                  <TableCell sx={{ fontSize: '1.5rem' }}>{sub.icon}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{sub.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{sub.slug}</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sub.description || '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenModal(sub)} size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSubforum(sub.id)} size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingSubforum ? "Edit Subforum" : "Create New Subforum"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              label="Name" 
              fullWidth 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField 
              label="Icon (Emoji)" 
              fullWidth 
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g. 🍔, 💻, 🏀"
            />
            <TextField 
              label="Description" 
              fullWidth 
              multiline 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={isDeleting || !formData.name}
            sx={{ fontWeight: 'bold', px: 4, borderRadius: 2 }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Save Subforum"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={closeConfirm}
        PaperProps={{
          sx: { borderRadius: 4, p: 1, maxWidth: 400 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, pt: 3 }}>
          <WarningAmber sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>{confirmDialog.title}</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ px: 2 }}>
            {confirmDialog.message}
          </Typography>
        </Box>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={closeConfirm} 
            sx={{ fontWeight: 'bold', color: 'text.secondary', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDialog.onConfirm} 
            variant="contained" 
            color={confirmDialog.color}
            sx={{ fontWeight: 'bold', px: 4, borderRadius: 2 }}
          >
            {confirmDialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
