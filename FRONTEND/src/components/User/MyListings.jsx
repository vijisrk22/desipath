import BackWithHeader from "./BackWithHeader";
import { fetchRooms, deleteRoom, updateRoom } from "../../store/RoommatesSlice";
import { fetchCars, deleteCar, updateCar } from "../../store/CarsSlice";
import { fetchTravelCompanions, fetchTravelers } from "../../store/TravelCompanionSlice";
import {
  fetchRentalHomes,
  deleteRentalHome,
  updateRentalHome,
} from "../../store/RentalHomesSlice";
import MyListingAccordian from "./MyListingAccordian";
import EditRoomPostModal from "../Roommates/EditRoomPostModal";
import EditCarPostModal from "../BuySellCar/EditCarPostModal";
import EditRentalHomePostModal from "../RentalHome/EditRentalHomePostModal";

function MyListings() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 max-w-screen-md mx-auto px-6 py-4">
      <BackWithHeader text={"My Listings"} path={"/profile"} />
      <div className="">
        <MyListingAccordian
          text="Find Roommates"
          getFunc={fetchRooms}
          editFunc={updateRoom}
          deleteFunc={deleteRoom}
          owner="poster_id"
          postPath="/services/roommates/postRoom"
          EditPostModal={EditRoomPostModal}
        />
      </div>

      <div>
        <MyListingAccordian
          text="Buy/Sell Cars"
          getFunc={fetchCars}
          editFunc={updateCar}
          deleteFunc={deleteCar}
          owner="seller_id"
          postPath="/services/cars/sellCar"
          EditPostModal={EditCarPostModal}
        />
      </div>
      <div>
        <MyListingAccordian
          text="Rental Homes"
          getFunc={fetchRentalHomes}
          editFunc={updateRentalHome}
          deleteFunc={deleteRentalHome}
          owner="owner_id"
          postPath="/services/rentalHomes/postRentalHome"
          EditPostModal={EditRentalHomePostModal}
        />
      </div>
      <div>
        <MyListingAccordian
          text="Find Travel Companion"
          getFunc={fetchTravelers}
          editFunc={updateRentalHome}
          deleteFunc={deleteRentalHome}
          owner="poster_id"
          postPath="/services/travelCompanion/findCompanion"
          EditPostModal={EditRentalHomePostModal}
        />
      </div>
      <div>
        <MyListingAccordian
          text="Be Travel Companion"
          getFunc={fetchTravelCompanions}
          editFunc={updateRentalHome}
          deleteFunc={deleteRentalHome}
          owner="poster_id"
          postPath="/services/travelCompanion/beCompanion"
          EditPostModal={EditRentalHomePostModal}
        />
      </div>
    </div>
  );
}

export default MyListings;
