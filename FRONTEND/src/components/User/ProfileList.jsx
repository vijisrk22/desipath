import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";

function ProfileList({ labelText, IconComponent, onClick }) {
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="" onClick={onClick}>
          <NavigateNextOutlinedIcon
            sx={{
              width: { xs: 20, sm: 30, md: 40, lg: 50 },
              height: { xs: 20, sm: 30, md: 40, lg: 50 },
            }}
          />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <IconComponent
          sx={{
            width: { xs: 20, sm: 30, md: 40, lg: 50 },
            height: { xs: 20, sm: 30, md: 40, lg: 50 },
            color: "#0857d0",
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={labelText}
        className="text-gray-600 mx-3"
        primaryTypographyProps={{
          fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // responsive sizes
          fontWeight: "500",
          color: "#333",
        }}
      />
    </ListItem>
  );
}
export default ProfileList;
