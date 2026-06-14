import Header from "../components/seat-layout/Header";
import Footer from "../components/seat-layout/Footer";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowById } from "../apis/index";
import screenImg from "../assets/screen.png"; 
import { useSeatContext } from "../context/SeatContext";
import { useLocation } from "../context/LocationContext";
import { socket } from "../utils/socket";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getAisleSplit = (seatCount) => Math.ceil(seatCount / 2);

const Seat = ({ seat, row, selectedSeats, lockedSeats, onClick }) => {
  const seatId = `${row}${seat.number}`;
  const isLocked = lockedSeats?.includes(seatId);
  const isSelected = selectedSeats.includes(seatId);

  return (
    <button
      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border text-[10px] sm:text-xs font-medium transition-colors
        ${
          seat.status === "BOOKED"
            ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
            : isLocked
            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-[#eb0028] text-white border-[#eb0028] cursor-pointer"
            : "bg-white hover:bg-green-50 border-gray-300 text-gray-700 cursor-pointer"
        }`}
      disabled={seat.status === "BOOKED" || isLocked}
      onClick={onClick}
      title={seatId}
    >
      {seat.status === "BOOKED" || isLocked ? "" : seat.number}
    </button>
  );
};

const SeatRow = ({ rowObj, selectedSeats, lockedSeats, onSelectSeat }) => {
  const aisleSplit = getAisleSplit(rowObj.seats.length);
  const leftSeats = rowObj.seats.slice(0, aisleSplit);
  const rightSeats = rowObj.seats.slice(aisleSplit);

  const renderSeats = (seats) =>
    seats.map((seat) => (
      <Seat
        key={seat.number}
        seat={seat}
        row={rowObj.row}
        selectedSeats={selectedSeats}
        lockedSeats={lockedSeats}
        onClick={() => onSelectSeat(rowObj.row, seat.number)}
      />
    ));

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <span className="w-4 sm:w-5 text-right text-[10px] sm:text-xs text-gray-500 font-medium shrink-0">
        {rowObj.row}
      </span>
      <div className="flex gap-0.5 sm:gap-1">{renderSeats(leftSeats)}</div>
      <div className="w-4 sm:w-8 shrink-0" aria-hidden="true" />
      <div className="flex gap-0.5 sm:gap-1">{renderSeats(rightSeats)}</div>
      <span className="w-4 sm:w-5 text-left text-[10px] sm:text-xs text-gray-500 font-medium shrink-0">
        {rowObj.row}
      </span>
    </div>
  );
};

const SeatLayout = () => {

  const [lockedSeats, setLockedSeats] = useState();
  const { selectedSeats, setSelectedSeats } = useSeatContext();
  const { location } = useLocation();

  const handleSelectSeat = (row, number) => {
    const seatId = `${row}${number}`;

    setSelectedSeats((prev) => 
      prev.includes(seatId) ? prev.filter((existingId) => existingId !== seatId) : [...prev, seatId]
    )
  
  }

  const { showId } = useParams();

  const {
    data: showData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),
    placeholderData: keepPreviousData,
    enabled: !!showId,
    select: (res) => res.data,
  });


  const isSelectedSeats = selectedSeats.length > 0;


  /* Socket.io Code start  */

  useEffect(() => {
    setSelectedSeats([]);
    socket.emit("join-show", {showId});
    socket.on("locked-seats-initials", ({seatIds}) => {
      setLockedSeats(seatIds);
    })

    socket.on("seat-locked", ({seatIds, showId: incommingShowId}) => {
      if(incommingShowId !== showId) return;

      setLockedSeats((prev) => [...new Set([...prev, ...seatIds])]);
    })

    socket.on("seat-unlocked", ({seatIds, showId:incommingShowId}) => {
      if(incommingShowId !== showId) return;

      setLockedSeats((prev) => prev.filter((id) => !seatIds.includes(id)));
    })

    socket.on("seat-locked-failed", ({showId,
        requested: seatIds,
        alreadyLocked,}) => {
          toast.error(`Some seats are already locked: ${alreadyLocked.join(", ")}`)
        })

    return ()=>{
      socket.off("locked-seats-initials")
      socket.off("seat-locked")
      socket.off("seat-unlocked")
      socket.off("seat-locked-failed")
      socket.disconnect()
      }

  },[showId])


  console.log("lockedseats: ", lockedSeats);


  /* Socket.io Code ends */


  return (
    <>
      <div className="h-screen overflow-y-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full z-10">
          <Header showData={showData} />
        </div>
        {/* Scrollable Seat Layout */}
         <div className="max-w-5xl mx-auto mt-[210px] px-4 sm:px-6 pb-4 bg-white h-[calc(100vh-320px)] overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col items-center">
            {showData?.seatLayout && (
              <div className="w-full flex flex-col items-center">
                {Object.entries(
                  showData.seatLayout.reduce((acc, curr) => {
                    if (!acc[curr.type])
                      acc[curr.type] = { price: curr.price, rows: [] };
                    acc[curr.type].rows.push(curr);
                    return acc;
                  }, {})
                ).map(([type, { price, rows }]) => (
                  <div
                    key={type}
                    className="mb-8 w-full flex flex-col items-center"
                  >
                    <div className="w-full max-w-3xl border-b border-dashed border-gray-300 pb-2 mb-4">
                      <p className="text-center text-sm font-semibold text-gray-700 tracking-wide">
                        {type} — ₹{price}
                      </p>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      {rows.map((rowObj) => (
                        <SeatRow
                          key={rowObj.row}
                          rowObj={rowObj}
                          selectedSeats={selectedSeats}
                          lockedSeats={lockedSeats}
                          onSelectSeat={handleSelectSeat}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full max-w-3xl mt-8 mb-4 flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.3em] mb-2">
                ALL EYES THIS WAY PLEASE!
              </p>
              <div className="w-full h-2 bg-gradient-to-b from-gray-300 to-gray-100 rounded-t-[50%] shadow-inner" />
              <img
                src={screenImg}
                alt="Screen"
                className="w-full max-w-md object-contain opacity-60 -mt-1"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white border-t border-gray-200 py-4 px-4 z-10">
          <Footer isSelected={isSelectedSeats} selectedSeats={selectedSeats} showData={showData} state={location}  />
        </div>
      </div>
    </>
  );
};

export default SeatLayout;
