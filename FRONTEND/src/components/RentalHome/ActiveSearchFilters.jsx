import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Chip, Stack } from "@mui/material";
import { searchRentalHome } from "../../store/RentalHomesSlice";

function ActiveSearchFilters() {
    const dispatch = useDispatch();
    const rentalHomesState = useSelector((state) => state.rentalHomes);
    const lastSearchQuery = rentalHomesState?.lastSearchQuery;

    if (!lastSearchQuery) return null;

    const handleRemove = (key, valueToRemove) => {
        let newQuery = { ...lastSearchQuery };

        if (key === "location") {
            newQuery.city = "";
            newQuery.state = "";
            newQuery.zipcode = "";
        } else if (key === "price") {
            // Reset to default wide range or remove?
            // SearchFieldInput defaults are 1000-15000 approx.
            // Or just remove the fields. Backend handles nullable.
            delete newQuery.priceMin;
            delete newQuery.priceMax;
        } else if (key === "type") {
            if (Array.isArray(newQuery.rentalHomeType)) {
                newQuery.rentalHomeType = newQuery.rentalHomeType.filter(t => t !== valueToRemove);
            } else {
                newQuery.rentalHomeType = [];
            }
        }

        // Dispatch new search
        dispatch(searchRentalHome({ searchQuery: newQuery }));
    };

    const chips = [];

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
        const min = typeof lastSearchQuery.priceMin === 'object' ? 0 : (lastSearchQuery.priceMin || 0);
        const max = typeof lastSearchQuery.priceMax === 'object' ? 'Any' : (lastSearchQuery.priceMax || 'Any');
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

    // Type Chips
    if (
        lastSearchQuery.rentalHomeType &&
        Array.isArray(lastSearchQuery.rentalHomeType) &&
        lastSearchQuery.rentalHomeType.length > 0
    ) {
        lastSearchQuery.rentalHomeType.forEach((type) => {
            chips.push(
                <Chip
                    key={`type-${type}`}
                    label={`Type: ${type}`}
                    onDelete={() => handleRemove("type", type)}
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
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className="py-2 hidden md:block">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {chips}
            </Stack>
        </div>
    );
}

export default ActiveSearchFilters;
