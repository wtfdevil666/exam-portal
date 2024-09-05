import { Editor } from "@monaco-editor/react";
import { Dispatch, SetStateAction } from "react";

type CodeEditorProps = {
    setCode: Dispatch<SetStateAction<string>>;
    lang: string;
    onChange: (code: string) => void;
};

const CodeEditor: React.FC<CodeEditorProps> = ({ setCode, lang, onChange }) => {
    return (
        <div>
            <Editor
                key={lang}
                height="70vh"
                width="50vw"
                theme="vs-dark"
                defaultLanguage={lang}
                onChange={(value: string | undefined) => {
                    if (value !== undefined) {
                        setCode(value);
                        onChange(value); // Call the onChange prop
                    }
                }}
            />
        </div>
    );
};

export default CodeEditor;
