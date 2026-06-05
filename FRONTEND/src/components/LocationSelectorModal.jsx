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
import { Close, MyLocation, Explore, LocationOn } from '@mui/icons-material';
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
          fontFamily: '"DM Sans", sans-serif',
          borderRadius: '16px',
          padding: '24px',
          margin: { xs: '16px', sm: '32px' },
          width: { xs: 'calc(100% - 32px)', sm: 'auto' },
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 3 }}>
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <IconButton onClick={() => { console.log("X Close clicked"); onClose(); }} size="small" sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#ebebeb' } }}>
            <Close sx={{ fontSize: '1.2rem', color: '#333' }} />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" mb={1.5}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#faedd9', display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 2 }}>
            <LocationOn sx={{ color: '#d98218', fontSize: '1.5rem' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#1a1a1a', fontFamily: 'inherit', fontSize: '1.25rem' }}>
            Set your location
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#333', fontFamily: 'inherit' }}>
          Find events and deals near you.
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
                placeholder="City, state or ZIP"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                flexShrink: 0,
                height: '42px',
                px: { xs: 2.5, sm: 3 },
                borderRadius: '8px',
                bgcolor: '#f29c11',
                color: 'white',
                fontWeight: 600,
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#d98218',
                  boxShadow: 'none',
                }
              }}
            >
              Search
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
            <Typography sx={{ mx: 2, color: '#666', fontSize: '0.9rem', fontFamily: 'inherit' }}>or</Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
          </Box>
          
          <Button
            type="button"
            fullWidth
            variant="outlined"
            startIcon={<MyLocation sx={{ color: '#f29c11' }} />}
            onClick={handleDetectLocation}
            disabled={detecting}
            sx={{
              borderRadius: '8px',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              fontFamily: 'inherit',
              borderColor: '#dcdcdc',
              bgcolor: '#f8f6f0',
              color: '#000',
              fontSize: '1rem',
              '&:hover': {
                borderColor: '#c0c0c0',
                bgcolor: '#f0eee8'
              }
            }}
          >
            {detecting ? 'Detecting...' : 'Use my current location'}
          </Button>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="button"
              variant="text"
              onClick={() => { console.log("Exit button clicked"); onClose(); }}
              sx={{
                textTransform: 'none',
                fontWeight: 'normal',
                fontFamily: 'inherit',
                color: '#666',
                fontSize: '1rem',
                '&:hover': {
                  color: '#333',
                  bgcolor: 'transparent',
                }
              }}
            >
              Not now
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelectorModal;
