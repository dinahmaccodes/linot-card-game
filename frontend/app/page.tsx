export default function Home() {
  return (
    <main
      className={`min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center`}
      style={{
        background: "linear-gradient(180deg, #77F0FC 0%, #19D3F9 100%)",
      }}
    >
      {/* --- Bubbles Decoration (Optional simple CSS circles) --- */}
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

      {/* --- Main Content Container --- */}
      <div className="relative z-20 flex flex-col items-center -mt-20">
        {/* LOGO SECTION */}
        <img src="/title-home.svg" alt="" />

        {/* OCTOPUS & PLAY BUTTON */}
        <div className="mt-12 flex flex-col items-center">
          <div className="animate-bounce-slow z-[10] animate-float animate-float-delayed">
            <img
              src="/red-octopus.svg"
              alt="Octopus"
              className="w-[254px] h-[260px]"
            />
          </div>

          <button
            className="relative group active:scale-95 bg-[#EA463D] rounded-[30px] transition-transform duration-100 w-[350px] mt-[-25px]"
            style={{ boxShadow: "0px 0px 3.75px 0px #25111566" }}
          >
            {/* Button Shadow/Depth */}
            <div className="absolute inset-0 bg-[#B93838] rounded-full translate-y-2"></div>
            {/* Main Button Body */}
            <div className="relative bg-[#EA4C4C] px-16 py-3 rounded-full border-b-4 border-[#B93838]">
              <span className="text-[55px]/[44px] text-white drop-shadow-md">
                play
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* --- SEA BED (Bottom Layer) --- */}
      <div
        className="absolute bottom-0 w-full h-[150px] z-10 rounded-t-[50%]" // rounded-t creates the slight hill effect
        style={{
          background:
            "linear-gradient(180deg, #D4FEBC -13.12%, #85F0D9 21.68%, #19E2D5 100%)",
          boxShadow: "0px 12px 18px 0px #E8FABC inset",
        }}
      ></div>

      {/* --- FOREGROUND DECORATIONS --- */}

      {/* Cards (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30 w-[384px] h-[214px] animate-float animate-float-delayed">
        <img
          src="/cards.svg"
          alt="Cards"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Weeds (Left) */}
      <div className="absolute bottom-[-55px] left-0 z-20 w-[590px] h-[654px] opacity-90 animate-sway">
        <img
          src="/weed-rock.svg"
          alt="Seaweed"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Weeds (Right) - Flipped for variety or use a different image */}
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
