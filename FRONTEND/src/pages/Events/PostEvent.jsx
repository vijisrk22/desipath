import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

function PostEvent() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Post an Event", eP: "/services/events/postEvent" },
  ];

  return (
    <div className="bg-[#f3f5f7]">
      <div className="mb-20  h-auto">
        <ServiceTopBar
          title="Post Event"
          paths={paths}
          form="event"
          plainBg={true}
        />
      </div>

      <Footer bgColor="bg-white" />
    </div>
  );
}

export default PostEvent;
