import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const EditTrainingPostModal = ({ open, onClose, formDetails, editFunc }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bg: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2">
                    Edit Training (Coming Soon)
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Update functionality for IT trainings is being finalized.
                </Typography>
                <Button onClick={onClose} sx={{ mt: 3 }}>Close</Button>
            </Box>
        </Modal>
    );
};

export default EditTrainingPostModal;
