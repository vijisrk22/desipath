import { useEffect } from "react";
import { fetchCourseDetails } from "../../store/ITTrainingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import DisplayPath from "../../components/DisplayPath";
import Navbar from "../../components/Navbar/Navbar";
import EnrolCard from "../../components/ITTrainings/CourseDetailsComponents/EnrolCard";
import TitledListSection from "../../components/ITTrainings/CourseDetailsComponents/TitledListSection";
import CourseContentAccordion from "../../components/ITTrainings/CourseDetailsComponents/CourseContentAccordian";

function CourseDetailsPage() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { loading, error, courseDetails } = useSelector(
    (state) => state.itTrainings
  );

  useEffect(() => {
    dispatch(fetchCourseDetails(courseId));
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  const paths = [
    { text: "Home", eP: "/" },
    { text: "IT Trainings", eP: "/services/itTrainings" },
    {
      text: `${courseDetails?.courseName || "Course Details"}`,
      eP: `/services/itTrainings/course/${courseId}`,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="px-[7%] min-h-screen">
        <DisplayPath
          paths={paths}
          color="gray-500"
          additionalStyles="leading-tight"
        />

        {courseDetails && (
          <div className="my-7">
            {/* Video and Enrol Card */}
            <div className="flex flex-wrap items-start gap-4 justify-between">
              {courseDetails && courseDetails.videoURL && (
                <video
                  controls
                  loop
                  muted
                  className="w-full xl:max-w-[900px] 2xl:max-w-[1024px] max-h-[400px]"
                >
                  <source
                    src={courseDetails?.videoURL || ""}
                    type="video/mp4"
                  />
                </video>
              )}
              <EnrolCard />
            </div>

            {/* Course Title */}
            <div className="my-5 text-cyan-700 text-xl font-semibold font-dmsans">
              {courseDetails?.courseName} - Online Course
            </div>

            {/* What Will You Learn */}
            <TitledListSection
              title="What Will You Learn?"
              list={courseDetails?.keyTakeaways}
            />

            {/*This course includes */}
            <TitledListSection
              title="This course includes:"
              list={courseDetails?.courseIncludes}
            />

            {/* Who this course is for */}
            <TitledListSection
              title="Who this course is for:"
              list={courseDetails?.courseFor}
            />

            {/* Course Content */}
            <div className="mb-7 text-gray-800 text-xl font-bold font-dmsans">
              Course Content
            </div>
            <CourseContentAccordion />

            {/* Course Description */}
            <div className="mt-14 text-gray-800 text-xl font-bold font-dmsans">
              Description:
            </div>
            <div className="text-gray-800 text-base font-medium font-dmsans mt-5">
              {courseDetails?.description}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CourseDetailsPage;
