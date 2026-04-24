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
import RentalHomeDetails from "./pages/RentalHome/RentalHomeDetails";
import BuySellCar from "./pages/BuySellCar/BuySellCar";
import CarDetails from "./pages/BuySellCar/CarDetails";
import TravelCompanion from "./pages/TravelCompanion/TravelCompanion";
import ITTrainings from "./pages/ITTrainings/ITTrainings";
import CourseDetailsPage from "./pages/ITTrainings/CourseDetailsPage";
import EventsLanding from "./pages/Events/EventsLanding";
import EventDetails from "./pages/Events/EventDetails";
import ViewProfile from "./components/User/ViewProfile";
import PrivateRoute from "./components/PrivateRoute";
import AstrologyAds from "./pages/AstrologyAds/AstrologyAds";
import ClassesForKids from "./pages/ClassesForKids/ClassesForKids";
import EditProfile from "./components/User/EditProfile";
import MyListings from "./components/User/MyListings";
import ProfileLayout from "./components/User/ProfileLayout";
import KidsClassLanding from "./pages/KidsClass/KidsClassLanding";
import KidsClassSubcategory from "./pages/KidsClass/KidsClassSubcategory";
import KidsClassDetails from "./pages/KidsClass/KidsClassDetails";
import InstructorPortal from "./pages/KidsClass/InstructorPortal/InstructorPortal";
import InstructorSuccess from "./pages/KidsClass/InstructorPortal/InstructorSuccess";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import KidsClassAdmin from "./pages/AdminDashboard/KidsClassAdmin";
import ListingAdmin from "./pages/AdminDashboard/ListingAdmin";
import PostAdPage from "./pages/PostAdPage";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import UsersAdmin from "./pages/AdminDashboard/UsersAdmin";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/postad" element={<PostAdPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/inbox"
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
              <ProfileLayout />
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
          <Route path="roommates/:action/:roomId" element={<Roommates />} />

          {/* Buy/Sell House */}
          <Route path="houses/:action?" element={<BuySellHouse />} />
          <Route path="houses/:action/:houseId" element={<BuySellHouse />} />

          {/* Rental Home */}
          <Route path="rentalhomes/:action?" element={<RentalHome />} />
          <Route path="rentalhomes/:action/:homeId" element={<RentalHome />} />

          {/* Buy/Sell Car */}
          <Route path="cars/:action?" element={<BuySellCar />} />
          <Route path="cars/:action/:carId" element={<BuySellCar />} />
          
          {/* Events */}
          <Route path="events/:action?" element={<EventsLanding />} />
          <Route path="events/:action/:eventId" element={<EventsLanding />} />

          <Route
            path="travelCompanion/:action?"
            element={<TravelCompanion />}
          />
          <Route path="itTrainings/:action?" element={<ITTrainings />} />
          <Route
            path="itTrainings/:action/:courseId"
            element={<CourseDetailsPage />}
          />
          <Route path="astrologyAds/:action?" element={<AstrologyAds />} />
          <Route path="classesForKids/:action?" element={<ClassesForKids />} />
        </Route>

        <Route path="/kids-class" element={<KidsClassLanding />} />
        
        {/* Unified Admin Dashboard */}
        <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route index element={<div className="p-10 font-bold text-gray-500 text-xl text-center">
            <div className="text-6xl mb-4">👑</div>
            Welcome to Desipath Master Control.<br/>Select a module from the left to manage the marketplace.
          </div>} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="kids-class" element={<KidsClassAdmin />} />
          <Route path="rental-homes" element={<ListingAdmin endpoint="/api/rentalhomes" title="Rental Homes" categoryIcon="🏘️" />} />
          <Route path="roommates" element={<ListingAdmin endpoint="/api/roommates" title="Roommates" categoryIcon="👥" />} />
          <Route path="cars" element={<ListingAdmin endpoint="/api/cars" title="Buy/Sell Cars" categoryIcon="🚗" />} />
          <Route path="houses" element={<ListingAdmin endpoint="/api/homes" title="Buy/Sell House" categoryIcon="🏡" customBasePath="houses" />} />
          <Route path="events" element={<ListingAdmin endpoint="/api/events" title="Events" categoryIcon="🎟️" />} />
          <Route path="travel" element={<ListingAdmin endpoint="/api/travelcompanions" title="Travel Companion" categoryIcon="✈️" customBasePath="travelCompanion" />} />
          <Route path="trainings" element={<ListingAdmin endpoint="/api/trainingads" title="IT Trainings" categoryIcon="💻" customBasePath="itTrainings" />} />
          <Route path="*" element={<div className="p-10 font-bold text-gray-500">Module coming soon...</div>} />
        </Route>

        <Route
          path="/kids-class/instructor-portal"
          element={
            <PrivateRoute>
              <InstructorPortal />
            </PrivateRoute>
          }
        />
        <Route
          path="/kids-class/instructor-portal/edit/:id"
          element={
            <PrivateRoute>
              <InstructorPortal />
            </PrivateRoute>
          }
        />
        <Route
          path="/kids-class/instructor-portal/success"
          element={
            <PrivateRoute>
              <InstructorSuccess />
            </PrivateRoute>
          }
        />
        <Route path="/kids-class/details/:id" element={<KidsClassDetails />} />
        <Route path="/kids-class/:categorySlug/:subcategorySlug" element={<KidsClassSubcategory />} />

      </Route>
    </Routes>
  );
}

export default App;
