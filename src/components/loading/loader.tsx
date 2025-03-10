import React from "react";

function Loading() {
  return (
    <>
      <div className="flex justify-center my-3">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </>
  );
}

export default Loading;
