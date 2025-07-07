function Remarks({ remark }) {
  return (
    <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
      <div className="text-sm font-semibold text-blue-700 mb-1">
        {remark.closureName}
      </div>
      <p className="text-sm text-gray-700">{remark.text}</p>
      <div className="flex justify-end items-center mt-2">
        <span className="text-xs text-gray-500">{remark.date}</span>
      </div>
    </div>
  );
}

export default Remarks;