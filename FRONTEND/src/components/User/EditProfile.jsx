import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../store/UserSlice";
import ButtonRight from "../ButtonRight";
import PhoneNumberInput from "../InputTemplate/PhoneNumberInput";
import BackWithHeader from "./BackWithHeader";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
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
      first_name: user?.name?.split(" ")[0] || "",
      last_name: user?.name?.split(" ")[1] || "",
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
        first_name: user.name?.split(" ")[0] || "",
        last_name: user.name?.split(" ")[1] || "",
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
  return (
    <div className="flex flex-col items-center justify-between gap-5 max-w-screen-md mx-auto px-6 py-4">
      <BackWithHeader text={"Edit Profile"} path={"/profile"} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextFieldInput
          name="first_name"
          defaultValue={user?.name ? user?.name.split(" ")[0] : ""}
          control={control}
          text="First Name"
          requiredAssertion={false}
        />
        <TextFieldInput
          name="last_name"
          defaultValue={user?.name ? user?.name.split(" ")[1] : ""}
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
          customProps={{ placeholder: "******" }}
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
