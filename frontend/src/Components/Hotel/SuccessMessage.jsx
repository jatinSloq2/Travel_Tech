const SuccessMessage = ({ message }) =>
  message ? (
    <div className="rounded-md bg-orange-50 border border-orange-200 px-4 py-3 text-orange-700 font-medium mt-6">
      {message}
    </div>
  ) : null;

export default SuccessMessage;
