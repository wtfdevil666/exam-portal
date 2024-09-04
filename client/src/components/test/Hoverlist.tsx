import React, { useState } from "react";
import { Menu } from "lucide-react";

interface HoverComponentProps {
    totalQuestions: number;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

const HoverComponent: React.FC<HoverComponentProps> = ({
    totalQuestions,
    currentIndex,
    setCurrentIndex,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: "relative" }}
        >
            <button style={{ padding: "10px", cursor: "pointer" }}>
                <Menu />
            </button>
            {isHovered && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 bg-white absolute top-full left-0 z-[1] py-4 px-4 w-[20vw] border">
                    {Array.from({ length: totalQuestions }).map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`cursor-pointer rounded-xl py-2 ${
                                index === currentIndex && `bg-slate-400`
                            }`}
                        >
                            Q {index + 1}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HoverComponent;
