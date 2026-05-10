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
import TravelCompanionLanding from "./pages/TravelCompanion/TravelCompanionLanding";
import TravelCompanionWizard from "./pages/TravelCompanion/TravelCompanionWizard";
import PostSuccess from "./pages/TravelCompanion/PostSuccess";
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
import ProfileSuccess from "./components/User/ProfileSuccess";
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
import AdminUsersAdmin from "./pages/AdminDashboard/AdminUsersAdmin";
import ZipcodesAdmin from "./pages/AdminDashboard/ZipcodesAdmin";
import LocalAdsAdmin from "./pages/AdminDashboard/LocalAdsAdmin";
import Localdeals from "./pages/Localdeals/Localdeals";
import ItTrainingLanding from "./pages/ItTraining/ItTrainingLanding";
import ItTrainingSubcategory from "./pages/ItTraining/ItTrainingSubcategory";
import ItTrainingDetails from "./pages/ItTraining/ItTrainingDetails";
import ItInstructorPortal from "./pages/ItTraining/InstructorPortal/InstructorPortal";
import ItInstructorSuccess from "./pages/ItTraining/InstructorPortal/InstructorSuccess";
import MarketplaceCategories from "./pages/AdminDashboard/MarketplaceCategories";
import LocalAdPortal from "./pages/Localdeals/Portal/LocalAdPortal";
import LocalAdSuccess from "./pages/Localdeals/Portal/LocalAdSuccess";
import ItTrainingLeadsAdmin from "./pages/AdminDashboard/ItTrainingLeadsAdmin";
import PhotographyAdmin from "./pages/AdminDashboard/PhotographyAdmin";
import PhotographySearch from "./pages/Photography/PhotographySearch";
import PhotographerDetails from "./pages/Photography/PhotographerDetails";
import PhotographyPortal from "./pages/Photography/PhotographyPortal";
import PhotographySuccess from "./pages/Photography/PhotographySuccess";
import ForumAdmin from "./pages/AdminDashboard/ForumAdmin";
import { lazy, Suspense } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForumLanding = lazy(() => import("./pages/Forum/ForumLanding"));
const ForumPostDetail = lazy(() => import("./pages/Forum/ForumPostDetail"));

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
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
            <Route path="success" element={<ProfileSuccess />} />
          </Route>

          <Route path="/services">
            {/* Roommates */}
            <Route path="roommates/:action?" element={<Roommates />} />
            <Route path="roommates/:action/:roomId" element={<Roommates />} />

            {/* Buy/Sell House */}
            <Route path="BuyHome/:action?" element={<BuySellHouse />} />
            <Route path="BuyHome/:action/:houseId" element={<BuySellHouse />} />

            {/* Rental Home */}
            <Route path="rentalhomes/:action?" element={<RentalHome />} />
            <Route path="rentalhomes/:action/:homeId" element={<RentalHome />} />

            {/* Buy/Sell Car */}
            <Route path="cars/:action?" element={<BuySellCar />} />
            <Route path="cars/:action/:carId" element={<BuySellCar />} />
            
            {/* Events */}
            <Route path="events/:action?" element={<EventsLanding />} />
            <Route path="events/:action/:eventId" element={<EventsLanding />} />

            <Route path="itTrainings/:action?" element={<ITTrainings />} />
            <Route
              path="itTrainings/:action/:courseId"
              element={<CourseDetailsPage />}
            />
            <Route path="astrologyAds/:action?" element={<AstrologyAds />} />
            <Route path="classesForKids/:action?" element={<ClassesForKids />} />
            <Route path="Localdeals" element={<Localdeals />} />
            <Route path="Localdeals/post" element={<PrivateRoute><LocalAdPortal /></PrivateRoute>} />
            <Route path="Localdeals/edit/:id" element={<PrivateRoute><LocalAdPortal /></PrivateRoute>} />
            <Route path="Localdeals/post/success" element={<PrivateRoute><LocalAdSuccess /></PrivateRoute>} />
            
            {/* Photography */}
            <Route path="photography" element={<PhotographySearch />} />
            <Route path="photography/details/:id" element={<PhotographerDetails />} />
            <Route path="photography/post" element={<PrivateRoute><PhotographyPortal /></PrivateRoute>} />
            <Route path="photography/edit/:id" element={<PrivateRoute><PhotographyPortal /></PrivateRoute>} />
            <Route path="photography/success" element={<PrivateRoute><PhotographySuccess /></PrivateRoute>} />
          </Route>


          {/* Travel Companion V2 Routes */}
          <Route path="/travel-companion" element={<TravelCompanionLanding />} />
          <Route path="/travel-companion/post-request" element={<PrivateRoute><TravelCompanionWizard type="seeker" /></PrivateRoute>} />
          <Route path="/travel-companion/post-volunteer" element={<PrivateRoute><TravelCompanionWizard type="volunteer" /></PrivateRoute>} />
          <Route path="/travel-companion/browse-volunteers" element={<TravelCompanionWizard type="browse-volunteers" />} />
          <Route path="/travel-companion/browse-requests" element={<TravelCompanionWizard type="browse-requests" />} />
          <Route path="/travel-companion/my-posts" element={<PrivateRoute><TravelCompanionWizard type="my-posts" /></PrivateRoute>} />
          <Route path="/travel-companion/post-success" element={<PrivateRoute><PostSuccess /></PrivateRoute>} />
          <Route path="/travel-companion/guidelines" element={<TravelCompanionWizard type="guidelines" />} />

          <Route path="/kids-class" element={<KidsClassLanding />} />
          
          {/* IT Training Routes */}
          <Route path="/it-training" element={<ItTrainingLanding />} />
          <Route
            path="/it-training/instructor-portal"
            element={
              <PrivateRoute>
                <ItInstructorPortal />
              </PrivateRoute>
            }
          />
          <Route
            path="/it-training/instructor-portal/edit/:id"
            element={
              <PrivateRoute>
                <ItInstructorPortal />
              </PrivateRoute>
            }
          />
          <Route
            path="/it-training/instructor-portal/success"
            element={
              <PrivateRoute>
                <ItInstructorSuccess />
              </PrivateRoute>
            }
          />
          <Route path="/it-training/details/:id" element={<ItTrainingDetails />} />
          <Route path="/it-training/:categorySlug/:subcategorySlug" element={<ItTrainingSubcategory />} />

          <Route 
            path="/forum" 
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#dae0e6] flex items-center justify-center font-bold text-gray-400">Loading Community...</div>}>
                <ForumLanding />
              </Suspense>
            } 
          />
          <Route 
            path="/forum/post/:id" 
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#dae0e6] flex items-center justify-center font-bold text-gray-400">Loading Discussion...</div>}>
                <ForumPostDetail />
              </Suspense>
            } 
          />

          {/* Unified Admin Dashboard */}
          <Route path="/admindashboard" element={<AdminDashboard />}>
            <Route index element={<div className="p-10 font-bold text-gray-500 text-xl text-center">
              <div className="text-6xl mb-4">👑</div>
              Welcome to Desipath Master Control.<br/>Select a module from the left to manage the marketplace.
            </div>} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="admins" element={<AdminUsersAdmin />} />
            <Route path="kids-class" element={<KidsClassAdmin />} />
            <Route path="categories" element={<MarketplaceCategories />} />
            <Route path="rental-homes" element={<ListingAdmin endpoint="/api/rentalhomes" title="Rental Homes" categoryIcon="🏘️" />} />
            <Route path="roommates" element={<ListingAdmin endpoint="/api/roommates" title="Roommates" categoryIcon="👥" />} />
            <Route path="cars" element={<ListingAdmin endpoint="/api/cars" title="Buy/Sell Cars" categoryIcon="🚗" />} />
            <Route path="houses" element={<ListingAdmin endpoint="/api/homes" title="Buy/Sell House" categoryIcon="🏡" customBasePath="BuyHome" />} />
            <Route path="events" element={<ListingAdmin endpoint="/api/events" title="Events" categoryIcon="🎟️" />} />
            <Route path="travel" element={<ListingAdmin endpoint="/api/travelcompanions" title="Travel Companion" categoryIcon="✈️" customBasePath="travelCompanion" />} />
            <Route path="trainings" element={<ListingAdmin endpoint="/api/trainingads" title="IT Trainings" categoryIcon="💻" customBasePath="itTrainings" />} />
            <Route path="local-ads" element={<LocalAdsAdmin />} />
            <Route path="photography" element={<PhotographyAdmin />} />
            <Route path="zipcodes" element={<ZipcodesAdmin />} />
            <Route path="it-training-leads" element={<ItTrainingLeadsAdmin />} />
            <Route path="forum" element={<ForumAdmin />} />
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
    </>
  );
}

export default App;
