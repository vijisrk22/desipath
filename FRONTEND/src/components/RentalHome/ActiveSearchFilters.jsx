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
                color="primary"
                variant="outlined"
            />
        );
    }

    // Price Chip
    // Check if priceMin/Max differs from default or just always show if present?
    // Let's show if present.
    if (lastSearchQuery.priceMin !== undefined || lastSearchQuery.priceMax !== undefined) {
        chips.push(
            <Chip
                key="price"
                label={`Price: $${lastSearchQuery.priceMin || 0} - $${lastSearchQuery.priceMax || 'Any'}`}
                onDelete={() => handleRemove("price")}
                color="primary"
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
                    color="primary"
                    variant="outlined"
                />
            );
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className="px-20 py-4">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {chips}
            </Stack>
        </div>
    );
}

export default ActiveSearchFilters;
