import Footer from "../components/Footer/Footer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PostConfirmation({ redirectTo = "/", message = "Your Post is successfully uploaded!!" }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, redirectTo]);

  return (
    <div className="bg-[#f3f5f7]">
      <div className="relative w-full h-[250px]">
        <img
          src="/img/roommates/roommates-bg.png"
          alt="background"
          className="object-cover w-full h-full "
        />
      </div>

      <div className="max-w-md mx-auto bg-white py-8 px-8 my-20">
        <div className="flex flex-col justify-center gap-5 ">
          <div className="text-6xl">
            <CheckCircleIcon color="success" fontSize="inherit" />
          </div>
          <div className=" text-[#0857d0] text-[20px] font-semibold font-dmsans">
            Successfully posted!
          </div>
          <div className="justify-center text-[#ffa41c] text-[14px] font-normal font-dmsans capitalize">
            {message}
          </div>
          <div className="text-gray-400 text-[13px] font-dmsans">
            Redirecting in 3 seconds...
          </div>
        </div>
      </div>
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default PostConfirmation;
