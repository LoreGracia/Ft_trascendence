"use client";

import ErrorLayout from "@/components/Error/ErrorLayout";
import ErrorText from "@/components/Error/ErrorText";
import DiceErrorTriple from "@/components/Error/DiceErrorTriple";

export default function Error403() {
    return (
        <ErrorLayout
            children={
                <DiceErrorTriple result1={4} result2={1} result3={4} emoji1="⛔" emoji2="📛" emoji3="⛔" />
            }
            textContent={
                <ErrorText
                    topMessage="Sorry but you can't access this page!"
                    errorCode="403"
                    bottomMessage="Forbidden"
                />
            }
        />
    );
}