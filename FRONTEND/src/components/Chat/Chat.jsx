import { useSearchParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import ChatList from "./ChatList";
import ChatScreen from "./ChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchChatList } from "../../store/ChatSlice";

function Chat() {
  const { user } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const chatPartnerInfo = JSON.parse(
    decodeURIComponent(searchParams.get("chatPartnerInfo"))
  );
  const adId = searchParams.get("adId");
  const adType = searchParams.get("adType");

  useEffect(() => {
    const userId = chatPartnerInfo?.chatPartnerId;
    if (adType && adId && userId) {
      console.log(adType);
      dispatch(fetchChatList({ adType, adId, userId }));
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="px-[7%] lg:px-[108px] my-14">
        <div className="text-blue-700 text-4xl font-bold font-dmsans">
          Chatbox
        </div>
        <div className="grid md:grid-cols-[1fr_2fr] my-4 min-h-screen gap-11 max-w-screen-2xl mx-auto">
          <div className={chatPartnerInfo ? "hidden md:block" : ""}>
            <ChatList />
          </div>
          {chatPartnerInfo && (
            <div className={!chatPartnerInfo ? "hidden md:block" : "block"}>
              <ChatScreen
                loggedInUser={user.id}
                chatPartner={chatPartnerInfo.chatPartnerId}
                adId={adId}
                adType={adType}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Chat;
