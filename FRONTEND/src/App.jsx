import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
const Roommates = lazy(() => import("./pages/Roommates/Roommates"));
const RoomDetails = lazy(() => import("./pages/Roommates/RoomDetails"));
const Chat = lazy(() => import("./components/Chat/Chat"));
const BuySellHouse = lazy(() => import("./pages/BuySellHouse/BuySellHouse"));
const HouseDetails = lazy(() => import("./pages/BuySellHouse/HouseDetails"));
const RentalHome = lazy(() => import("./pages/RentalHome/RentalHome"));
const RentalHomeDetails = lazy(() => import("./pages/RentalHome/RentalHomeDetails"));
const BuySellCar = lazy(() => import("./pages/BuySellCar/BuySellCar"));
const CarDetails = lazy(() => import("./pages/BuySellCar/CarDetails"));
const TravelCompanionLanding = lazy(() => import("./pages/TravelCompanion/TravelCompanionLanding"));
const TravelCompanionWizard = lazy(() => import("./pages/TravelCompanion/TravelCompanionWizard"));
const PostSuccess = lazy(() => import("./pages/TravelCompanion/PostSuccess"));
const ITTrainings = lazy(() => import("./pages/ITTrainings/ITTrainings"));
const CourseDetailsPage = lazy(() => import("./pages/ITTrainings/CourseDetailsPage"));
const EventsLanding = lazy(() => import("./pages/Events/EventsLanding"));
const EventDetails = lazy(() => import("./pages/Events/EventDetails"));
const ViewProfile = lazy(() => import("./components/User/ViewProfile"));
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
const AstrologyAds = lazy(() => import("./pages/AstrologyAds/AstrologyAds"));
const ClassesForKids = lazy(() => import("./pages/ClassesForKids/ClassesForKids"));
const EditProfile = lazy(() => import("./components/User/EditProfile"));
const MyListings = lazy(() => import("./components/User/MyListings"));
import ProfileLayout from "./components/User/ProfileLayout";
const ProfileSuccess = lazy(() => import("./components/User/ProfileSuccess"));
const KidsClassLanding = lazy(() => import("./pages/KidsClass/KidsClassLanding"));
const KidsClassSubcategory = lazy(() => import("./pages/KidsClass/KidsClassSubcategory"));
const KidsClassDetails = lazy(() => import("./pages/KidsClass/KidsClassDetails"));
const InstructorPortal = lazy(() => import("./pages/KidsClass/InstructorPortal/InstructorPortal"));
const InstructorSuccess = lazy(() => import("./pages/KidsClass/InstructorPortal/InstructorSuccess"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const KidsClassAdmin = lazy(() => import("./pages/AdminDashboard/KidsClassAdmin"));
const ListingAdmin = lazy(() => import("./pages/AdminDashboard/ListingAdmin"));
const PostAdPage = lazy(() => import("./pages/PostAdPage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const UsersAdmin = lazy(() => import("./pages/AdminDashboard/UsersAdmin"));
const AdminUsersAdmin = lazy(() => import("./pages/AdminDashboard/AdminUsersAdmin"));
const ZipcodesAdmin = lazy(() => import("./pages/AdminDashboard/ZipcodesAdmin"));
const LocalAdsAdmin = lazy(() => import("./pages/AdminDashboard/LocalAdsAdmin"));
const RealEstateAdmin = lazy(() => import("./pages/AdminDashboard/RealEstateAdmin"));
const Localdeals = lazy(() => import("./pages/Localdeals/Localdeals"));
const ItTrainingLanding = lazy(() => import("./pages/ItTraining/ItTrainingLanding"));
const ItTrainingSubcategory = lazy(() => import("./pages/ItTraining/ItTrainingSubcategory"));
const ItTrainingDetails = lazy(() => import("./pages/ItTraining/ItTrainingDetails"));
const ItInstructorPortal = lazy(() => import("./pages/ItTraining/InstructorPortal/InstructorPortal"));
const ItInstructorSuccess = lazy(() => import("./pages/ItTraining/InstructorPortal/InstructorSuccess"));
const MarketplaceCategories = lazy(() => import("./pages/AdminDashboard/MarketplaceCategories"));
const LocalAdPortal = lazy(() => import("./pages/Localdeals/Portal/LocalAdPortal"));
const LocalAdSuccess = lazy(() => import("./pages/Localdeals/Portal/LocalAdSuccess"));
const ItTrainingLeadsAdmin = lazy(() => import("./pages/AdminDashboard/ItTrainingLeadsAdmin"));
const PhotographyAdmin = lazy(() => import("./pages/AdminDashboard/PhotographyAdmin"));
const PhotographySearch = lazy(() => import("./pages/Photography/PhotographySearch"));
const PhotographerDetails = lazy(() => import("./pages/Photography/PhotographerDetails"));
const PhotographyPortal = lazy(() => import("./pages/Photography/PhotographyPortal"));
const PhotographySuccess = lazy(() => import("./pages/Photography/PhotographySuccess"));
const ForumAdmin = lazy(() => import("./pages/AdminDashboard/ForumAdmin"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile"));
const FindProperties = lazy(() => import("./pages/RealEstate/FindProperties"));
const PostProperty = lazy(() => import("./pages/RealEstate/PostProperty"));
const PropertyDetails = lazy(() => import("./pages/RealEstate/PropertyDetails"));

const DesiDoctorsSearch = lazy(() => import("./pages/DesiDoctors/DesiDoctorsSearch"));
const DoctorProfile = lazy(() => import("./pages/DesiDoctors/DoctorProfile"));
const DoctorAdPortal = lazy(() => import("./pages/DesiDoctors/DoctorAdPortal"));
const DoctorAdmin = lazy(() => import("./pages/AdminDashboard/DoctorAdmin"));

const DesiAttorneysSearch = lazy(() => import("./pages/DesiAttorneys/DesiAttorneysSearch"));
const AttorneyProfile = lazy(() => import("./pages/DesiAttorneys/AttorneyProfile"));
const AttorneyAdPortal = lazy(() => import("./pages/DesiAttorneys/AttorneyAdPortal"));
const AttorneyAdmin = lazy(() => import("./pages/AdminDashboard/AttorneyAdmin"));

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForumLanding = lazy(() => import("./pages/Forum/ForumLanding"));
const ForumPostDetail = lazy(() => import("./pages/Forum/ForumPostDetail"));

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Suspense fallback={<div className="min-h-screen bg-white flex flex-col items-center justify-center"><div className="w-16 h-16 border-4 border-[#0857d0] border-t-transparent rounded-full animate-spin"></div><div className="mt-4 font-bold text-gray-500">Loading...</div></div>}>
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
            

            <Route path="itTrainings/:action?" element={<ITTrainings />} />
            <Route
              path="itTrainings/:action/:courseId"
              element={<CourseDetailsPage />}
            />
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

          {/* Events */}
          <Route path="/events/:action?" element={<EventsLanding />} />
          <Route path="/events/:action/:eventId" element={<EventsLanding />} />
          {/* Astrology - Top Level */}
          <Route path="/astrologer/:action?" element={<AstrologyAds />} />
          <Route path="/astrologer/profile/:idOrSlug" element={<AstrologyAds actionType="profile" />} />


          {/* Travel Companion V2 Routes */}
          <Route path="/travel-companion" element={<TravelCompanionLanding />} />
          <Route path="/travel-companion/post-request" element={<PrivateRoute><TravelCompanionWizard type="seeker" /></PrivateRoute>} />
          <Route path="/travel-companion/post-volunteer" element={<PrivateRoute><TravelCompanionWizard type="volunteer" /></PrivateRoute>} />
          <Route path="/travel-companion/browse-volunteers" element={<TravelCompanionWizard type="browse-volunteers" />} />
          <Route path="/travel-companion/browse-requests" element={<TravelCompanionWizard type="browse-requests" />} />
          <Route path="/travel-companion/my-posts" element={<PrivateRoute><TravelCompanionWizard type="my-posts" /></PrivateRoute>} />
          <Route path="/travel-companion/post-success" element={<PrivateRoute><PostSuccess /></PrivateRoute>} />
          <Route path="/travel-companion/guidelines" element={<TravelCompanionWizard type="guidelines" />} />

          {/* Real Estate - India/Dubai */}
          <Route path="/real-estate/find" element={<FindProperties />} />
          <Route path="/real-estate/post" element={<PrivateRoute><PostProperty /></PrivateRoute>} />
          <Route path="/real-estate/details/:idOrSlug" element={<PropertyDetails />} />

          {/* Desi Doctors */}
          <Route path="/desi-doctors" element={<DesiDoctorsSearch />} />
          <Route path="/doctors/:slug" element={<DoctorProfile />} />
          <Route path="/desi-doctors/post" element={<PrivateRoute><DoctorAdPortal /></PrivateRoute>} />
          <Route path="/desi-doctors/edit/:id" element={<PrivateRoute><DoctorAdPortal /></PrivateRoute>} />

          {/* Desi Attorneys */}
          <Route path="/desi-attorneys" element={<DesiAttorneysSearch />} />
          <Route path="/attorneys/:slug" element={<AttorneyProfile />} />
          <Route path="/desi-attorneys/post" element={<PrivateRoute><AttorneyAdPortal /></PrivateRoute>} />
          <Route path="/desi-attorneys/edit/:id" element={<PrivateRoute><AttorneyAdPortal /></PrivateRoute>} />

          <Route path="/kids-class" element={<KidsClassLanding />} />
          <Route path="/instructor/:slug" element={<InstructorProfile type="kids" />} />
          <Route path="/it-instructor/:slug" element={<InstructorProfile type="it" />} />
          
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
              <ForumLanding />
            } 
          />
          <Route 
            path="/forum/post/:id" 
            element={
              <ForumPostDetail />
            } 
          />

          {/* Unified Admin Dashboard */}
          <Route path="/admindashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
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
            <Route path="trainings" element={<ListingAdmin endpoint="/api/it-training" title="IT Trainings" categoryIcon="💻" customBasePath="itTrainings" />} />
            <Route path="local-ads" element={<LocalAdsAdmin />} />
            <Route path="real-estate" element={<RealEstateAdmin />} />
            <Route path="doctors" element={<DoctorAdmin />} />
            <Route path="attorneys" element={<AttorneyAdmin />} />
            <Route path="photography" element={<ListingAdmin endpoint="/api/photography" title="Photography" categoryIcon="📸" />} />
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
      </Suspense>
    </>
  );
}

export default App;
