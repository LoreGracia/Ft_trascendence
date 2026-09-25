import { DICE_PRESETS, DICE_LEGENDARY_PRESETS } from "@/components/3dDice/modelDice/modelDice";

export const PRESET_OPTIONS = [
    { value: "default", label: "Default", group: "Basic" },
    { value: "redDice", label: "Red", group: "Basic" },
    { value: "blueDice", label: "Blue", group: "Basic" },
    { value: "greenDice", label: "Green", group: "Basic" },
    { value: "goldDice", label: "Gold", group: "Basic" },
    { value: "blackDice", label: "Black", group: "Basic" },
    { value: "legendary:standard", label: "Standard", group: "Legendary" },
    { value: "legendary:universe", label: "Universe", group: "Legendary" },
    { value: "legendary:pride", label: "Pride", group: "Legendary" },
    { value: "legendary:magician", label: "Magician", group: "Legendary" },
    { value: "legendary:warrior", label: "Warrior", group: "Legendary" },
    { value: "legendary:code", label: "Code", group: "Legendary" },
] as const;

export type DicePresetValue = (typeof PRESET_OPTIONS)[number]["value"];

export const getDicePreset = (value: string) => {
    if (value.startsWith("legendary:")) {
        const presetKey = value.replace("legendary:", "") as keyof typeof DICE_LEGENDARY_PRESETS;
        return DICE_LEGENDARY_PRESETS[presetKey] ?? DICE_PRESETS.default;
    }

    return DICE_PRESETS[value as keyof typeof DICE_PRESETS] ?? DICE_PRESETS.default;
};