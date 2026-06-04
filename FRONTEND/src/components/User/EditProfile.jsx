import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../store/UserSlice";
import ButtonRight from "../ButtonRight";
import PhoneNumberInput from "../InputTemplate/PhoneNumberInput";
import BackWithHeader from "./BackWithHeader";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import { getFullImageUrl } from "../../utils/imageHelper";
function EditProfile() {
  const [formDetails, setFormDetails] = useState(null);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: typeof user?.name === 'string' ? user.name.split(" ")[0] : (typeof user?.name === 'object' ? (user.name?.name || "") : ""),
      last_name: typeof user?.name === 'string' ? user.name.split(" ")[1] : "",
      email: user?.email || "",
      location: user?.location || "",
      phone_number: user?.phone_number || "",
      country_code: user?.country_code || "US",
    }
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      reset({
        first_name: typeof user.name === 'string' ? user.name.split(" ")[0] : (typeof user.name === 'object' ? (user.name?.name || "") : ""),
        last_name: typeof user.name === 'string' ? user.name.split(" ")[1] : "",
        email: user.email || "",
        location: user.location || "",
        phone_number: user.phone_number || "",
        country_code: user.country_code || "US",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    // If password is not set or empty, remove it from data
    if (!data.password || data.password.trim() === "") {
      delete data.password;
    }

    try {
      const resultAction = await dispatch(updateUserProfile(data));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        navigate("/profile/success");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  console.log("User in EditProfile:", user);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("_method", "PATCH");

    setUploading(true);
    try {
      const res = await dispatch(updateUserProfile(formData)).unwrap();
      console.log("Upload success:", res);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload profile photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-5 max-w-screen-md mx-auto px-6 py-4">
      <BackWithHeader text={"Edit Profile"} path={"/profile"} />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <div className="flex flex-col items-center mb-4">
        <div 
          className="relative cursor-pointer group"
          onClick={handleAvatarClick}
        >
          <img
            alt={user?.name}
            src={getFullImageUrl(user?.profile_photo || user?.photoUrl)}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-200 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://ui-avatars.com/api/?name=" + (user?.name || 'V') + "&background=random";
            }}
          />
          <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            {uploading ? <span className="animate-spin text-xl">⏳</span> : <span className="text-xl">📷</span>}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Click to change avatar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextFieldInput
          name="first_name"
          defaultValue={user?.name && typeof user.name === 'string' ? user.name.split(" ")[0] : (typeof user?.name === 'object' ? (user.name?.name || "") : "")}
          control={control}
          text="First Name"
          requiredAssertion={false}
        />
        <TextFieldInput
          name="last_name"
          defaultValue={user?.name && typeof user.name === 'string' ? user.name.split(" ")[1] : ""}
          control={control}
          text="Last Name"
          requiredAssertion={false}
        />

        <PhoneNumberInput
          control={control}
          defaultCode={user?.country_code ? user?.country_code : ""}
          defaultNumber={user?.phone_number ? user?.phone_number : ""}
        />

        <TextFieldInput
          name="email"
          defaultValue={user?.email ? user?.email : ""}
          control={control}
          text="Email"
          requiredAssertion={false}
        />

        <TextFieldInput
          name="password"
          defaultValue=""
          control={control}
          text="Password"
          type="password"
          requiredAssertion={false}
          customProps={{ placeholder: "******", autoComplete: "new-password" }}
        />
        <LocationAutocompleteInput
          control={control}
          setValue={setValue}
          defaultLocation={user?.location || ""}
          text="Current Location"
        />
        <div className="my-4 flex items-center justify-center">
          <ButtonRight
            text="Save"
            textClass="text-lg"
            paddingClass="px-6 py-2 md:px-6"
            arrowVisible={false}
            requiredAssertion={false}
          />
        </div>
      </form>
    </div>
  );
}
export default EditProfile;
