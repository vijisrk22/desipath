import { useForm } from "react-hook-form";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../store/UserSlice";
import ButtonRight from "../ButtonRight";
import PhoneNumberInput from "../InputTemplate/PhoneNumberInput";
import BackWithHeader from "./BackWithHeader";
function EditProfile() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [formDetails, setFormDetails] = useState(null);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== "")
    );

    try {
      dispatch(updateUserProfile(filteredData));
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
          defaultValue="******"
          control={control}
          text="Password"
          type="password"
          requiredAssertion={false}
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
