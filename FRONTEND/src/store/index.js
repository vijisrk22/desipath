import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice"; // Import your user reducer
import chatReducer from "./ChatSlice"; // Import your chat reducer
import roommatesReducer from "./RoommatesSlice"; // Import your roommates reducer
import housesReducer from "./HousesSlice";
import rentalHomesReducer from "./RentalHomesSlice";
import carsSliceReducer from "./CarsSlice";
import travelCompanionReducer from "./TravelCompanionSlice"; // Import your travel companion reducer
import itTrainingsReducer from "./ITTrainingsSlice"
import eventsReducer from "./EventsSlice"; // Import your events reducer
import locationReducer from "./LocationSlice";

const store = configureStore({
  reducer: {
    // Add your reducers here
    user: userReducer,
    chat: chatReducer,
    roommates: roommatesReducer,
    houses: housesReducer,
    rentalHomes: rentalHomesReducer,
    cars: carsSliceReducer,
    travelCompanion: travelCompanionReducer,
    itTrainings: itTrainingsReducer,
    events: eventsReducer,
    location: locationReducer,
  },
});

export default store;
