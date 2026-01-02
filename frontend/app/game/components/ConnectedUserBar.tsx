"use client";
import Logout from "@/svg/LogoutIcon";
import React from "react";
import { useUserProfile } from "@/lib/UserProfileContext";

function ConnectedUserBar() {
  const { userProfile } = useUserProfile();

  // Fallback values if no profile is set
  const username = userProfile?.username || "Player";
  const avatar = userProfile?.avatar || "/user-pfp.svg";

  return (
    <div className="flex items-center gap-x-6">
      <div className="flex items-center">
        <div className="border-[1.2px] border-[#88D0E1] rounded-full overflow-hidden w-[57px] h-[57px] z-5">
          <img src={avatar} alt="" />
        </div>
        <div
          className="ml-[-25px] rounded-[10px] bg-[#77F0FC03] border-[0.4px] border-[#D0EEF5] text-[27px]/[18px] py-2 text-center text-[#F9F9F9] px-[38px] pr-[22px]"
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
          {username}
        </div>
      </div>

      <button
        className="text-[#f9f9f9] p-1.5 rounded-lg bg-[#E24D4B] border-[0.25px] border-[#D0EEF5]"
        style={{
          boxShadow: `
    -1.24px -1.86px 4.34px 0px rgba(226, 58, 47, 1) inset,
     3.72px  1.86px 4.34px 0px rgba(245, 192, 192, 0.25) inset
  `,
          backdropFilter: "blur(309.74px)",
          WebkitBackdropFilter: "blur(309.74px)",
        }}
      >
        <Logout />
      </button>
    </div>
  );
}

export default ConnectedUserBar;
