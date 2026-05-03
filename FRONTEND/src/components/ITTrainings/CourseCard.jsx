import { useNavigate } from "react-router-dom";
import ButtonRight from "../ButtonRight";
import StarRating from "../Rating/StarRating";
import { getFullImageUrl } from "../../utils/imageHelper";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import dayjs from "dayjs";

function CourseCard({ result }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/services/itTrainings/course/${result?.id}`);
  }

  return (
    <div
      key={result?.id}
      className="w-full max-w-[400px] h-full flex flex-col bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={result.thumbnail_url ? getFullImageUrl(result.thumbnail_url) : (result.image || 'https://via.placeholder.com/400x200?text=No+Image')}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
          }}
          title={result?.title || result?.course || "course"}
        />
        <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
          {result.category || 'Tech Training'}
        </div>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center gap-1.5">
            <LocalOfferOutlinedIcon sx={{ fontSize: 16, color: '#007185' }} />
            <div className="text-[#007185] text-lg font-black font-dmsans">
              {result.fee_amount ? `$${Number(result.fee_amount).toLocaleString()}` : '$249'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-6">
        <div className="text-[#1a1a1a] text-xl font-black font-dmsans line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {result?.title || result?.course}
        </div>
        
        {/* Training Coverage */}
        <div className="text-blue-600 text-xs font-bold font-dmsans mb-3 uppercase tracking-wider line-clamp-1">
          Covers: {result?.training_covers || 'Full Stack, Cloud, DevOps'}
        </div>

        <div className="text-gray-500 text-sm font-medium font-dmsans line-clamp-2 h-10 mb-6 leading-relaxed">
          {result?.short_description || result?.description}
        </div>

        {/* New Logistics Info */}
        <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <CalendarMonthIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Starts</span>
              <span className="text-xs font-bold text-gray-700">{result.start_date ? dayjs(result.start_date).format('MMM DD, YYYY') : 'Ongoing'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ScheduleIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Schedule</span>
              <span className="text-xs font-bold text-gray-700">{result.schedule_category || 'Weekend'}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarRating rating={result.rating || 4.8} />
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">
              ({result.numOfReviews || 24})
            </span>
          </div>
          <div className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Details <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
