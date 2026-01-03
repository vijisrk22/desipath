import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: "1px solid  #B0BEC5", // Add the gray border here
  borderRadius: "4px",
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CourseContentAccordion() {
  const [expanded, setExpanded] = React.useState("panel1");

  const { courseDetails } = useSelector((state) => state.itTrainings);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      {courseDetails &&
        courseDetails?.content.map((content, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index + 1}`}
            onChange={handleChange(`panel${index + 1}`)}
            sx={{
              mb: 2,
              backgroundColor: "grey.100", // MUI theme color
              borderTopLeftRadius: "4px", // md = 0.375rem = 6px (but can adjust)
              borderTopRightRadius: "4px",
            }}
          >
            <AccordionSummary
              aria-controls={`panel${index + 1}d-content`}
              id={`panel${index + 1}d-header`}
            >
              <Typography
                component="span"
                sx={{
                  color: "#007185",
                  fontSize: "20px",
                  fontWeight: 500,
                  fontFamily: "Poppins",
                  lineHeight: "28px",
                }}
              >
                {content.topic}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                border: "1px solid grey.300",
                backgroundColor: "white",
              }}
            >
              {content.subtopics.map((subTopic, subIndex) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 2,
                    my: 2,
                  }}
                  key={subIndex}
                >
                  <Typography key={subIndex} component="span">
                    {subTopic.title}
                  </Typography>
                  {subTopic?.duration && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.8rem",
                        color: "gray",
                        fontStyle: "italic",
                      }}
                    >
                      ({subTopic.duration})
                    </Typography>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
