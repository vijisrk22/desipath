import Footer from "../components/Footer/Footer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PostConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/services/events");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

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
            <CheckCircleIcon color="green" fontSize="" />
          </div>
          <div className=" text-[#0857d0] text-[20px] font-semibold font-dmsans">
            Successfully posted your property
          </div>

          <div className="justify-center text-[#ffa41c] text-[14px] font-normal font-dmsans capitalize">
            Thanks for using Desipath. Your Post is successfully uploaded!!
          </div>
        </div>
      </div>
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default PostConfirmation;
