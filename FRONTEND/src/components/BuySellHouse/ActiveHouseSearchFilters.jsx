import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Chip, Stack } from "@mui/material";
import { searchHouse } from "../../store/HousesSlice";

function ActiveHouseSearchFilters() {
    const dispatch = useDispatch();
    const housesState = useSelector((state) => state.houses);
    const lastSearchQuery = housesState?.lastSearchQuery;

    if (!lastSearchQuery) return null;

    const handleRemove = (key, valueToRemove) => {
        let newQuery = { ...lastSearchQuery };

        if (key === "location") {
            newQuery.city = "";
            newQuery.state = "";
            newQuery.zipcode = "";
        } else if (key === "price") {
            delete newQuery.priceMin;
            delete newQuery.priceMax;
        } else if (key === "type") {
            if (Array.isArray(newQuery.houseType)) {
                newQuery.houseType = newQuery.houseType.filter(t => t !== valueToRemove);
            } else {
                newQuery.houseType = [];
            }
        }

        dispatch(searchHouse({ searchQuery: newQuery }));
    };

    const handleClearAll = () => {
        dispatch(searchHouse({ searchQuery: {} }));
    };

    const chips = [];

    const chipStyle = {
        color: '#0857d0',
        borderColor: '#0857d0',
        fontWeight: 600,
        fontFamily: 'DM Sans, sans-serif',
        '& .MuiChip-deleteIcon': {
            color: '#0857d0',
            '&:hover': {
                color: '#0043a8'
            }
        }
    };

    // Location Chip
    if (
        lastSearchQuery.city ||
        lastSearchQuery.state ||
        lastSearchQuery.zipcode
    ) {
        const locText = [
            lastSearchQuery.city,
            lastSearchQuery.state,
            lastSearchQuery.zipcode,
        ]
            .filter(Boolean)
            .join(", ");
        chips.push(
            <Chip
                key="location"
                label={`Location: ${locText}`}
                onDelete={() => handleRemove("location")}
                variant="outlined"
                sx={chipStyle}
            />
        );
    }

    if (lastSearchQuery.priceMin !== undefined || lastSearchQuery.priceMax !== undefined) {
        const min = typeof lastSearchQuery.priceMin === 'object' ? 0 : (lastSearchQuery.priceMin || 0);
        const max = typeof lastSearchQuery.priceMax === 'object' ? 'Any' : (lastSearchQuery.priceMax || 'Any');
        chips.push(
            <Chip
                key="price"
                label={`Price: $${min} - $${max}`}
                onDelete={() => handleRemove("price")}
                variant="outlined"
                sx={chipStyle}
            />
        )
    }

    if (
        lastSearchQuery.houseType &&
        Array.isArray(lastSearchQuery.houseType) &&
        lastSearchQuery.houseType.length > 0
    ) {
        lastSearchQuery.houseType.forEach((type) => {
            chips.push(
                <Chip
                    key={`type-${type}`}
                    label={`Type: ${type}`}
                    onDelete={() => handleRemove("type", type)}
                    variant="outlined"
                    sx={chipStyle}
                />
            );
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className="py-2 hidden md:flex flex-wrap items-center gap-3">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {chips}
            </Stack>
            {chips.length > 0 && (
                <button 
                    onClick={handleClearAll}
                    className="text-[#0857d0] hover:text-[#0043a8] text-sm font-bold underline transition-colors"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}

export default ActiveHouseSearchFilters;
