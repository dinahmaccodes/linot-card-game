import React from "react";

function BetButton({ value }: { value: string }) {
  return (
    <button
      className="flex items-center font-lilitaone text-xl/[100%] gap-x-1 py-1 px-2 rounded-full bg-[#B8F7FF03] border-[0.4px] border-[#D0EEF5]"
      style={{
        boxShadow: `
    4px  2px 5px 0px rgba(255, 255, 255, 0.25) inset,
    1px -2px 5px 0px rgba(255, 255, 255, 0.3) inset
  `,
      }}
    >
      <img src="/coin.svg" className="w-[14px] h-[14px]" alt="" />
      {value}
    </button>
  );
}

export default BetButton;
