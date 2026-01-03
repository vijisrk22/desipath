import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { postEvent } from "../../store/EventsSlice";
import dayjs from "dayjs";

function ReviewEventPost({ open, onClose, formDetails }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.events);
  console.log("Rendering ReviewEventPost");

  const contents = [
    {
      text: "Event Name",
      value: formDetails.eventName,
    },
    {
      text: "Address",
      value: formDetails.address,
    },
    {
      text: "State, City, Zipcode",
      value: formDetails.stateCityZipcode,
    },

    //**************** */
    {
      text: "Event Date and Time",
      value: dayjs(formDetails.fromDate).format("DD-MM-YYYY [at] h:mm A"),
    },

    {
      text: "Language Specific",
      value: formDetails.language,
    },
    {
      text: "Event Type",
      value: formDetails.eventType,
    },
    {
      text: "Description",
      value: formDetails.description,
    },
  ];

  const handleSubmit = async () => {
    const formattedDetails = {};

    contents.forEach((item) => {
      formattedDetails[item.text] = item.value;
    });

    // Helper function to convert File to base64
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      // Convert File objects to base64 strings
      const coverImagesBase64 = await Promise.all(
        (formDetails.coverImages || []).map(img =>
          img instanceof File ? convertToBase64(img) : img
        )
      );
      const posterImagesBase64 = await Promise.all(
        (formDetails.posterImages || []).map(img =>
          img instanceof File ? convertToBase64(img) : img
        )
      );

      const allImages = [...coverImagesBase64, ...posterImagesBase64];

      const payload = {
        ticketPrice: formDetails.ticketPrice || "0",
        imgs: allImages,
        details: formattedDetails,
      };

      const result = await dispatch(postEvent(payload)).unwrap();
      console.log("Post successful:", result);
      navigate("/services/events/postConfirmation");
    } catch (err) {
      console.error("Failed to post event:", err);
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
            Review Event Details And Submit
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.ticketPrice
            ? parseFloat(formDetails.ticketPrice).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
            : "$0.00"}
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

export default ReviewEventPost;
