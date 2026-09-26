"use client";

import ErrorLayout from "@/components/Error/ErrorLayout";
import ErrorText from "@/components/Error/ErrorText";
import DiceErrorContinuous from "@/components/Error/DiceErrorContinuous";

export default function Error503() {
    return (
        <ErrorLayout
            children={
                <DiceErrorContinuous
                    result1={1}
                    result2={1}
                    result3={1}
                    faceEmojis1={{
                        1: "⚠️",
                        2: "🔧",
                        3: "⚡",
                        4: "🔴",
                        5: "❌",
                        6: "🚫",
                    }}
                    faceEmojis2={{
                        1: "🌐",
                        2: "💻",
                        3: "📡",
                        4: "🔌",
                        5: "⚙️",
                        6: "🛠️",
                    }}
                    faceEmojis3={{
                        1: "🔄",
                        2: "⏳",
                        3: "⏸️",
                        4: "🔁",
                        5: "⌛",
                        6: "⏱️",
                    }}
                />
            }
            textContent={
                <ErrorText
                    topMessage="Service Temporarily Unavailable"
                    errorCode="503"
                    bottomMessage="Service Unavailable"
                />
            }
        />
    );
}