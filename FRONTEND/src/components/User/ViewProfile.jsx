import { Avatar, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { RiUserSettingsLine, RiShieldLine, RiTimeLine, RiMapPinLine, RiCameraLine } from "react-icons/ri";
import { useRef, useState } from "react";
import { updateUserProfile } from "../../store/UserSlice";
import { getFullImageUrl } from "../../utils/imageHelper";

function ViewProfile() {
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleEditProfile = () => {
    navigate("/profile/editProfile");
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    // Since our backend route is PATCH, we use the _method trick for multipart/form-data
    formData.append("_method", "PATCH");

    setUploading(true);
    try {
      // We dispatch the updateUserProfile thunk
      // We need to pass the FormData. 
      // Note: updateUserProfile in UserSlice uses api.patch, 
      // but Laravel needs POST with _method=PATCH for files.
      // I'll update the thunk to handle this or just call api directly here if needed.
      // Let's assume the thunk needs to be POST for files.
      
      const res = await dispatch(updateUserProfile(formData)).unwrap();
      console.log("Upload success:", res);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload profile photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#f8faff] min-h-screen flex flex-col font-dmsans">
      <div className="flex-grow w-full px-4 sm:px-[7%] py-6 sm:py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />

          {/* ── Profile Header Card ─────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mb-5">
            {/* Cover Gradient */}
            <div className="h-24 sm:h-40 bg-gradient-to-r from-[#0857d0] to-[#2c77f0] relative">
              <div className="absolute top-0 right-0 p-4">
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  Community Member
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-8 pb-6 sm:pb-10 -mt-10 sm:-mt-16">
              {/* Avatar + Name row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-6">
                <div className="relative shrink-0 group">
                  <div 
                    className="relative cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Avatar
                      alt={user?.name}
                      src={getFullImageUrl(user?.profile_photo || user?.photoUrl)}
                      sx={{
                        width:  { xs: 80, sm: 110, md: 130 },
                        height: { xs: 80, sm: 110, md: 130 },
                        border: "5px solid white",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                        bgcolor: "#f0f2f5"
                      }}
                    />
                    {/* Camera Overlay */}
                    <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      {uploading ? <CircularProgress size={24} color="inherit" /> : <RiCameraLine size={32} />}
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>

                <div className="flex-1 text-center sm:text-left pb-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-dmsans mb-2 truncate">
                    {user?.name || "Member Name"}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-gray-400 text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <RiMapPinLine className="text-[#0857d0] shrink-0" />
                      <span>{user?.location || "Location not set"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RiTimeLine className="text-[#ffa41c] shrink-0" />
                      <span>Member since 2024</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEditProfile}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0857d0] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 text-sm shrink-0"
                >
                  <RiUserSettingsLine size={18} />
                  Edit Profile
                </button>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-4 hover:bg-blue-50 transition-colors min-w-0">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">📧</div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Primary Email</p>
                    <p className="text-gray-900 font-bold text-sm truncate">{user?.email || "Not provided"}</p>
                  </div>
                </div>

                {/* Security */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center gap-4 hover:bg-amber-50 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">🛡️</div>
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Account Security</p>
                    <p className="text-gray-900 font-bold text-sm">Verified Account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Lower grid ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {/* Profile Details */}
            <div className="sm:col-span-2">
              <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-50">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <RiUserSettingsLine className="text-[#0857d0]" />
                  Profile Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-gray-400 font-medium text-sm">Display Name</span>
                    <span className="text-gray-900 font-bold text-sm truncate ml-4 max-w-[55%] text-right">{user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-gray-400 font-medium text-sm">Email Status</span>
                    <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                      <RiShieldLine /> Confirmed
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-gray-400 font-medium text-sm">Location</span>
                    <span className="text-gray-900 font-bold text-sm truncate ml-4 max-w-[55%] text-right">{user?.location || "Not set"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div>
              <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-50 text-center">
                <div className="w-14 h-14 bg-amber-50 text-[#ffa41c] text-3xl rounded-2xl flex items-center justify-center mx-auto mb-4">🏆</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Desi Pioneer</h4>
                <p className="text-xs text-gray-500 leading-relaxed">You were one of the first members to join the Path!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer newsletter={"block"} hideOnMobile />
    </div>
  );
}

export default ViewProfile;
