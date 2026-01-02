"use client";
import React from "react";
import { useUserProfile } from "@/lib/UserProfileContext";

function Timer() {
  const { userProfile } = useUserProfile();
  const username = userProfile?.username || "Player";

  return (
    <div className="relative font-lilitaone text-[#01626F] ml-10 flex flex-col pt-[194px]">
      <div className="absolute top-0 -right-7 w-[280px] z-0 animate-float-delayed origin-bottom-right">
        <div className="relative hover:scale-105 transition-transform duration-300">
          <img
            src="/thought-bubble.png"
            alt=""
            className="w-full drop-shadow-md"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-8 pt-0 text-center leading-[110%] text-[20px]">
            <h3>{username}, it's your turn to make a move. Make it count</h3>
          </div>
        </div>
      </div>

      <img
        src="/red-octopus.svg"
        className="w-24 h-24 z-20 relative animate-float drop-shadow-lg"
        alt="Octopus"
      />

      {/* <div
        className="w-fit z-10 relative -mt-5 px-[26px] py-1 text-[28px]/[100%] bg-[#77F0FC03] border-[0.4px] border-[#D0EEF5] rounded-[10px]"
        style={{
          boxShadow: `
            -1.99px -2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
             5.97px  2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
             0px     2px    5px    0px rgba(0, 0, 0, 0.25)
          `,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        10:00
      </div> */}
    </div>
  );
}

export default Timer;
