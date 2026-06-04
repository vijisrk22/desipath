function PasswordInput({ register, errors, noFlag = false, autoComplete = "current-password" }) {
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
        autoComplete={autoComplete}
        placeholder="Your password"
        className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:border-[#0857d0] focus:bg-white rounded-xl text-gray-800 text-sm font-dmsans transition-all outline-none"
      />

      <p className={`text-[#6c7174] text-xs mt-1.5 ml-2 ${noFlag ? "hidden" : ""}`}>
        Use at least one letter, one numeral, and seven characters.
      </p>

      {errors.password && (
        <div className="text-red-500 text-xs mt-1">
          {errors.password.message}
        </div>
      )}
    </div>
  );
}

export default PasswordInput;
