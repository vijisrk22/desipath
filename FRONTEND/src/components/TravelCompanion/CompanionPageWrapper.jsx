// components/TravelCompanion/CompanionPageWrapper.jsx

import { Box, Tab, Tabs } from "@mui/material";
import DisplayPath from "../DisplayPath";
import Footer from "../Footer/Footer";
import { useState } from "react";

function CompanionPageWrapper({
  paths,
  heading,
  description,
  tabLabels,
  tabComponents,
}) {
  const [value, setValue] = useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="px-[7%] min-h-screen">
        <DisplayPath
          paths={paths}
          color="gray-500"
          additionalStyles="leading-tight"
        />

        <div className="my-4 text-gray-500 text-2xl font-medium font-dmsans leading-9">
          {description}
        </div>

        <div className="my-[39px] text-cyan-700 text-3xl font-medium font-dmsans">
          {heading}
        </div>

        <Box sx={{ width: "80%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Companion Tabs"
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
          >
            {tabLabels.map((label, idx) => (
              <Tab
                key={label}
                value={idx === 0 ? "one" : "two"}
                label={label}
                wrapped
                sx={{ fontSize: "24px", textTransform: "none" }}
              />
            ))}
          </Tabs>
        </Box>

        {value === "one" && tabComponents[0]}
        {value === "two" && tabComponents[1]}
      </div>
      <Footer bgColor="bg-white" />
    </>
  );
}

export default CompanionPageWrapper;
