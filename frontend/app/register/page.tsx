"use client";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  return (
    <main
      className={`min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center `}
      style={{
        background: "linear-gradient(180deg, #77F0FC 0%, #19D3F9 100%)",
      }}
    >
      <img
        src="/water-bubbles.svg"
        className="absolute z-3 top-0 left-[150px] animate-bubbles animation-delay-2000"
        alt=""
      />
      <img alt="" />
      <img src="/sea-walls.png" className="absolute z-3 top-0 left-0" alt="" />
      <img
        src="/reflection-lights.svg"
        className="absolute z-3 top-0 left-0 animate-shimmer"
        alt=""
      />

      <div
        className="border border-[#F9F9F9] relative z-100 -mt-20 text-[22px]/[100%]  rounded-lg bg-[#40FFFC03] w-[719px] p-8"
        style={{
          backdropFilter: "blur(1000px)",
          WebkitBackdropFilter: "blur(1000px)",
          boxShadow: "0px -3px 4px 0px #FFFFFF40, -3px 0px 4px 0px #FFFFFF40",
        }}
      >
        <form action="" className="px-3 mb-[50px]">
          <div className="space-y-3 mb-5">
            <label
              htmlFor="username"
              className="text-[#01626F] font-lilitaone block py-2"
            >
              Enter Username
            </label>
            <input
              type="text"
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

          <div className="space-y-3 mb-5">
            <label
              htmlFor="username"
              className="text-[#01626F] font-lilitaone block py-2"
            >
              Select avatar
            </label>

            <div className="py-2 px-[22px] flex gap-x-2">
              <button>
                <img src="/user-pfp.svg" alt="" />
              </button>
              <button>
                <img src="/user-pfp-2.svg" alt="" />
              </button>
              <button>
                <img src="/user-pfp-3.svg" alt="" />
              </button>
              <button>
                <img src="/user-pfp-4.svg" alt="" />
              </button>
              <button>
                <img src="/user-pfp-5.svg" alt="" />
              </button>
              <button>
                <img src="/user-pfp-6.svg" alt="" />
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-5 border-t border-t-[#D0EEF5] py-1">
            <label
              htmlFor="username"
              className="text-[#01626F] font-lilitaone block py-2"
            >
              Select color
            </label>

            <div className="py-2 px-[22px] flex gap-x-2">
              <button className="w-[57px] h-[57px] rounded-full border-[1.2px] border-[#F9F9F9] bg-[#88D0E1]" />
              <button className="w-[57px] h-[57px] rounded-full border-[1.2px] border-[#F9F9F9] bg-[#7977FC]" />
              <button className="w-[57px] h-[57px] rounded-full border-[1.2px] border-[#F9F9F9] bg-[#1EC8D1]" />
              <button className="w-[57px] h-[57px] rounded-full border-[1.2px] border-[#F9F9F9] bg-[#8C1ED1]" />
              <button className="w-[57px] h-[57px] rounded-full border-[1.2px] border-[#F9F9F9] bg-[#DD7496]" />
              <button className="w-[57px] h-[57px] rounded-full border-[1.2px] border-[#F9F9F9] bg-[#E49564]" />
            </div>
          </div>
        </form>

        <div className="space-y-3 mb-5 border-t border-t-[#D0EEF5] py-1">
          <label
            htmlFor="playerNumber"
            className="text-[#01626F] font-lilitaone block py-2"
          >
            Select Player
          </label>
          <div className="py-2 px-[22px] flex gap-x-4">
            <button
              onClick={() => router.push("/game/1?player=1")}
              className="flex-1 py-3 rounded-lg border border-[#0FB6C6] bg-[#0FB6C6] text-white font-satoshi font-bold"
            >
              Player 1
            </button>
            <button
              onClick={() => router.push("/game/1?player=2")}
              className="flex-1 py-3 rounded-lg border border-[#0FB6C6] bg-[#0FB6C6] text-white font-satoshi font-bold"
            >
              Player 2
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            router.push("/game/1?player=1");
          }}
          className="flex items-center gap-x-2 mb-4 bg-[#0FB6C6] border-[0.2px] border-[#D0EEF5] w-full py-3 text-[#F9F9F9] justify-center rounded-[13px] text-[32px]/[100%]"
          style={{
            boxShadow: "2.65px 1.33px 3.1px 0px #6CEDFC40 inset",
            backdropFilter: "blur(221.15200805664062px)",
            WebkitBackdropFilter: "blur(221.15200805664062px)",
          }}
        >
          next <img src="/coin.svg" className="w-7 h-7" alt="" />
        </button>

        <p className="py-2 text-[#01626F] font-satoshi text-base/[100%]">
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
          className="w-full h-full object-contain "
        />
      </div>
    </main>
  );
}

export default page;
