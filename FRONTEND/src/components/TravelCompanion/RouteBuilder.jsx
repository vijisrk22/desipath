import React, { useState, useEffect } from 'react';
import { IconButton, Button, Box, Typography, Tooltip } from '@mui/material';
import { 
  Add, 
  RemoveCircleOutline, 
  DragIndicator, 
  TripOrigin, 
  Place, 
  SyncAlt 
} from '@mui/icons-material';
import AirportAutocomplete from './AirportAutocomplete';

const RouteBuilder = ({ onChange, initialLegs }) => {
  const [legs, setLegs] = useState(initialLegs || [
    { id: '1', iata_code: '', city: '', airport_name: '', airline: '', flight_number: '', leg_type: 'departure' },
    { id: '2', iata_code: '', city: '', airport_name: '', airline: '', flight_number: '', leg_type: 'destination' }
  ]);

  useEffect(() => {
    if (onChange) onChange(legs);
  }, [legs]);

  const addTransit = () => {
    const newLegs = [...legs];
    const transitLeg = { 
      id: Date.now().toString(), 
      iata_code: '', 
      city: '', 
      airport_name: '', 
      airline: '', 
      flight_number: '', 
      leg_type: 'transit' 
    };
    // Insert before the destination leg
    newLegs.splice(newLegs.length - 1, 0, transitLeg);
    setLegs(newLegs);
  };

  const removeLeg = (id) => {
    if (legs.length <= 2) return;
    setLegs(legs.filter(leg => leg.id !== id));
  };

  const updateLeg = (id, data) => {
    setLegs(legs.map(leg => (leg.id === id ? { ...leg, ...data } : leg)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1f2937' }}>
          Travel Route <span className="text-gray-400 font-medium">(Add stops for transit)</span>
        </Typography>
      </div>

      <div className="relative space-y-4">
        {/* Connection Line */}
        <div className="absolute left-[21px] top-8 bottom-8 w-0.5 bg-dashed-gray bg-[image:linear-gradient(to_bottom,#e5e7eb_50%,transparent_50%)] bg-[size:1px_8px]"></div>

        {legs.map((leg, index) => (
          <div 
            key={leg.id}
            className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all ${
              leg.iata_code ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-50'
            }`}
          >
            {/* Step Indicator */}
            <div className="mt-2.5 z-10">
              {leg.leg_type === 'departure' ? (
                <TripOrigin sx={{ color: '#2563eb', fontSize: 20 }} />
              ) : leg.leg_type === 'destination' ? (
                <Place sx={{ color: '#ef4444', fontSize: 24 }} />
              ) : (
                <SyncAlt sx={{ color: '#3b82f6', fontSize: 20 }} />
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {leg.leg_type} {leg.leg_type === 'transit' ? `#${index}` : ''}
                </span>
                {leg.leg_type === 'transit' && (
                  <IconButton size="small" onClick={() => removeLeg(leg.id)} sx={{ color: '#9ca3af' }}>
                    <RemoveCircleOutline fontSize="small" />
                  </IconButton>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Box>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 ml-1">Airport</label>
                  <AirportAutocomplete 
                    value={leg.city ? `${leg.city} (${leg.iata_code})` : ""}
                    onSelect={(airport) => updateLeg(leg.id, {
                      iata_code: airport.iata_code,
                      city: airport.city,
                      airport_name: airport.airport_name
                    })}
                  />
                </Box>
                <div className="grid grid-cols-2 gap-3">
                  <Box>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 ml-1">Airline <span className="font-normal">(Opt)</span></label>
                    <input 
                      type="text"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#2563eb] outline-none transition-all"
                      placeholder="e.g. Air India"
                      value={leg.airline}
                      onChange={(e) => updateLeg(leg.id, { airline: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 ml-1">Flight # <span className="font-normal">(Opt)</span></label>
                    <input 
                      type="text"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#2563eb] outline-none transition-all"
                      placeholder="AI102"
                      value={leg.flight_number}
                      onChange={(e) => updateLeg(leg.id, { flight_number: e.target.value })}
                    />
                  </Box>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        startIcon={<Add />}
        onClick={addTransit}
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: '16px',
          border: '2px dashed #e5e7eb',
          color: '#6b7280',
          textTransform: 'none',
          fontWeight: 700,
          '&:hover': {
            borderColor: '#2563eb',
            color: '#2563eb',
            bgcolor: 'blue.50'
          }
        }}
      >
        Add Transit Stop
      </Button>
    </div>
  );
};

export default RouteBuilder;
