import { useNavigate } from "react-router-dom";
import ButtonRight from "../ButtonRight";
import StarRating from "../Rating/StarRating";

function CourseCard({ result }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/services/itTrainings/course/${result?.id}`);
  }

  return (
    <li
      key={result?.id}
      className="flex flex-wrap border lg:border-0 justify-between px-2 rounded-lg shadow-sm hover:shadow-md transition gap-[10px]"
      onClick={handleClick}
    >
      <div className="flex flex-wrap items-start gap-[30px]">
        <img
          src={result.image}
          className="hidden lg:block w-64 h-40 object-cover rounded-lg"
        />
        <div className="m-3 lg:m-0 ">
          <div className="text-gray-800 text-sm md:text-xl font-bold font-dmsans">
            {result?.course}
          </div>
          <div className="w-80 text-gray-500 text-sm md:text-base font-medium font-dmsans">
            {result?.description}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="text-gray-800 text-base font-medium font-dmsans">
              {result.rating.toFixed(1)}
            </div>
            <div className="pb-1.5">
              <StarRating rating={result.rating} />
            </div>
            <div className="text-gray-500 text-base font-medium font-dmsans">
              {result.numOfReviews} Reviews
            </div>
          </div>
        </div>
      </div>
      <div className="m-2 lg:m-0 flex-1 lg:flex-none flex flex-row lg:flex-col justify-center items-center gap-[18px]">
        <ButtonRight
          text="Contact"
          path=""
          textClass="text-base"
          arrowVisible={false}
          paddingClass="px-7 py-3"
        />
        <div className="text-amber-500 text-base font-bold font-dmsans">
          $ 200.99
        </div>
      </div>
    </li>
  );
}

export default CourseCard;
