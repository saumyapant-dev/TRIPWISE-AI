const Extra = () => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="w-4 h-4 accent-indigo-500"
        />

        <span className="text-sm text-gray-700">
          Remember me
        </span>
      </div>

      <button className="text-indigo-500 text-sm hover:underline cursor-pointer">
        Forgot password?
      </button>
    </div>
  );
};

export default Extra;