import { useEffect, useState } from "react";

const Timer: React.FC = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId: number | undefined;

        if (isRunning) {
            intervalId = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);

                if (seconds === 60) {
                    setSeconds(0);
                    setMinutes((prevMinutes) => prevMinutes + 1);
                }

                if (minutes === 60) {
                    setMinutes(0);
                    setHours((prevHours) => prevHours + 1);
                }
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRunning, seconds, minutes]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(0);
    };

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-row items-center space-x-4">
                <p>{`Time Remaining- ${formattedTime}`}</p>
                <button
                    className="bg-neutral-300 rounded-xl h-10 px-8"
                    onClick={handleStart}
                >
                    Start
                </button>
            </div>
            <div className="flex justify-center">
                <button className="bg-neutral-300 rounded-xl h-10 px-8">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Timer;
