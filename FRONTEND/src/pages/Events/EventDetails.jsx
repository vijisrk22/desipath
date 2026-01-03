import DisplayPath from "../../components/DisplayPath";

import { useEffect } from "react";
import { fetchEventById } from "../../store/EventsSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ImageScroller from "../../components/ImageScroller";
import ButtonRight from "../../components/ButtonRight";
import Events from "../../components/Events";
import dayjs from "dayjs";

function EventDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Find Events", eP: "/services/events/findEvent" },
  ];

  const { eventId } = useParams();
  const imgs = [
    "/img/events/eventDetailsThumbnail.png",
    "/img/events/eventSmpl1.png",
    "/img/events/eventSmpl2.png",
    "/img/events/eventDetailsThumbnail.png",
    "/img/events/eventSmpl3.png",
  ];

  const dispatch = useDispatch();
  // const { loading, error, eventDetails } = useSelector((state) => state.events);

  const eventDetails = {
    eventId: 1,
    ticketPrice: "$39-499",
    imgs: ["img1.jpg", "img2.jpg"],
    details: {
      "Event Name": "Bollywood Dance Night",
      Address: "2699 Green Valley, Highland Lake, FL",
      "Event Type": "Dance",
      Duration: "3hrs",
      Language: "English",
      "Event Date": "2024-11-16",
      Time: "7:30 PM (EST)",
      Description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  };

  // Fetch room details when the component mounts
  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  // If loading, show loader
  // if (loading) {
  //   return <Loader />;
  // }

  // If there's an error fetching data
  // if (error) {
  //   return <div className="text-red-500">Error loading event details.</div>;
  // }

  // Make sure eventDetails is available before accessing it
  if (!eventDetails) {
    return (
      <div className="mx-20 my-10">
        <div className="text-gray-500">
          Event details are not available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-20 my-10">
      <div className="text-[#0857d0] text-3xl font-normal font-fredoka">
        Desipath
      </div>

      <DisplayPath
        paths={paths}
        color="[#667479]"
        additionalStyles={"leading-tight"}
      />
      <div className="my-4">
        <ImageScroller images={imgs} />
      </div>

      <div className="flex flex-wrap-reverse justify-between items-center mt-10 gap-2">
        <div>
          <div className=" text-blue-700 text-3xl lg:text-6xl font-bold font-dmsans">
            {eventDetails.details["Event Name"]}
          </div>
          <div className="text-gray-800 text-lg lg:text-2xl font-medium font-dmsans mt-2">
            {eventDetails.details["Event Type"]} |{" "}
            {eventDetails.details["Language"]} |{" "}
            {eventDetails.details["Duration"]}
          </div>
        </div>
        <div className="px-5 py-7 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center gap-5 mb-5">
          <div className="text-amber-600 text-lg lg:text-2xl font-medium font-dmsans">
            {eventDetails.ticketPrice}
          </div>
          <ButtonRight
            text={"Get Tickets"}
            path=""
            textClass="text-gray-800 text-base font-semibold"
            paddingClass="px-[90px] py-5"
            arrowVisible={false}
          />
        </div>
      </div>

      {/* Location */}
      <div className="my-7">
        <div className="justify-end text-blue-700 text:2xl lg:text-4xl font-bold font-dmsans">
          Location
        </div>
        <div className="justify-start items-center gap-[74px] flex mt-2">
          <div className="justify-start items-center gap-1 inline-flex">
            <img
              src="/location.svg"
              className="w-[20px] h-[20px] text-color-blue-500 "
            />
            <div className=" text-lg md:text-2xl font-medium font-dmsans capitalize">
              {eventDetails.details["Address"]}
            </div>
          </div>
        </div>
      </div>

      {/* Event Date */}
      <div className="my-7">
        <div className="justify-end text-blue-700 text-2xl lg:text-4xl font-bold font-dmsans">
          Date and Time
        </div>
        <div className="justify-start items-center gap-[74px] flex">
          <div className="justify-start items-center gap-1 inline-flex">
            <img src="/calendar.svg" className="w-[20px] h-[20px]" />
            <div className=" text-lg md:text-2xl font-medium font-dmsans capitalize">
              {dayjs(eventDetails.details["Event Date"]).format(
                "ddd, MMM D YYYY"
              )}{" "}
              at {eventDetails.details["Time"]}
            </div>
          </div>
        </div>
      </div>

      {/* Description*/}
      <div className="text-blue-700 text-2xl lg:text-4xl font-bold font-dmsans mb-2">
        Description
      </div>
      <div className=" text-gray-800 text-2xl font-medium font-dmsans mb-5">
        {eventDetails.details["Description"]}
      </div>

      {/* Events Other */}
      <Events title="Other events you may like" />
    </div>
  );
}

export default EventDetails;
