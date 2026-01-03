import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Roommates from "./pages/Roommates/Roommates";
import RoomDetails from "./pages/Roommates/RoomDetails";
import Chat from "./components/Chat/Chat";
import BuySellHouse from "./pages/BuySellHouse/BuySellHouse";
import HouseDetails from "./pages/BuySellHouse/HouseDetails";
import RentalHome from "./pages/RentalHome/RentalHome";
import BuySellCar from "./pages/BuySellCar/BuySellCar";
import CarDetails from "./pages/BuySellCar/CarDetails";
import TravelCompanion from "./pages/TravelCompanion/TravelCompanion";
import ITTrainings from "./pages/ITTrainings/ITTrainings";
import CourseDetailsPage from "./pages/ITTrainings/CourseDetailsPage";
import EventsLanding from "./pages/Events/EventsLanding";
import EventDetails from "./pages/Events/EventDetails";
import ViewProfile from "./components/User/ViewProfile";
import PrivateRoute from "./components/PrivateRoute";
import EditProfile from "./components/User/EditProfile";
import MyListings from "./components/User/MyListings";
import ProfileLayout from "./components/User/ProfileLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileLayout /> {/* Shared layout with <Outlet /> */}
            </PrivateRoute>
          }
        >
          <Route index element={<ViewProfile />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="myListings" element={<MyListings />} />
        </Route>

        <Route path="/services">
          {/* Roommates */}
          <Route path="roommates/:action?" element={<Roommates />} />

          {/* Buy/Sell House */}
          <Route path="houses/:action?" element={<BuySellHouse />} />
          <Route path="houses/:action/:houseId" element={<HouseDetails />} />

          {/* Rental Home */}
          <Route path="rentalHomes/:action?" element={<RentalHome />} />

          {/* Buy/Sell Car */}
          <Route path="cars/:action?" element={<BuySellCar />} />
          <Route path="cars/:action/:carId" element={<CarDetails />} />

          {/* Travel Companion */}
          <Route
            path="travelCompanion/:action?"
            element={<TravelCompanion />}
          />

          {/* IT Trainings */}
          <Route path="itTrainings/:action?" element={<ITTrainings />} />
          <Route
            path="itTrainings/:action/:courseId"
            element={<CourseDetailsPage />}
          />

          {/* Events */}
          <Route path="events/:action?" element={<EventsLanding />} />
          <Route path="events/:action/:eventId" element={<EventDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}
export default App;
