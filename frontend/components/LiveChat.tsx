import ChattingIcon from "@/svg/ChattingIcon";
import SendIcon from "@/svg/SendIcon";
import { Copy, Settings, Volume2 } from "lucide-react";
import React from "react";

function LiveChat() {
  return (
    <div className="py-3 px-2 rounded-lg border border-[#F9F9F9] bg-transparent backdrop-blur-md w-fit h-fit">
      <div className="flex justify-between items-center py-2 px-3 mb-1">
        <div className="flex gap-x-2 items-center">
          <h1 className="text-lg text-[#01626F]">Live Game</h1>
          <div className="w-5 h-5 rounded-full bg-[#79D993]"></div>
        </div>
        <div className="flex items-center gap-x-3.5">
          <button>
            <Settings />
          </button>
          <button>
            <Volume2 />
          </button>
        </div>
      </div>

      <div className="gap-x-0.5 font-satoshi mb-6 flex items-stretch text-[#01626F] text-sm">
        <div
          className="py-2 px-3 bg-[#77F0FC03] rounded-l-lg  flex items-center font-medium"
          style={{
            boxShadow: `
    1px -2px 5px 0px rgba(255, 255, 255, 0.3) inset,
    4px  2px 5px 0px rgba(255, 255, 255, 0.25) inset
  `,
          }}
        >
          https://gameverse.chat/invite/...
        </div>
        <button className="flex gap-x-1.5 items-center bg-[#50D3E7] py-2 px-3 rounded-r-lg">
          <Copy size={16} /> Copy
        </button>
      </div>

      <div className="bg-[#8CF2FF0D] border border-[#F9F9F980] rounded-xl overflow-hidden space-y-1">
        <div className="flex justify-between items-center bg-[#50D3E7] py-2 px-4 text-[#01626F]">
          <h3 className="font-lilitaone text-base flex items-center gap-x-1">
            Chat <span className="font-satoshi text-xs"> (0)</span>
          </h3>
          <ChattingIcon />
        </div>

        <div className="h-75 overflow-auto border-y border-[#F9F9F980] flex flex-col justify-center">
          <h5 className="text-[#01626F] font-satoshi font-bold text-center">
            Chat feature coming soon
          </h5>
        </div>

        <div className="flex items-center bg-[#50D3E7] py-2 px-4 gap-x-2 text-[#01626F]">
          <input
            type="text"
            className="flex-1 py-2.5 px-3 font-satoshi"
            placeholder="Connect with viewers more..."
          />
          <button className="w-9 h-9 rounded-full flex justify-center items-center border border-[#F9F9F980]">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveChat;
