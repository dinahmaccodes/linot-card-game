"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AVATARS = [
  "/user-pfp.svg",
  "/user-pfp-2.svg",
  "/user-pfp-3.svg",
  "/user-pfp-4.svg",
  "/user-pfp-5.svg",
  "/user-pfp-6.svg",
];

const COLORS = [
  "#88D0E1",
  "#7977FC",
  "#1EC8D1",
  "#8C1ED1",
  "#DD7496",
  "#E49564",
];

function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [playerNumber, setPlayerNumber] = useState<1 | 2 | null>(null);
  const [maxPlayers, setMaxPlayers] = useState<number>(2);

  const isFormValid = username.trim() !== "" && selectedAvatar !== null && selectedColor !== null;

  const handleSelectPlayer = (player: 1 | 2) => {
    setPlayerNumber(player);
    
    if (username.trim() && selectedAvatar !== null && selectedColor !== null) {
      // Store profile in localStorage
      const profile = {
        username,
        avatar: AVATARS[selectedAvatar],
        color: COLORS[selectedColor],
        playerNumber: player,
        maxPlayers: player === 1 ? maxPlayers : 2, // Only Player 1 sets max players
      };
      localStorage.setItem(`whot_player_profile_${player}`, JSON.stringify(profile));
      
      // Navigate to game
      router.push(`/game?player=${player}`);
    }
  };

  return (
    <main
      className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #77F0FC 0%, #19D3F9 100%)",
      }}
    >
      <img
        src="/water-bubbles.svg"
        className="absolute z-3 top-0 left-[150px] animate-bubbles animation-delay-2000"
        alt=""
      />
      <img src="/sea-walls.png" className="absolute z-3 top-0 left-0" alt="" />
      <img
        src="/reflection-lights.svg"
        className="absolute z-3 top-0 left-0 animate-shimmer"
        alt=""
      />

      <div
        className="border border-[#F9F9F9] relative z-100 -mt-20 text-[22px]/[100%] rounded-lg bg-[#40FFFC03] w-[719px] p-8"
        style={{
          backdropFilter: "blur(1000px)",
          WebkitBackdropFilter: "blur(1000px)",
          boxShadow: "0px -3px 4px 0px #FFFFFF40, -3px 0px 4px 0px #FFFFFF40",
        }}
      >
        <div className="px-3 mb-[50px]">
          {/* Username Input */}
          <div className="space-y-3 mb-5">
            <label
              htmlFor="username"
              className="text-[#01626F] font-lilitaone block py-2"
            >
              Enter Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Jonnie14"
              style={{
                boxShadow:
                  "4px 2px 5px 0px #FFFFFF40 inset, 1px -2px 5px 0px #FFFFFF4D inset",
                backdropFilter: "blur(70px)",
                WebkitBackdropFilter: "blur(70px)",
              }}
              className="py-3 px-[22px] text-lg rounded-lg border w-full border-[#D0EEF5] bg-[#B8F7FF03] text-[#01626F] placeholder:text-[#6CA0A7] font-satoshi font-medium"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3 mb-5">
            <label className="text-[#01626F] font-lilitaone block py-2">
              Select avatar
            </label>
            <div className="py-2 px-[22px] flex gap-x-2">
              {AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedAvatar(index)}
                  className={`transition-all ${
                    selectedAvatar === index
                      ? "ring-4 ring-[#0FB6C6] scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3 mb-5 border-t border-t-[#D0EEF5] py-1">
            <label className="text-[#01626F] font-lilitaone block py-2">
              Select color
            </label>
            <div className="py-2 px-[22px] flex gap-x-2">
              {COLORS.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedColor(index)}
                  className={`w-[57px] h-[57px] rounded-full border-[1.2px] transition-all ${
                    selectedColor === index
                      ? "border-[#01626F] ring-4 ring-[#0FB6C6] scale-110"
                      : "border-[#F9F9F9]"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Max Players - Fixed to 2 for now */}
          <div className="space-y-3 mb-5 border-t border-t-[#D0EEF5] py-1">
            <div className="py-2 px-[22px]">
              <div className="bg-[#0FB6C6]/10 border border-[#0FB6C6]/30 rounded-lg p-4">
                <p className="text-[#01626F] font-lilitaone text-lg">
                   2-Player Match
                </p>
                <p className="text-[#6CA0A7] text-sm mt-1">
                  This match will be for 2 players
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Player Selection */}
        <div className="space-y-3 mb-5 border-t border-t-[#D0EEF5] py-1">
          <label className="text-[#01626F] font-lilitaone block py-2 px-3">
            Select Player
          </label>
          {!isFormValid && (
            <p className="text-red-500 text-sm px-3">
              Please complete all fields above before selecting a player
            </p>
          )}
          <div className="py-2 px-[22px] flex gap-x-4">
            <button
              type="button"
              onClick={() => handleSelectPlayer(1)}
              disabled={!isFormValid}
              className={`flex-1 py-3 rounded-lg border font-satoshi font-bold transition-all ${
                isFormValid
                  ? "border-[#0FB6C6] bg-[#0FB6C6] text-white hover:bg-[#0da5b4] cursor-pointer"
                  : "border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Player 1 (Create)
            </button>
            <button
              type="button"
              onClick={() => handleSelectPlayer(2)}
              disabled={!isFormValid}
              className={`flex-1 py-3 rounded-lg border font-satoshi font-bold transition-all ${
                isFormValid
                  ? "border-[#0FB6C6] bg-[#0FB6C6] text-white hover:bg-[#0da5b4] cursor-pointer"
                  : "border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Player 2 (Join)
            </button>
          </div>
        </div>

        <p className="py-2 px-3 text-[#01626F] font-satoshi text-base/[100%]">
          Note: by registering you get an automatic{" "}
          <span className="font-bold">30</span> coins!!!
        </p>
      </div>

      <div
        className="absolute bottom-0 w-full h-[150px] z-10 rounded-t-[50%]"
        style={{
          background:
            "linear-gradient(180deg, #D4FEBC -13.12%, #85F0D9 21.68%, #19E2D5 100%)",
          boxShadow: "0px 12px 18px 0px #E8FABC inset",
        }}
      ></div>

      <div className="absolute bottom-4 left-4 z-30 w-[384px] h-[214px] animate-float animate-float-delayed">
        <img
          src="/cards.svg"
          alt="Cards"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="absolute bottom-[-55px] left-0 z-20 w-[590px] h-[654px] opacity-90 animate-sway">
        <img
          src="/weed-rock.svg"
          alt="Seaweed"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="absolute bottom-0 right-[-110px] z-20 w-[530px] h-[800px] opacity-90 animate-sway">
        <img
          src="/sea-weed-1.svg"
          alt="Seaweed"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-20 w-[530px] h-[800px] opacity-90 animate-sway">
        <img
          src="/sea-weed-2.svg"
          alt="Seaweed"
          className="w-full h-full object-contain"
        />
      </div>
    </main>
  );
}

export default RegisterPage;
