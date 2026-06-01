import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Button, 
  Typography, 
  Box,
  Divider
} from '@mui/material';
import { Close, MyLocation, Explore } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import LocationAutocompleteInput from './InputTemplate/LocationAutocompleteInput';

const LocationSelectorModal = ({ open, onClose, onSelectLocation, onShowAll, buttonLabel }) => {
  const { control, setValue, handleSubmit } = useForm();
  const [detecting, setDetecting] = useState(false);

  const onSubmit = (data) => {
    console.log("Modal onSubmit data:", data);
    if (data.location) {
      onSelectLocation(data.location);
    }
  };

  const handleDetectLocation = () => {
    console.log("Detecting location...");
    setDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use reverse geocoding to get city/zip
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            const address = data.address;
            const locationString = `${address.city || address.town || address.village || ''}, ${address.state || ''}, ${address.postcode || ''}`;
            console.log("Detected location:", locationString);
            onSelectLocation(locationString);
          } catch (error) {
            console.error("Error detecting location details:", error);
            alert("Could not determine address from your coordinates.");
          } finally {
            setDetecting(false);
          }
        },
        (error) => {
          console.error("Error detecting location:", error);
          setDetecting(false);
          alert("Location access denied or unavailable.");
        }
      );
    } else {
      setDetecting(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => { console.log("Dialog onClose called"); onClose(); }}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          padding: '16px',
          margin: { xs: '16px', sm: '32px' },
          width: { xs: 'calc(100% - 32px)', sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
            Set Your Location
          </Typography>
          <IconButton onClick={() => { console.log("X Close clicked"); onClose(); }} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
          See events happening near you.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            gap: { xs: 1, sm: 1.5 }, 
            alignItems: 'center',
            width: '100%' 
          }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <LocationAutocompleteInput 
                control={control} 
                setValue={setValue} 
                type="search"
                onSelect={(loc) => {
                   console.log("Autocomplete onSelect:", loc);
                   onSelectLocation(loc);
                }}
                placeholder="Enter City, State, Zip"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                flexShrink: 0,
                height: '42px',
                px: { xs: 2.5, sm: 3 },
                borderRadius: '30px',
                bgcolor: '#ffa41c',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#e69419',
                  boxShadow: 'none',
                }
              }}
            >
              Go
            </Button>
          </Box>
          
          <Button
            type="button"
            fullWidth
            variant="outlined"
            startIcon={<MyLocation />}
            onClick={handleDetectLocation}
            disabled={detecting}
            sx={{
              borderRadius: '12px',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              borderColor: '#e0e0e0',
              color: '#333',
              '&:hover': {
                borderColor: '#ffa41c',
                bgcolor: '#fffbf2'
              }
            }}
          >
            {detecting ? 'Detecting...' : 'Detect My Location'}
          </Button>

          <Box sx={{ mt: 3 }}>
          </Box>

          <Button
            type="button"
            fullWidth
            variant="text"
            onClick={() => { console.log("Exit button clicked"); onClose(); }}
            sx={{
              mt: 1,
              textTransform: 'none',
              fontWeight: 700,
              color: '#666',
              '&:hover': {
                color: '#333',
                bgcolor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Exit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelectorModal;
