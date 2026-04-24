import { Link } from "react-router-dom";

function SectionHeadings({ heading, link }) {
  return (
    <div className="h-[40px] w-full flex justify-between items-center">
      <div className="text-[#007185] text-[20px] md:text-[24px] lg:text-[28px] font-medium font-dmsans">
        {heading}
      </div>
      {link && (
        <Link to={link}>
          <button className="h-8 lg:px-3 lg:py-1.5 px-2 py-0.5 rounded-[30px] border border-gray-500 flex items-center hover:bg-gray-100 transition-colors">
            <span className="text-center text-gray-500 text-[10px] md:text-[12px] font-medium font-dmsans">
              View All
            </span>
          </button>
        </Link>
      )}
    </div>
  );
}

export default SectionHeadings;
