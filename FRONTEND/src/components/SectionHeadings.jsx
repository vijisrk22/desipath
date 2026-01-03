import { Link } from "react-router-dom";

function SectionHeadings({ heading, link }) {
  return (
    <div className="h-[52px] w-full flex justify-between items-center">
      <div className="text-[#007185]  text-[28px] md:text-[34px] lg:text-[40px] font-medium font-dmsans">
        {heading}
      </div>
      {link && (
        <Link to={link}>
          <button className="h-9 lg:px-3.5 lg:py-2 px-2 py-0.5 rounded-[30px] border border-gray-500 flex items-center hover:bg-gray-100 transition-colors">
            <span className="text-center text-gray-500 text-[12px] md:text-[15px] font-medium font-dmsans">
              View All
            </span>
          </button>
        </Link>
      )}
    </div>
  );
}

export default SectionHeadings;
