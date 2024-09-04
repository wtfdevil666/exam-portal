import { useEffect, useState } from "react";

type UserAnswers = {
    [key: string]: string;
};

type MCQComponentProps = {
    data: {
        questions: {
            [key: string]: {
                question: string;
                a: string;
                b: string;
                c: string;
                d: string;
            };
        };
    };
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
};

const MCQComponent: React.FC<MCQComponentProps> = ({
    data,
    currentIndex,
    setCurrentIndex,
}) => {
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

    useEffect(() => {
        const storedAnswers = localStorage.getItem("userAnswers");
        if (storedAnswers) {
            setUserAnswers(JSON.parse(storedAnswers));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    }, [userAnswers]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    const handleCheckboxChange = (questionId: any, option: any) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: option,
        }));
    };

    return (
        <div className="p-4">
            {Object.keys(data.questions).map((questionId, index) => {
                //@ts-ignore
                const question = data.questions[questionId];
                return (
                    <div
                        key={questionId}
                        style={{
                            display: index === currentIndex ? "block" : "none",
                        }}
                        className="space-y-8"
                    >
                        <h1 className="text-2xl flex items-center flex-row space-x-2">
                            <div className="text-xl">{`Q ${index + 1})`}</div>
                            <div className="capitalize">
                                {question.question}
                            </div>
                        </h1>
                        <ul className="pl-6 text-lg space-y-4">
                            <li className="bg-neutral-300 h-10 items-center flex p-4 rounded-lg space-x-2">
                                <div>
                                    <input
                                        type="radio"
                                        checked={
                                            userAnswers[questionId] ===
                                            question.a
                                        }
                                        onChange={() =>
                                            handleCheckboxChange(
                                                questionId,
                                                question.a
                                            )
                                        }
                                    />
                                </div>
                                <div>{question.a}</div>
                            </li>
                            <li className="bg-neutral-300 h-10 items-center flex p-4 rounded-lg space-x-2">
                                <div>
                                    <input
                                        type="radio"
                                        checked={
                                            userAnswers[questionId] ===
                                            question.b
                                        }
                                        onChange={() =>
                                            handleCheckboxChange(
                                                questionId,
                                                question.b
                                            )
                                        }
                                    />
                                </div>
                                <div>{question.b}</div>
                            </li>
                            <li className="bg-neutral-300 h-10 items-center flex p-4 rounded-lg space-x-2">
                                <div>
                                    <input
                                        type="radio"
                                        checked={
                                            userAnswers[questionId] ===
                                            question.c
                                        }
                                        onChange={() =>
                                            handleCheckboxChange(
                                                questionId,
                                                question.c
                                            )
                                        }
                                    />
                                </div>
                                <div>{question.c}</div>
                            </li>
                            <li className="bg-neutral-300 h-10 items-center flex p-4 rounded-lg space-x-2">
                                <div>
                                    <input
                                        type="radio"
                                        checked={
                                            userAnswers[questionId] ===
                                            question.d
                                        }
                                        onChange={() =>
                                            handleCheckboxChange(
                                                questionId,
                                                question.d
                                            )
                                        }
                                    />
                                </div>
                                <div>{question.d}</div>
                            </li>
                        </ul>
                        <div
                            className="flex justify-between p-4
                        "
                        >
                            <button
                                disabled={index === 0}
                                className="h-10 bg-neutral-300 px-8 rounded-xl"
                                onClick={handlePrev}
                            >
                                Prev
                            </button>

                            <button
                                disabled={
                                    index ===
                                    Object.keys(data.questions).length - 1
                                }
                                className="h-10 bg-neutral-300 px-8 rounded-xl"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MCQComponent;
