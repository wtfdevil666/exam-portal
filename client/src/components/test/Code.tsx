import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";

export type UserAnswers = {
    [key: string]: string;
};

const Code: React.FC = () => {
    const data = {
        questions: {
            1: {
                title: "some quest 1",
                tags: "tag 1",
                description: "desc 1",
                sampleTestCase: "test 1`",
                testOutput: "out 1",
            },
            2: {
                title: "some quest 2",
                tags: "tag 2",
                description: "desc 2",
                sampleTestCase: "test 2`",
                testOutput: "out 2",
            },
            3: {
                title: "some quest 3",
                tags: "tag 3",
                description: "desc 3",
                sampleTestCase: "test 3`",
                testOutput: "out 3",
            },
            4: {
                title: "some quest 4",
                tags: "tag 4",
                description: "desc 4",
                sampleTestCase: "test 4`",
                testOutput: "out 4",
            },
        },
    };
    const [code, setCode] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [codeAnswers, setCodeAnswers] = useState<UserAnswers>({});
    const [lang, setLang] = useState("javascript");

    const handleNext = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLang(e.target.value);
    };

    const handleCodeChange = (questionId: string, code: string) => {
        setCodeAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: code,
        }));
    };

    useEffect(() => {
        const storedAnswers = localStorage.getItem("codeAnswers");
        if (storedAnswers) {
            setCodeAnswers(JSON.parse(storedAnswers));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("codeAnswers", JSON.stringify(codeAnswers));
    }, [codeAnswers]);

    return (
        <div>
            {Object.keys(data.questions).map((questionId, index) => {
                //@ts-ignore
                const question = data.questions[questionId];
                return (
                    <div
                        key={questionId}
                        className="p-4 flex flex-row justify-between"
                        style={{
                            display: index === currentIndex ? "flex" : "none",
                        }}
                    >
                        <div key={questionId} className="space-y-8 w-full p-4">
                            <h1 className="text-4xl flex items-center flex-row space-x-2">
                                <div className="text-4xl">{`${
                                    index + 1
                                })`}</div>
                                <div className="capitalize">
                                    {question.title}
                                </div>
                            </h1>
                            <div className="flex flex-col space-y-8">
                                <h1 className="flex flex-col">
                                    <div className="text-2xl">Tags:</div>
                                    <div className="pl-4 text-xl">
                                        {question.tags}
                                    </div>
                                </h1>
                                <h1 className="flex flex-col">
                                    <div className="text-2xl">Description:</div>
                                    <div className="pl-4 text-xl">
                                        {question.description}
                                    </div>
                                </h1>
                                <h1 className="flex flex-col">
                                    <div className="text-2xl">
                                        Sample Test Cases:
                                    </div>
                                    <div className="pl-4 text-xl">
                                        {question.sampleTestCase}
                                    </div>
                                </h1>
                                <h1 className="flex flex-col">
                                    <div className="text-2xl">
                                        Sample OutPut:
                                    </div>
                                    <div className="pl-4 text-xl">
                                        {question.testOutput}
                                    </div>
                                </h1>
                            </div>
                            <div className="flex flex-row justify-between p-4">
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
                        <div className="flex flex-col w-full space-y-2">
                            <div>
                                <select
                                    value={lang}
                                    onChange={handleLangChange}
                                >
                                    <option value="javascript">
                                        JavaScript
                                    </option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="html">HTML</option>
                                    <option value="typescript">
                                        TypeScript
                                    </option>
                                </select>
                                <p>Selected Language: {lang}</p>
                            </div>
                            <div>
                                <CodeEditor
                                    key={questionId}
                                    lang={lang}
                                    setCode={setCode}
                                    onChange={(code) =>
                                        handleCodeChange(questionId, code)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Code;
