"use client";

import ErrorLayout from "@/components/Error/ErrorLayout";
import ErrorText from "@/components/Error/ErrorText";
import DiceErrorContinuous from "@/components/Error/DiceErrorContinuous";

export default function Error500() {
    return (
        <ErrorLayout
            children={
                <DiceErrorContinuous />
            }
            textContent={
                <ErrorText
                    topMessage="Something went wrong!"
                    errorCode="500"
                    bottomMessage="Internal Server Error"
                />
            }
        />
    );
}