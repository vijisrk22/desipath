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

    // Robust sanitization helper to ensure no objects are rendered as children
    const sanitizeValue = (val, fallback = "") => {
        if (!val) return fallback;
        if (typeof val === 'string' || typeof val === 'number') return val;
        if (typeof val === 'object') {
            // Priority list of common display properties
            return val.name || val.make || val.model || val.title || val.text || JSON.stringify(val);
        }
        return fallback;
    };

    // Location Chip
    if (lastSearchQuery.location) {
        const locLabel = sanitizeValue(lastSearchQuery.location);
        if (locLabel) {
            chips.push(
                <Chip
                    key="location"
                    label={`Location: ${locLabel}`}
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
    }

    // Price Chip
    if (lastSearchQuery.priceMin !== undefined || lastSearchQuery.priceMax !== undefined) {
        const min = sanitizeValue(lastSearchQuery.priceMin, 0);
        const max = sanitizeValue(lastSearchQuery.priceMax, 'Any');
        chips.push(
            <Chip
                key="price"
                label={`Price: $${min} - $${max}`}
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
        const makeLabel = sanitizeValue(lastSearchQuery.carMake);
        if (makeLabel) {
            chips.push(
                <Chip
                    key="make"
                    label={`Make: ${makeLabel}`}
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
    }

    // Model Chip
    if (lastSearchQuery.carModel) {
        const modelLabel = sanitizeValue(lastSearchQuery.carModel);
        if (modelLabel) {
            chips.push(
                <Chip
                    key="model"
                    label={`Model: ${modelLabel}`}
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
    }

    if (chips.length === 0) return null;
    
    const handleClearAll = () => {
        dispatch(searchCar({}));
    };

    return (
        <div className="py-2 hidden md:flex items-center flex-wrap gap-2">
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
