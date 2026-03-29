import React from "react";

const FullScreenLoading: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div style={{ background: '#fff' }} className="fixed inset-0 flex items-center justify-center w-full h-full z-50">
    <span className="text-2xl font-bold">{text}</span>
  </div>
);

export default FullScreenLoading;
