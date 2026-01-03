import { Link } from "react-router-dom";

function DisplayPath({ paths, color = "white", additionalStyles = "" }) {
  // console.log(paths);
  return (
    <div
      className={`inline-flex justify-start items-center gap-1 text-${color} mt-8`}
    >
      {paths.map((path, index) => (
        <Link
          key={index}
          to={path.eP}
          className={`pr-2 text-sm flex items-start gap-2 font-medium font-dmsans truncate ${additionalStyles}`}
        >
          {path.text}
          <span className="w-[3px] h-1.5 ">{" > "}</span>
        </Link>
      ))}
    </div>
  );
}

export default DisplayPath;
