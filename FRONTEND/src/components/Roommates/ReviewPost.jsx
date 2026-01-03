import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { postRoom } from "../../store/RoommatesSlice";
import dayjs from "dayjs";
import { getRoomContents } from "../../pages/Roommates/DisplayRoomDetail";
import { convertImagesToBase64 } from "../../utils/helper";

function ReviewPost({ open, onClose, formDetails, images }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.roommates);
  const { user } = useSelector((state) => state.user);

  const contents = getRoomContents(formDetails, images);

  console.log(formDetails);

  const handleSubmit = async () => {
    const formFields = {};

    // Add regular form data (text, boolean, integer, etc.)
    for (const key in formDetails) {
      if (key === "location") {
        const splitLocation = formDetails[key].split(",");
        formFields["location_city"] = splitLocation[0];
        formFields["location_state"] = splitLocation[1];
        formFields["location_zipcode"] = splitLocation[2];
      } else {
        if (formDetails[key] === "Yes" || formDetails[key] === "No") {
          formFields[key] = formDetails[key] === "Yes" ? true : false;
        } else {
          if (key === "available_from") {
            formFields[key] = dayjs(formDetails.available_from).format(
              "DD-MM-YYYY"
            );
          } else if (key === "available_to") {
            formFields[key] = dayjs(formDetails.available_to).format(
              "DD-MM-YYYY"
            );
          } else {
            if (key === "rent") {
              formFields[key] = parseInt(
                formDetails[key].replace(/[^0-9]/g, "")
              );
            } else {
              formFields[key] = formDetails[key];
            }
          }
        }
      }
    }

    // Add rent frequency and poster id
    formFields["rent_frequency"] = "Monthly";
    formFields["poster_id"] = user.id;
    formFields["poster_name"] = user.name;

    try {
      // Convert images to base64
      const base64Images = await convertImagesToBase64(images);

      // Add base64 images to the formFields object
      formFields["photos"] = base64Images;

      console.log(formFields);
      // Dispatch the postRoom action with formFields as the payload
      const result = await dispatch(postRoom(formFields)).unwrap();

      // Handle success after post
      console.log("Post successful:", result);
      navigate("/services/roommates/postConfirmation");
    } catch (error) {
      console.error("Failed to post listing:", error);
      onClose();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxWidth: 600,
          width: "100%",
          maxHeight: "90vh", // Set a max height for the modal
          overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="justify-center text-[#007185] text-[22px] font-bold font-['DM_Sans']">
            Review Your Listing And Submit
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.rent
            ? formDetails.rent.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "$0.00"}
        </div>
        <div className=" text-gray-800 text-[26px] font-bold font-dmsans">
          Single Room
        </div>

        <ReviewPostContent contents={contents} />
        <div className="mx-auto mt-10 max-w-20">
          <button
            onClick={handleSubmit}
            className="px-5 py-3 bg-[#ffa41c] rounded-xl text-gray-800 text-center text-base font-medium font-dmsans"
          >
            Post
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default ReviewPost;
