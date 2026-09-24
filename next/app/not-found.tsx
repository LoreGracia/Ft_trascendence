"use client";

import ErrorLayout from "@/components/Error/ErrorLayout";
import ErrorText from "@/components/Error/ErrorText";
import DiceErrorTriple from "@/components/Error/DiceErrorTriple";

export default function Error404() {
    return (
        <ErrorLayout
            children={
                <DiceErrorTriple result1={4} result2={1} result3={4} emoji2="❌" />
            }
            textContent={
                <ErrorText
                    topMessage="Whoa, where are you going?"
                    errorCode="404"
                    bottomMessage="Page Not Found"
                />
            }
        />
    );
}