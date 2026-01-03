function PasswordInput({ register, errors, noFlag = false }) {
  return (
    <div>
      <input
        {...register("password", {
          required: "Password is required",
          ...(noFlag
            ? {}
            : {
                minLength: {
                  value: 7,
                  message: "Minimum length is 7 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                  message: "Must contain at least one letter and one number",
                },
              }),
        })}
        type="password"
        placeholder="Your password"
        className="p-4 bg-neutral-50 rounded-xl text-gray-800 text-sm font-dmsans outline-none w-full"
      />

      <span className={`text-[#6c7174] text-xs ${noFlag ? "hidden" : ""}`}>
        Use at least one letter, one numeral, and seven characters.
      </span>

      {errors.password && (
        <div className="text-red-500 text-xs mt-1">
          {errors.password.message}
        </div>
      )}
    </div>
  );
}

export default PasswordInput;
