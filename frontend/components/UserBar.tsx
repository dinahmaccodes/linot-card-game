"use client";
import React from "react";
import { useUserProfile } from "@/lib/UserProfileContext";

const UserBar = () => {
  const { userProfile } = useUserProfile();

  // Fallback values if no profile is set
  const username = userProfile?.username || "Player";
  const avatar = userProfile?.avatar || "/user-pfp.svg";
  const color = userProfile?.color || "#88D0E1";

  return (
    <div className="flex items-center">
      <div className="border-[1.2px] border-[#F9F9F9] rounded-full overflow-hidden w-20.25 h-20.25 z-5">
        <img src={avatar} alt="" className="w-full h-full" />
      </div>
      <div
        className="-ml-6.25 pr-5.5 pl-9.5 rounded-[10px] border-[0.4px] border-white text-[27px]/[18px] py-3 text-center font-satoshi"
        style={{
          backgroundColor: color,
          color: "white",
          boxShadow: `
    -1.99px -2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
     5.97px  2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
     0px     2px    5px    0px rgba(0, 0, 0, 0.25)
  `,
          backdropFilter: "blur(497.6px)",
          WebkitBackdropFilter: "blur(497.6px)",
        }}
      >
        <span className="text-3xl">{username}</span>{" "}
        <span className="text-[18px]">(you)</span>
      </div>
    </div>
  );
};

export default UserBar;
