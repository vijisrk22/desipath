function EmailInput({ register, errors, onChange }) {
  return (
    <div>
      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        })}
        className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:border-[#0857d0] focus:bg-white rounded-xl text-gray-800 text-sm font-dmsans transition-all outline-none"
        placeholder="Your email address"
        type="email"
        autoComplete="username"
        onChange={onChange}
      />
      {errors.email && (
        <span className="text-red-500 text-xs mt-1">
          {errors.email.message}
        </span>
      )}
    </div>
  );
}

export default EmailInput;
