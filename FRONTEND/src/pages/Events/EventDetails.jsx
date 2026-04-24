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
  const dispatch = useDispatch();
  const { loading, error, eventDetails } = useSelector((state) => state.events);

  // Fetch event details when the component mounts
  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  // If there's an error fetching data
  if (error) {
    return (
      <div className="mx-20 my-10 text-red-500 font-dmsans">
        Error loading event details: {typeof error === 'string' ? error : 'Event not found'}
      </div>
    );
  }

  // Make sure eventDetails is available before accessing it
  if (!eventDetails) {
    return (
      <div className="mx-20 my-10">
        <div className="text-gray-500 font-dmsans">
          Event details are not available at the moment.
        </div>
      </div>
    );
  }

  // Helper to get full image paths
  const displayImages = (eventDetails.cover_images && Array.isArray(eventDetails.cover_images) && eventDetails.cover_images.length > 0)
    ? eventDetails.cover_images.map(img => `https://desipathapi.azurewebsites.net/${img}`)
    : ["/img/events/eventDetailsThumbnail.png"];

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
        <ImageScroller images={displayImages} />
      </div>

      <div className="flex flex-wrap-reverse justify-between items-center mt-10 gap-2">
        <div>
          <div className=" text-blue-700 text-3xl lg:text-6xl font-bold font-dmsans">
            {eventDetails.event_name}
          </div>
          <div className="text-gray-800 text-lg lg:text-2xl font-medium font-dmsans mt-2">
            {eventDetails.event_type} | {eventDetails.language}
          </div>
        </div>
        <div className="px-5 py-7 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center gap-5 mb-5">
          <div className="text-amber-600 text-lg lg:text-2xl font-medium font-dmsans">
            {eventDetails.ticket_price ? `$${Number(eventDetails.ticket_price).toLocaleString("en-US", { minimumFractionDigits: 0 })}` : "Free"}
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
              {eventDetails.address} {eventDetails.state_city_zipcode}
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
              {dayjs(eventDetails.from_date).format("ddd, MMM D YYYY [at] h:mm A")}
            </div>
          </div>
        </div>
      </div>

      {/* Description*/}
      <div className="text-blue-700 text-2xl lg:text-4xl font-bold font-dmsans mb-2">
        Description
      </div>
      <div className=" text-gray-800 text-2xl font-medium font-dmsans mb-5">
        {eventDetails.description}
      </div>

      {/* Events Other */}
      <Events title="Other events you may like" />
    </div>
  );
}

export default EventDetails;
