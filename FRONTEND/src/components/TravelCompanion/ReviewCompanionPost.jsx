import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { postTravelCompanion } from "../../store/TravelCompanionSlice";
import dayjs from "dayjs";

function ReviewCompanionPost({ open, onClose, formDetails }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.travelCompanion);

  const contents = [
    {
      text: "travellers",
      value: formDetails.traveler,
    },
    {
      text: "travellers_who",
      value: formDetails.travellers_who,
    },
    {
      text: "Traveler Age",
      value: formDetails.travelerAge,
    },
    {
      text: "language_spoken",
      value: Object.keys(formDetails.travelerLanguageOptions)
        .filter(
          (option) => formDetails.travelerLanguageOptions[option] === true
        )
        .join(" "),
    },
    {
      text: "flexible_language",
      value: formDetails.languageFlexibility,
    },
    {
      text: "travel_finalized",
      value: formDetails.travelDateConfirmed,
    },
    {
      text: "travel_date",
      value: formDetails.fromDate
        ? dayjs(formDetails.fromDate).format("DD-MM-YYYY")
        : null,
    },
    {
      text: "from_location",
      value: formDetails.departFrom,
    },

    {
      text: "to_location",
      value: formDetails.destinationTo,
    },

    {
      text: "gift_card_value",
      value: formDetails.giftCompanion,
    },
  ];

  const handleSubmit = async () => {
    const formattedDetails = {};

    contents.forEach((item) => {
      if (item.text !== "Photos") {
        formattedDetails[item.text] = item.value;
      }
    });

    const payload = {
      details: formattedDetails,
    };

    try {
      const result = await dispatch(postTravelCompanion(payload)).unwrap(); // .unwrap to get payload or throw error
      console.log("Posted traveler successfully:", result);
      navigate("/services/travelCompanion/postConfirmation");
    } catch (err) {
      console.error("Failed to post traveller", err);
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
          <div className="justify-center text-[#007185] text-[22px] font-bold font-dmsans">
            Review Your Post And Submit
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
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

export default ReviewCompanionPost;
