import Footer from "../components/Footer/Footer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DisplayPath from "../components/DisplayPath";

function PostConfirmation({ 
  redirectTo = "/", 
  message = "Your Post is successfully uploaded!!",
  bgImg = "/img/roommates/roommates-bg.png",
  paths = []
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo);
    }, 5000); // 5 seconds is better to read
    return () => clearTimeout(timer);
  }, [navigate, redirectTo]);

  const defaultPaths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Confirmation", eP: "" },
  ];

  return (
    <div className="bg-[#fcfdfe] min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-[7%] py-6 w-full">
        <DisplayPath paths={paths.length > 0 ? paths : defaultPaths} color="[#667479]" />
      </div>

      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 text-center border border-gray-50">
          <div className="flex flex-col items-center gap-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircleIcon sx={{ fontSize: 60, color: '#10b981' }} />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-[#002f34] text-3xl font-bold font-dmsans tracking-tight">
                Successfully posted!
              </h2>
              <p className="text-gray-500 text-lg font-medium font-dmsans leading-relaxed px-4">
                Thanks for using Desipath. Your Event will be live once Approved by Admin.
              </p>
            </div>
            
            <div className="pt-8 border-t border-gray-100 w-full">
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#ffa41c] rounded-full animate-ping" />
                Redirecting Shortly
              </div>
              <button 
                onClick={() => navigate(redirectTo)}
                className="mt-6 text-[#007185] hover:text-[#005a6a] font-bold text-sm transition-colors cursor-pointer"
              >
                Click here if not redirected
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default PostConfirmation;
