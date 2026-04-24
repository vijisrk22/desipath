import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { RiUserSettingsLine, RiShieldLine, RiTimeLine, RiMapPinLine } from "react-icons/ri";

function ViewProfile() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/profile/editProfile");
  };

  return (
    <div className="bg-[#f8faff] min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-[7%] py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
            {/* Cover Gradient */}
            <div className="h-32 sm:h-48 bg-gradient-to-r from-[#0857d0] to-[#2c77f0] relative">
               <div className="absolute top-0 right-0 p-8">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/20">
                    Community Member
                  </div>
               </div>
            </div>
            
            <div className="px-8 pb-10 -mt-12 sm:-mt-16 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
                <div className="relative">
                  <Avatar
                    alt={user?.name}
                    src={user?.photoUrl || ""}
                    sx={{
                      width: { xs: 100, sm: 120, md: 140 },
                      height: { xs: 100, sm: 120, md: 140 },
                      border: '6px solid white',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 pb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-dmsans mb-2">
                    {user?.name || "Member Name"}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-gray-400 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <RiMapPinLine className="text-[#0857d0]" />
                      <span>North America</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RiTimeLine className="text-[#ffa41c]" />
                      <span>Member since 2024</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleEditProfile}
                  className="px-8 py-3 bg-[#0857d0] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 mb-2 active:scale-95"
                >
                  <RiUserSettingsLine size={20} />
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-center gap-5 group hover:bg-blue-50 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm text-[#0857d0]">
                     📧
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Primary Email</p>
                    <p className="text-gray-900 font-bold">{user?.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 flex items-center gap-5 group hover:bg-amber-50 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm text-[#ffa41c]">
                     🛡️
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Account Security</p>
                    <p className="text-gray-900 font-bold">Verified Account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
               <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <RiUserSettingsLine className="text-[#0857d0]" />
                    Profile Details
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-50">
                      <span className="text-gray-400 font-medium">Display Name</span>
                      <span className="text-gray-900 font-bold">{user?.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-gray-50">
                      <span className="text-gray-400 font-medium">Email Status</span>
                      <span className="flex items-center gap-2 text-green-600 font-bold">
                        <RiShieldLine /> Confirmed
                      </span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 text-center">
                  <div className="w-16 h-16 bg-amber-50 text-[#ffa41c] text-3xl rounded-2xl flex items-center justify-center mx-auto mb-6">
                    🏆
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Desi Pioneer</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">You were one of the first members to join the Path!</p>
               </div>
            </div>
          </div>
        </div>
      </div>
      <Footer newsletter={"block"} />
    </div>
  );
}

export default ViewProfile;
