import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonRight from "../ButtonRight";

function MyListingAccordian({
  getFunc,
  editFunc,
  deleteFunc,
  text,
  owner,
  postPath,
  EditPostModal,
}) {
  const [expanded, setExpanded] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [myItems, setMyItems] = useState([]);

  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);

  const handleChange = async (event, isExpanded) => {
    setExpanded(isExpanded); // `isExpanded` will be `true` if expanding, `false` if collapsing
    if (isExpanded) {
      const response = await dispatch(getFunc());
      const payload = response?.payload;

      if (Array.isArray(payload)) {
        setMyItems(payload.filter((item) => item[owner] === user.id));
      } else {
        setMyItems([]); // or handle error state if needed
        console.warn("Payload is not an array:", payload);
      }
    }
  };

  console.log(myItems);

  const handleEdit = (id) => {
    const selectedItem = myItems.find((item) => item.id === id);

    if (!selectedItem) {
      console.error(`Item with id ${id} not found`);
      return;
    }
    setFormDetails(selectedItem);
    setReviewSession(true);
  };

  const handleDelete = (id) => {
    // Logic to handle deleting the item
    dispatch(deleteFunc(id))
      .then(() => {
        // Optionally, you can refresh the items after deletion
        handleChange(null, true);
      })
      .catch((error) => {
        console.error("Failed to delete item:", error);
      });
  };

  return (
    <>
      {reviewSession && (
        <EditPostModal
          open={reviewSession}
          onClose={() => setReviewSession(false)}
          formDetails={formDetails}
          editFunc={editFunc}
        />
      )}
      <Accordion
        expanded={expanded}
        onChange={handleChange}
        sx={{
          padding: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="flex items-center gap-4">
            <ListAltIcon
              sx={{ height: 60, width: 60 }}
              className="p-2 border rounded-lg bg-blue-200 text-blue-800"
            />
            <Typography
              component="span"
              sx={{ fontSize: 20, color: "grey", mr: 2 }}
            >
              {text}
            </Typography>
          </div>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            minWidth: "500px",
          }}
        >
          {myItems.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Active Listings (0)
            </Typography>
          ) : (
            myItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div className="mr-4">
                  <Typography fontWeight="bold">
                    {item.location
                      ? `${item.location}`
                      : `${item.location_city}, ${item.location_state} ${item.location_zipcode}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Listed on:{" "}
                    {new Date(item.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(item.id)}
                  >
                    <EditIcon sx={{ mr: 1 }} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon sx={{ mr: 1 }} />
                  </Button>
                </div>
              </div>
            ))
          )}

          <div className="my-4 flex justify-center">
            <ButtonRight
              text="Post new Ad"
              path={postPath}
              arrowVisible={false}
              textClass="text-white font-semibold"
              paddingClass="w-full rounded-[12px] px-6 py-2 md:px-6 md:py-4 bg-[#0857d0]"
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default MyListingAccordian;
