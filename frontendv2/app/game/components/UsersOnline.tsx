import React from "react";

function UsersOnline() {
  return (
    <div className="flex items-center relative">
      <img src="/people.svg" className="z-3 w-[70px] h-[60px]" alt="" />
      <div
        className="ml-[-25px] rounded-[10px] bg-[#77F0FC03] flex items-center gap-x-1 border-[0.4px] border-[#D0EEF5] text-[28px] text-center text-[#F9F9F9] px-[38px]"
        style={{
          boxShadow: `
    -1.99px -2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
     5.97px  2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
     0px     2px    5px    0px rgba(0, 0, 0, 0.25)
  `,
          backdropFilter: "blur(497.6px)",
          WebkitBackdropFilter: "blur(497.6px)",
        }}
      >
        1000 <span className="text-xs font-medium">(people online)</span>
      </div>
    </div>
  );
}

export default UsersOnline;
