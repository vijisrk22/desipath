import { useNavigate } from "react-router-dom";
import ButtonRight from "../ButtonRight";
import StarRating from "../Rating/StarRating";

function CourseCard({ result }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/services/itTrainings/course/${result?.id}`);
  }

  return (
    <div
      key={result?.id}
      className="w-full max-w-[400px] h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:translate-y-[-4px] hover:shadow-xl cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={result.image}
          className="w-full h-[200px] object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <div className="text-amber-500 text-sm font-bold font-dmsans">
            $249.99
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-5">
        <div className="text-[#007185] text-xl font-bold font-dmsans line-clamp-1 mb-2">
          {result?.course}
        </div>
        
        <div className="text-gray-500 text-sm font-medium font-dmsans line-clamp-2 h-10 mb-4">
          {result?.description}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-gray-800 text-sm font-bold font-dmsans">
              {result.rating.toFixed(1)}
            </div>
            <StarRating rating={result.rating} />
          </div>
          <div className="text-gray-400 text-xs font-semibold">
            {result.numOfReviews} Reviews
          </div>
        </div>
    </div>
  );
}

export default CourseCard;
