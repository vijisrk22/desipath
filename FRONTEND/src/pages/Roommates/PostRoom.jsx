import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

function PostRoom() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Roommates", eP: "/services/roommates" },
    { text: "Post a Room", eP: "/services/roommates/postRoom" },
  ];

  return (
    <div className="bg-[#f3f5f7]">
      <div className="mb-20  h-auto">
        <ServiceTopBar title="Post Room" paths={paths} form="room" />
      </div>

      <Footer bgColor="bg-white" />
    </div>
  );
}

export default PostRoom;
