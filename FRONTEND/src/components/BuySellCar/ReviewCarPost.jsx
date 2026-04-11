import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { postCar } from "../../store/CarsSlice";
import { getCarContents } from "../../pages/BuySellCar/DisplayCarDetail";
import { convertImagesToBase64 } from "../../utils/helper";

function ReviewCarPost({ open, onClose, formDetails, images, carAttributes }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.user);

  const contents = getCarContents(formDetails, images, carAttributes);

  const handleSubmit = async () => {
    const formFields = { ...formDetails };

    // Resolve "Others" make/model to free-text values
    if (formFields.make === "Others" && formFields.make_other) {
      formFields.make = formFields.make_other;
    }
    if (formFields.model === "Others" && formFields.model_other) {
      formFields.model = formFields.model_other;
    }
    delete formFields.make_other;
    delete formFields.model_other;

    formFields["seller_id"] = user.id;

    try {
      const base64Images = await convertImagesToBase64(images);
      formFields["pictures"] = base64Images;
      const result = await dispatch(postCar(formFields)).unwrap();
      console.log("Post successful:", result);
      navigate("/services/cars/postConfirmation");
    } catch (err) {
      console.error("Failed to post car:", err);
      onClose();
    }
  };

  if (loading) return <Loader />;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", bgcolor: "background.paper",
          borderRadius: 2, boxShadow: 24, p: 4,
          maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto",
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
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.price
            ? parseFloat(formDetails.price).toLocaleString("en-US", { style: "currency", currency: "USD" })
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

export default ReviewCarPost;
