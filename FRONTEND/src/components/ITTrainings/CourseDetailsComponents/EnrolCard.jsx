import { useSelector } from "react-redux";
import ButtonRight from "../../ButtonRight";

import dayjs from "dayjs";

function EnrolCard() {
  const { courseDetails } = useSelector((state) => state.itTrainings);
  return (
    <div className="flex flex-row xl:flex-col justify-center">
      <div className="p-8 bg-slate-100 border rounded-tl-md rounded-tr-md flex flex-col gap-8">
        {courseDetails?.discountPercentage ? (
          <div className="">
            <span className="text-gray-800 text-2xl font-bold font-dmsans">
              $
              {(
                courseDetails?.price *
                (1 - courseDetails?.discountPercentage / 100)
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <sub className="align-sub opacity-50 text-gray-500 text-sm font-medium font-dmsans line-through">
              $
              {courseDetails?.price?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </sub>
          </div>
        ) : (
          <div>
            <span className="text-gray-800 text-2xl font-bold font-dmsans">
              $
              {(
                courseDetails?.price *
                (1 - courseDetails?.discountPercentage / 100)
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        <ButtonRight
          text="Enroll Now"
          path=""
          textClass="text-base"
          paddingClass="px-32 py-3"
          arrowVisible={false}
        />
      </div>
      <div className="px-14 py-6 rounded-bl-[5px] rounded-br-[5px] border border-neutral-300 flex flex-col gap-3">
        <div className="text-gray-700 text-base font-medium font-dmsans">
          {courseDetails?.level}
        </div>
        <div className="text-gray-700 text-base font-medium font-dmsans">
          {courseDetails?.duration} Duration
        </div>
        <div className="text-gray-700 text-base font-medium font-dmsans">
          {dayjs(courseDetails?.lastUpdated).format("MMMM D, YYYY")} Last
          Updated
        </div>
        {courseDetails?.certificateOnCompletion && (
          <div className="text-gray-700 text-base font-medium font-dmsans">
            Certificate of Completion
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrolCard;
