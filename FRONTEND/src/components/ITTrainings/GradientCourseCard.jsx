import { useNavigate } from "react-router-dom";
import StarRating from "../Rating/StarRating";
import { generateRandomSuffix } from "../../utils/urlHelper";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import dayjs from "dayjs";

const gradients = [
  "bg-gradient-to-br from-blue-600 to-indigo-900",
  "bg-gradient-to-br from-emerald-500 to-teal-800",
  "bg-gradient-to-br from-violet-600 to-purple-900",
  "bg-gradient-to-br from-rose-500 to-red-800",
  "bg-gradient-to-br from-amber-500 to-orange-700",
];

function GradientCourseCard({ result, index = 0 }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/services/itTrainings/course/${result?.id}-${generateRandomSuffix(result?.id)}`);
  }

  const gradientClass = gradients[index % gradients.length];

  return (
    <div
      onClick={handleClick}
      className={`w-full max-w-[400px] h-full min-h-[260px] flex flex-col rounded-[2rem] shadow-md border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group ${gradientClass} text-white relative`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-8 -mb-8 pointer-events-none"></div>
      
      <div className="p-5 flex flex-col flex-grow z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest border border-white/20 line-clamp-1 max-w-[60%]">
            {result.category || 'Tech Training'}
          </div>
          <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg border border-gray-100 flex items-center gap-1 shrink-0">
            <LocalOfferOutlinedIcon sx={{ fontSize: 12, color: '#007185' }} />
            <span className="text-[#007185] text-xs font-black font-dmsans">
              {result.fee_amount ? `$${Number(result.fee_amount).toLocaleString()}` : '$249'}
            </span>
          </div>
        </div>

        <div className="text-white text-lg font-black font-dmsans line-clamp-2 mb-2 group-hover:text-blue-100 transition-colors leading-snug">
          {result?.title || result?.course}
        </div>
        
        <div className="text-white/80 text-[10px] font-bold font-dmsans mb-2 uppercase tracking-wider line-clamp-1">
          Covers: {result?.training_covers || 'Full Stack, Cloud, DevOps'}
        </div>

        <div className="text-white/90 text-xs font-medium font-dmsans line-clamp-2 mb-4 leading-relaxed">
          {result?.short_description || result?.description}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-white/20">
          <div className="flex items-center gap-1.5">
            <CalendarMonthIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
            <div className="flex flex-col">
              <span className="text-[9px] text-white/60 font-bold uppercase">Starts</span>
              <span className="text-xs font-bold text-white">{result.start_date ? dayjs(result.start_date).format('MMM DD, YYYY') : 'Ongoing'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ScheduleIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
            <div className="flex flex-col">
              <span className="text-[9px] text-white/60 font-bold uppercase">Schedule</span>
              <span className="text-xs font-bold text-white">{result.schedule_category || 'Weekend'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-full">
            <StarRating rating={result.rating || 4.8} />
            <span className="text-white/80 text-[9px] font-bold uppercase tracking-tighter">
              ({result.numOfReviews || 24})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradientCourseCard;
