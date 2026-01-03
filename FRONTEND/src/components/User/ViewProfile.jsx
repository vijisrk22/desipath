import { Avatar, Divider, List, Paper } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useSelector } from "react-redux";
import ProfileList from "./ProfileList";
import { useNavigate } from "react-router-dom";
function ViewProfile() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    // Logic to handle profile editing
    navigate("/profile/editProfile");
  };

  const handleMyListings = () => {
    navigate("/profile/myListings");
  };

  return (
    <div>
      <Paper
        elevation={6}
        className="flex justify-center max-w-screen-md mx-auto  my-10 py-10"
      >
        <div className="flex-1 px-6">
          <div className="flex flex-col items-center justify-center my-3 ">
            <Avatar
              alt=""
              src=""
              sx={{
                width: { xs: 60, sm: 80, md: 100, lg: 120 },
                height: { xs: 60, sm: 80, md: 100, lg: 120 },
              }}
            />
            <p className="text-[#0857d0] text-md sm:text-lg md:text-xl lg:text-2xl font-semibold font-dmsans mt-4 ">
              {user?.name || "User Name"}
            </p>
            <p className="text-gray-400 text-md sm:text-lg md:text-xl lg:text-2xl font-normal font-dmsans ">
              {user?.email || ""}
            </p>
          </div>
          <Divider sx={{ width: "100%", borderBottomWidth: 4 }} />

          <List>
            <ProfileList
              labelText="Edit Profile"
              IconComponent={PermIdentityIcon}
              onClick={handleEditProfile}
            />
            <ProfileList
              labelText="My Listings"
              IconComponent={FolderOpenIcon}
              onClick={handleMyListings}
            />
          </List>
        </div>
      </Paper>
    </div>
  );
}

export default ViewProfile;
