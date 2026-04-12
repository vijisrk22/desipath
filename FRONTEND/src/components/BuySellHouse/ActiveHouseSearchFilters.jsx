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

export default ActiveHouseSearchFilters;
