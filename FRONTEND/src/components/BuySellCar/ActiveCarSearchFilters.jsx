import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Chip, Stack } from "@mui/material";
import { searchCar } from "../../store/CarsSlice";

function ActiveCarSearchFilters() {
    const dispatch = useDispatch();
    const carsState = useSelector((state) => state.cars);
    const lastSearchQuery = carsState?.lastSearchQuery;

    if (!lastSearchQuery) return null;

    const handleRemove = (key) => {
        let newQuery = { ...lastSearchQuery };

        if (key === "location") {
            newQuery.location = "";
        } else if (key === "price") {
            delete newQuery.priceMin;
            delete newQuery.priceMax;
        } else if (key === "make") {
            newQuery.carMake = "";
            newQuery.carModel = "";
        } else if (key === "model") {
            newQuery.carModel = "";
        }

        dispatch(searchCar(newQuery));
    };

    const chips = [];

    // Location Chip
    if (lastSearchQuery.location) {
        chips.push(
            <Chip
                key="location"
                label={`Location: ${lastSearchQuery.location}`}
                onDelete={() => handleRemove("location")}
                sx={{
                    borderColor: '#0857d0',
                    color: '#0857d0',
                    fontWeight: '500',
                    '& .MuiChip-deleteIcon': {
                        color: '#0857d0',
                        opacity: 0.7,
                        '&:hover': { opacity: 1 }
                    }
                }}
                variant="outlined"
            />
        );
    }

    // Price Chip
    if (lastSearchQuery.priceMin !== undefined || lastSearchQuery.priceMax !== undefined) {
        chips.push(
            <Chip
                key="price"
                label={`Price: $${lastSearchQuery.priceMin || 0} - $${lastSearchQuery.priceMax || 'Any'}`}
                onDelete={() => handleRemove("price")}
                sx={{
                    borderColor: '#0857d0',
                    color: '#0857d0',
                    fontWeight: '500',
                    '& .MuiChip-deleteIcon': {
                        color: '#0857d0',
                        opacity: 0.7,
                        '&:hover': { opacity: 1 }
                    }
                }}
                variant="outlined"
            />
        )
    }

    // Make Chip
    if (lastSearchQuery.carMake) {
        chips.push(
            <Chip
                key="make"
                label={`Make: ${lastSearchQuery.carMake}`}
                onDelete={() => handleRemove("make")}
                sx={{
                    borderColor: '#0857d0',
                    color: '#0857d0',
                    fontWeight: '500',
                    '& .MuiChip-deleteIcon': {
                        color: '#0857d0',
                        opacity: 0.7,
                        '&:hover': { opacity: 1 }
                    }
                }}
                variant="outlined"
            />
        );
    }

    // Model Chip
    if (lastSearchQuery.carModel) {
        chips.push(
            <Chip
                key="model"
                label={`Model: ${lastSearchQuery.carModel}`}
                onDelete={() => handleRemove("model")}
                sx={{
                    borderColor: '#0857d0',
                    color: '#0857d0',
                    fontWeight: '500',
                    '& .MuiChip-deleteIcon': {
                        color: '#0857d0',
                        opacity: 0.7,
                        '&:hover': { opacity: 1 }
                    }
                }}
                variant="outlined"
            />
        );
    }

    if (chips.length === 0) return null;
    
    const handleClearAll = () => {
        dispatch(searchCar({}));
    };

    return (
        <div className="py-2 flex items-center flex-wrap gap-2">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {chips}
            </Stack>
            <button 
                onClick={handleClearAll}
                className="text-[#0857d0] text-sm font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer whitespace-nowrap ml-2 transition-all"
            >
                Clear All
            </button>
        </div>
    );
}

export default ActiveCarSearchFilters;
