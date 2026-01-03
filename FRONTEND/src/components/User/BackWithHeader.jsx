import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";

function BackWithHeader({ text, path }) {
  const navigate = useNavigate();
  return (
    <div className=" w-full flex gap-4 items-center">
      <KeyboardBackspaceIcon
        onClick={() => navigate(path)}
        className="cursor-pointer"
      />
      <h1 className="font-bold text-xl font-dmsans text-gray-600">{text}</h1>
    </div>
  );
}

export default BackWithHeader;
