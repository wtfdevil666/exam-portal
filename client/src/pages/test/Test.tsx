import MCQComponent from "../../components/test/Mcq";
import React, { useState } from "react";
import Timer from "../../components/test/Timer";
import HoverComponent from "../../components/test/Hoverlist";

const Test: React.FC = () => {
    const data = {
        questions: {
            1: {
                question: "some quest 1",
                a: "first",
                b: "second",
                c: "third",
                d: "fourth",
            },
            2: {
                question: "some quest 2",
                a: "first",
                b: "second",
                c: "third",
                d: "fourth",
            },
            3: {
                question: "some quest 3",
                a: "first",
                b: "second",
                c: "third",
                d: "fourth",
            },
            4: {
                question: "some quest 4",
                a: "first",
                b: "second",
                c: "third",
                d: "fourth",
            },
            5: {
                question: "some quest 5",
                a: "first",
                b: "second",
                c: "third",
                d: "fourth",
            },
            6: {
                question: "some quest 6",
                a: "first",
                b: "second",
                c: "third",
                d: "fourth",
            },
            7: {
                question: "some quest 7",
                a: "first",
                b: "second",
                c: "third",
                d: "fourth",
            },
        },
    };
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
        <div className="grid grid-cols-6 h-screen">
            <div className="bg-neutral-200 w-full pt-24">
                <div className="flex flex-col items-center space-y-8">
                    <button className="bg-neutral-300 rounded-xl h-10 px-8">
                        MCQ
                    </button>
                    <button className="bg-neutral-300 rounded-xl h-10 px-8">
                        Coding
                    </button>
                </div>
            </div>
            <div className="col-span-5 p-4">
                <div className="flex flex-row justify-between">
                    <div className="p-4">
                        <button className="bg-neutral-300 rounded p-1">
                            <HoverComponent
                                totalQuestions={
                                    Object.keys(data.questions).length
                                }
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                            />
                        </button>
                    </div>
                    <div>
                        <Timer />
                    </div>
                </div>
                <div className="p-4">
                    <MCQComponent
                        data={data}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                    />
                </div>
            </div>
        </div>
    );
};

export default Test;
