import DoneIcon from "@mui/icons-material/Done";
function TitledListSection({ title, list }) {
  return (
    <div className="mt-7 mb-14">
      <div className="text-gray-800 text-xl font-bold font-dmsans mb-4">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <DoneIcon className="text-cyan-700" />
            <div className="text-gray-800 text-base font-medium font-dmsans">
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TitledListSection;
