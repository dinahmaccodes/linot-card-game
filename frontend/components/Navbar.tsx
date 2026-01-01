import React from "react";
// import UserPoints from "../app/game/components//UserPoints";
// import UsersOnline from "../app/game/components//UsersOnline";
import { House, Volume2 } from "lucide-react";
import ConnectedUserBar from "../app/game/components/ConnectedUserBar";

function Navbar() {
  return (
    <div className="flex items-center justify-between py-4 px-5">
      <img src="/logo.svg" alt="" />
      <div className="flex gap-x-9">
        <div className="flex gap-x-4">
          {/* <UserPoints />
          <UsersOnline /> */}
          <div className="flex items-center gap-x-2">
            <button
              className="bg-[#52AD6D] border-[0.3px] border-[#D0EEF5] p-1.5 rounded-lg text-white flex justify-center items-center"
              style={{
                boxShadow: `
    -1.24px -1.86px 4.34px 0px rgba(66, 174, 98, 1) inset,
     3.72px  1.86px 4.34px 0px rgba(108, 237, 252, 0.25) inset
  `,
                backdropFilter: "blur(309.74px)",
                WebkitBackdropFilter: "blur(309.74px)",
              }}
            >
              <House size={27} />
            </button>
            <button
              className="bg-[#79D993] border-[0.3px] border-[#D0EEF5] p-1.5 rounded-lg text-white flex justify-center items-center"
              style={{
                boxShadow: `
    -1.24px -1.86px 4.34px 0px rgba(115, 197, 138, 1) inset,
     3.72px  1.86px 4.34px 0px rgba(108, 237, 252, 0.25) inset
  `,
                backdropFilter: "blur(309.74px)",
                WebkitBackdropFilter: "blur(309.74px)",
              }}
            >
              <Volume2 size={27} />
            </button>
          </div>
        </div>
        <ConnectedUserBar />
      </div>
    </div>
  );
}

export default Navbar;
