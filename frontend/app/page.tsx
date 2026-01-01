"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
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

      <div className="relative z-20 flex flex-col items-center -mt-20">
        <img src="/title-home.svg" alt="" />

        <div className="mt-12 flex flex-col items-center">
          <div className="animate-bounce-slow z-10 animate-float animate-float-delayed">
            <img
              src="/red-octopus.svg"
              alt="Octopus"
              className="w-[254px] h-[260px]"
            />
          </div>

          <button
            onClick={() => setShowSplash(true)}
            className="relative group active:scale-95 bg-[#EA463D] rounded-[30px] transition-transform font-lilitaone duration-100 w-[350px] mt-[-25px]"
            style={{ boxShadow: "0px 0px 3.75px 0px #25111566" }}
          >
            <div className="absolute inset-0 bg-[#B93838] rounded-full translate-y-2"></div>
            <div className="relative bg-[#EA4C4C] px-16 py-3 rounded-full border-b-4 border-[#B93838]">
              <span className="text-[55px]/[44px] text-white drop-shadow-md">
                connect
              </span>
            </div>
          </button>
        </div>
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

      {showSplash && (
        <div className="fixed inset-0 bg-black/50 z-999 flex justify-center items-center font-lilitaone">
          <div className="w-[1056px] text-center">
            <div
              className="relative w-full mb-10 h-[650px] py-[62px] px-[78px]
            "
            >
              <img
                src="/bubble.svg"
                className="absolute top-0 left-0 -z-1"
                alt=""
              />
              <div className="max-w-[75%] mx-auto text-[22px] text-[#01626F]">
                <h2 className="mb-5">Linot is simple!!</h2>
                <p className="mb-5">
                  Match the shape or number of the top card or draw if you
                  can’t. You can double play only when the cards share the same
                  number.
                </p>
                <p>Special cards shake things up:</p>
                <ul className="mb-5">
                  <li>1 (Hold On) skips the next player,</li>
                  <li>2 (Pick Two) and 5 (Pick Three) force draws,</li>
                  <li>8 (Suspension) skips the next turn,</li>
                  <li>
                    14 (General Market) makes everyone except you draw, and
                  </li>
                  <li>20 (Linot) lets you pick a new shape.</li>
                </ul>

                <p className="mb-5">
                  You can block any attack card by matching its number (except
                  14), or by paying coins to protect yourself.
                </p>
                <p>
                  Win by being the first to empty your hand or, when the timer
                  runs out, by having the fewest cards.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                router.push("/register");
              }}
              className="py-3 bg-[#0FB6C6] border-[0.2px] border-[#D0EEF5] w-[560px] rounded-[13px] text-[#F9F9F9] text-4xl"
              style={{
                boxShadow: "2.65px 1.33px 3.1px 0px #6CEDFC40 inset",
                backdropFilter: "blur(221.15200805664062px)",
                WebkitBackdropFilter: "blur(221.15200805664062px)",
              }}
            >
              next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
