import React from "react";
const ConfirmModal = ({
  show,
  onConfirm,
  onCancel,
  message
}) => {
  if (!show) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-800 text-lg font-semibold mb-4"
  }, message), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
  }, "No"), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  }, "Yes"))));
};
export default ConfirmModal;