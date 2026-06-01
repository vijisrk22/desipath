import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Chip, Stack } from "@mui/material";
import { searchRoom } from "../../store/RoommatesSlice";

function ActiveRoomSearchFilters() {
    const dispatch = useDispatch();
    const roommatesState = useSelector((state) => state.roommates);
    const lastSearchQuery = roommatesState?.lastSearchQuery;

    if (!lastSearchQuery) return null;

    const handleRemove = (key) => {
        let newQuery = { ...lastSearchQuery };

        if (key === "location") {
            newQuery.location = "";
        } else if (key === "price") {
            delete newQuery.priceMin;
            delete newQuery.priceMax;
        }

        dispatch(searchRoom(newQuery));
    };

    const chips = [];

    // Location Chip
    if (lastSearchQuery.location && typeof lastSearchQuery.location === 'string') {
        chips.push(
            <Chip
                key="location"
                label={`Location: ${lastSearchQuery.location}`}
                onDelete={() => handleRemove("location")}
                color="primary"
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
                color="primary"
                variant="outlined"
            />
        )
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

export default ActiveRoomSearchFilters;
