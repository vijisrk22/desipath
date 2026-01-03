import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { postRentalHome } from "../../store/RentalHomesSlice";

import dayjs from "dayjs";
import { getRentalHomeContents } from "../../pages/RentalHome/DisplayRentalHomeDetail";
import { convertImagesToBase64 } from "../../utils/helper";

function ReviewRentalHomePost({ open, onClose, formDetails, images }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.rentalHomes);
  const { user } = useSelector((state) => state.user);
  const contents = getRentalHomeContents(formDetails, images);

  const handleSubmit = async () => {
    const formFields = {};
    let bhk = "";
    // Add regular form data (text, boolean, integer, etc.)
    for (const key in formDetails) {
      if (key === "bedrooms") {
        bhk = formDetails[key] + " Bed ";
      } else if (key === "bathrooms") {
        bhk += formDetails[key] + " Bath";
      } else {
        if (formDetails[key] === "Yes" || formDetails[key] === "No") {
          formFields[key] = formDetails[key] === "Yes" ? true : false;
        } else {
          if (key === "available_from") {
            formFields[key] = dayjs(formDetails.available_from).format(
              "YYYY-MM-DD"
            );
          } else {
            if (key === "location") {
              formFields["location_city"] = formDetails[key].split(",")[0];
              formFields["location_state"] = formDetails[key].split(",")[1];
              formFields["location_zipcode"] = formDetails[key].split(",")[2];
            } else {
              if (key === "accommodates") {
                formFields[key] = parseInt(formDetails[key], 10);
              } else {
                if (key === "deposit_rent" || key === "area") {
                  formFields[key] = parseFloat(formDetails[key]);
                } else {
                  if (key === "amenities") {
                    formFields[key] = Object.keys(formDetails.amenities).filter(
                      (key) => formDetails.amenities[key]
                    );
                  } else formFields[key] = formDetails[key];
                }
              }
            }
          }
        }
      }
    }

    //owner id
    formFields["owner_id"] = user.id;
    formFields["owner_name"] = user.name;

    //Add bhk field
    formFields["bhk"] = bhk;

    try {
      // Convert images to base64
      const base64Images = await convertImagesToBase64(images);

      // Add base64 images to the formFields object
      formFields["images"] = base64Images;

      console.log(formFields);
      // Dispatch the postRoom action with formFields as the payload
      const result = await dispatch(postRentalHome(formFields)).unwrap();

      // Handle success after post
      console.log("Post successful:", result);
      navigate("/services/rentalHomes/postConfirmation");
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
          <div className="justify-center text-[#007185] text-[22px] font-bold font-dmsans">
            Review Your Listing And Submit
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.deposit_rent
            ? parseFloat(formDetails.deposit_rent).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "$0.00"}
        </div>
        <div className=" text-gray-800 text-[26px] font-bold font-dmsans">
          {formDetails.property_type}
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

export default ReviewRentalHomePost;
