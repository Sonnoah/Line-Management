"use client";

export default function TodayDoneOverlay({ onCheckinAgain, onClose }) {
  return (
     <div className="fixed inset-0 z-40 bg-black/50  flex items-center justify-center">
        <div className="pl-8 pr-8 text-center">

            <div className="text-5xl mb-4">
            <span className="pepicons-print--lock-open"></span>
            </div>

            <h2 className="text-[20px] font-bold mb-2">
            Today's Check in Completed
            </h2>

            <p className="text-[16px] text-gray-700 mb-6 leading-relaxed">
            You have already <b>checked in</b> and <b>checked out</b> today.
            <br />
            Would you like to check in again?
            </p>

            <div className="flex flex-col gap-3">
                <button
                    className="btn btn-success btn-lg w-full"
                    onClick={onCheckinAgain}
                    >
                        Check in again
                    </button>

                <button
                    className="btn btn-outline btn-lg w-full"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
  );
}
