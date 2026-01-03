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
        className="p-4 bg-neutral-50 rounded-xl text-gray-800 text-sm font-dmsans outline-none w-full"
        placeholder="Your email address"
        type="email"
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
