function PlayerTwo() {
  return (
    <div className="px-[26px] flex gap-x-3 items-center">
      <div className="grid grid-cols-4 gap-x-2 flex-1">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex">
          <div
            className="py-1 px-[17px] bg-[#DD7496] pr-[30px] w-[180px] border-[0.4px] border-[#D0EEF5] rounded-[10px]"
            style={{
              boxShadow: `
    -2px  -2.99px 6.98px 0px rgba(255, 255, 255, 0.3) inset,
     5.99px 2.99px 6.98px 0px rgba(255, 255, 255, 0.3) inset
  `,
              backdropFilter: "blur(498.86px)",
              WebkitBackdropFilter: "blur(498.86px)",
            }}
          >
            <div className="text-left w-[110px] space-y-1">
              <h3 className="font-satoshi text-[#F9F9F9CC] text-base/5 flex items-center gap-x-1 justify-end font-medium">
                Dinah{" "}
                <span className="text-[11px]/[100%] font-normal">
                  (computer)
                </span>
              </h3>
              <h4 className="text-right flex justify-end items-center gap-x-1 text-[#F9F9F9]">
                <img src="/coin.svg" className="w-[14px] h-[14px]" alt="" />
                800
              </h4>
            </div>
          </div>
          <div className="w-[57px] h-[57px] border-[1.23px] border-[#DD7496] rounded-full -ml-7 z-10 overflow-hidden">
            <img src="/user-pfp.svg" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="p-[0.7px] rounded-[14px] overflow-hidden bg-[linear-gradient(155.21deg,#AE2C21_13.44%,rgba(68,52,47,0)_38.7%,#AE2C21_92.32%)]">
      <div className="aspect-2/3 bg-[#111010] rounded-[14px] flex justify-center items-center">
        <h4 className="text-[33px] text-[#F9F9F9]">L</h4>
      </div>
    </div>
  );
}

export default PlayerTwo;
