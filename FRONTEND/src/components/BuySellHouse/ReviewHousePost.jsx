import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { postHouse } from "../../store/HousesSlice";

function ReviewHousePost({ open, onClose, formDetails }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.houses);

  const contents = [
    {
      text: "You Are an",
      value: formDetails.role,
    },
    {
      text: "Type",
      value: formDetails.type,
    },
    {
      text: "Built Area",
      value: formDetails.builtArea,
    },
    {
      text: "Lot Size",
      value: formDetails.lotSize,
    },
    {
      text: "Hoa Fees If Any",
      value: formDetails.hoaFees,
    },
    {
      text: "Year Built",
      value: formDetails.yearBuilt,
    },
    {
      text: "Bedroom Total",
      value: formDetails.numBedrooms,
    },
    {
      text: "Half Bathroom Total",
      value: formDetails.halfBathrooms,
    },
    {
      text: "Basement Size",
      value: formDetails.basementSize,
    },
    {
      text: "Basement",
      value: formDetails.basement,
    },
    {
      text: "Laundry In House",
      value: formDetails.laundryInHouse,
    },
    {
      text: "Level",
      value: formDetails.numOfLevels,
    },
    {
      text: "Kitchen Granite Top",
      value: formDetails.kitchenGraniteTop,
    },
    {
      text: "Fireplace",
      value: formDetails.firePlace,
    },
    {
      text: "Flooring",
      value: Object.keys(formDetails.flooringOptions) // Get the keys
        .filter((option) => formDetails.flooringOptions[option] === true) // Keep only those with value true
        .join(" "), // Join the keys with a space
    },
    {
      text: "Additional Information",
      value: formDetails.description,
    },
    {
      text: "Photos",
      value: "",
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
      price: formDetails.price,
      imgs: formDetails.photos || [], // fallback to empty array if no images
      details: formattedDetails,
    };

    try {
      const result = await dispatch(postHouse(payload)).unwrap(); // .unwrap to get payload or throw error
      console.log("Post successful:", result);
      navigate("/services/houses/postConfirmation");
    } catch (err) {
      console.error("Failed to post house:", err);
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
            Review Your Listing And Submit
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.price
            ? parseFloat(formDetails.price).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "$0.00"}
        </div>
        <div className=" text-gray-800 text-[26px] font-bold font-dmsans">
          {formDetails.type}
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

export default ReviewHousePost;
