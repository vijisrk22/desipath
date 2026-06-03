import { useSearchParams, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import ChatList from "./ChatList";
import ChatScreen from "./ChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchChatList } from "../../store/ChatSlice";
import { Paper, Typography } from "@mui/material";

function Chat() {
  const { user } = useSelector((state) => state.user);
  const { userMessages } = useSelector((state) => state.chat);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chatPartnerInfo = useMemo(() => {
    const raw = searchParams.get("chatPartnerInfo");
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch (err) {
      console.error("Error parsing chatPartnerInfo:", err);
      return null;
    }
  }, [searchParams]);

  const adId = searchParams.get("adId");
  const adType = searchParams.get("adType");

  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  useEffect(() => {
    // Only auto-select the first chat on desktop screen widths (1024px and above)
    if (window.innerWidth < 1024) return;

    if (!chatPartnerInfo && userMessages?.length > 0 && user) {
      const validChats = userMessages.filter(
        (chat) => chat?.chatPartner && Number(chat.chatPartner.id) !== Number(user?.id)
      );
      if (validChats.length > 0) {
        const firstChat = validChats[0];
        const info = {
          chatPartnerId: firstChat.chatPartner.id,
          chatPartnerName: firstChat.chatPartner.name,
        };
        navigate(
          `/inbox?adType=${firstChat.ad_type}&adId=${firstChat.ad_id}&chatPartnerInfo=${encodeURIComponent(
            JSON.stringify(info)
          )}`,
          { replace: true }
        );
      }
    }
  }, [chatPartnerInfo, userMessages, user, navigate]);

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-dmsans">
            Inbox
          </h1>
          <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            {userMessages?.length || 0} Conversations
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-220px)]">
          <div className={`${chatPartnerInfo ? "hidden lg:block" : "block"} h-full`}>
            <ChatList />
          </div>
          
          <div className={`${!chatPartnerInfo ? "hidden lg:block" : "block"} h-full`}>
            {chatPartnerInfo ? (
              <ChatScreen
                loggedInUser={user?.id}
                chatPartner={chatPartnerInfo.chatPartnerId}
                adId={adId}
                adType={adType}
              />
            ) : (
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  p: 4,
                  textAlign: "center"
                }}
              >
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
                  Select a message
                </Typography>
                <Typography sx={{ color: "#6b7280", maxWidth: "300px" }}>
                  Choose a conversation from the list to start chatting with other users.
                </Typography>
              </Paper>
            )}
          </div>
        </div>
      </div>
      <Footer hideOnMobile />
    </div>
  );
}

export default Chat;
