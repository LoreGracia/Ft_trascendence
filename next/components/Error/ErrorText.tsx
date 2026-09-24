interface ErrorTextProps {
    topMessage: string;
    errorCode: string;
    bottomMessage: string;
}

export default function ErrorText({
    topMessage,
    errorCode,
    bottomMessage,
}: ErrorTextProps) {
    return (
        <div className="text-center">
            <p style={{ fontSize: "58px" }} className="text-gray-500 mb-8">
                {topMessage}
            </p>

            <div className="flex items-center justify-center gap-4 mb-4">
                <p style={{ fontSize: "38px" }} className="text-gray-500">
                    Error |
                </p>
                <h1 style={{ fontSize: "100px", color: "#ff3333" }} className="font-bold">
                    {errorCode}
                </h1>
            </div>

            <p style={{ fontSize: "58px" }} className="text-gray-400">
                {bottomMessage}
            </p>
        </div >
    );
}