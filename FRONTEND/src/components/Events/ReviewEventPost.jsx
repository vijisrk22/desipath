import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { updateEvent, postEvent } from "../../store/EventsSlice";
import dayjs from "dayjs";

function ReviewEventPost({ open, onClose, formDetails }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.events);
  const isEdit = !!formDetails.id;

  const contents = [
    {
      text: "Mark as Sold",
      value: formDetails.isSold || "NO",
    },
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
      value: formDetails.location,
    },
    {
      text: "Organizer Name",
      value: formDetails.organizerName,
    },
    {
      text: "Organizer Contact",
      value: formDetails.organizerContact,
    },
    {
      text: "Country",
      value: formDetails.country,
    },
    {
      text: "Event Date and Time",
      value: dayjs(formDetails.fromDate).format("DD-MM-YYYY [at] h:mm A"),
    },
    {
      text: "Timezone",
      value: formDetails.timezone || 'PST',
    },
    {
      text: "Duration",
      value: formDetails.durationHours 
        ? (formDetails.durationHours.toString().toLowerCase().includes('hour') 
            ? formDetails.durationHours 
            : `${formDetails.durationHours} Hours`)
        : "Not specified",
    },
    {
      text: "Age Limit",
      value:
        formDetails.minAgeLimit === "0"
          ? "All Ages"
          : ["13", "18", "21"].includes(formDetails.minAgeLimit)
          ? `${formDetails.minAgeLimit}+`
          : formDetails.minAgeLimit,
    },
    {
      text: "Language Specific",
      value: (() => {
        const lang = formDetails.language;
        if (!lang) return "";
        const langArray = Array.isArray(lang) 
          ? lang 
          : (typeof lang === 'string' ? lang.split(',').map(s => s.trim()) : []);
        
        return langArray
          .filter(l => l && l.length > 1) // Filter out single characters or empty strings
          .map(l => l.charAt(0).toUpperCase() + l.slice(1))
          .join(", ");
      })(),
    },
    {
      text: "Event Category",
      value: Array.isArray(formDetails.eventCategory) 
        ? formDetails.eventCategory.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')).join(", ") 
        : "",
    },
    {
      text: "Event Type",
      value: formDetails.eventType,
    },
    {
      text: "Description",
      value: formDetails.description,
    },
    {
      text: "Terms and Conditions",
      value: formDetails.rulesRegulations,
    },
    {
      text: "Tags",
      value: Array.isArray(formDetails.tags) ? formDetails.tags.join(", ") : "",
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
      const coverImagesNew = (formDetails.coverImages || []).filter(img => img instanceof File);
      const coverImagesExisting = (formDetails.coverImages || []).filter(img => typeof img === 'string');
      
      const posterImagesNew = (formDetails.posterImages || []).filter(img => img instanceof File);
      const posterImagesExisting = (formDetails.posterImages || []).filter(img => typeof img === 'string');

      const coverImagesBase64 = await Promise.all(coverImagesNew.map(convertToBase64));
      const posterImagesBase64 = await Promise.all(posterImagesNew.map(convertToBase64));

      const newImages = [...coverImagesBase64, ...posterImagesBase64];
      const existingImages = [...coverImagesExisting, ...posterImagesExisting];

      const payload = {
        ticketPrice: formDetails.ticketPrice || "0",
        imgs: newImages,
        existing_imgs: existingImages,
        details: formattedDetails,
      };

      if (isEdit) {
        await dispatch(updateEvent({ eventId: formDetails.id, eventData: payload })).unwrap();
      } else {
        await dispatch(postEvent(payload)).unwrap();
      }
      
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
            {isEdit ? "Update Your Event" : "Review Event Details And Submit"}
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.ticketPrice && !isNaN(parseFloat(formDetails.ticketPrice))
            ? parseFloat(formDetails.ticketPrice).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : formDetails.ticketPrice || "$0.00"}
        </div>

        <ReviewPostContent contents={contents} />
        <div className="mx-auto mt-10 max-w-20">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#ffa41c] hover:bg-[#e8931a] rounded-xl text-gray-800 text-center text-base font-bold font-dmsans transition-all shadow-md"
          >
            {isEdit ? "Update" : "Post"}
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default ReviewEventPost;
