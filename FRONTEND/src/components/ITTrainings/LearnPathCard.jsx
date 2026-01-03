import ButtonRight from "../ButtonRight";

function LearningPathCard({ learningPath }) {
  return (
    <div className="w-full sm:w-[280px] md:w-[300px] lg:w-[320px] h-[120px] bg-white rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.30)] grid grid-cols-[auto_1fr] gap-4 p-4">
      {/* Left: Image */}
      <div>
        <img
          src={learningPath.image}
          alt="Learning Path"
          className="w-24 h-24 rounded-[10px] object-cover"
        />
      </div>

      {/* Right: Text and Button aligned properly */}
      <div className="flex flex-col justify-between h-full">
        {/* Text reserved for max 2 lines */}
        <div className="text-center text-gray-800 text-lg md:text-xl font-bold font-dmsans leading-snug min-h-[3.5rem] flex items-center justify-center text-balance">
          {learningPath.path}
        </div>

        {/* Button aligned at the bottom */}
        <ButtonRight
          arrowVisible={false}
          text={`${learningPath.numCourse} Courses`}
          path=""
          paddingClass="px-[10px] py-2"
          textClass="text-xs md:text-sm font-medium"
        />
      </div>
    </div>
  );
}

export default LearningPathCard;
