import { DICE_PRESETS, DICE_LEGENDARY_PRESETS } from "@/components/3dDice/modelDice/modelDice";

export const PRESET_OPTIONS = [
    { value: "default", label: "Default", group: "Básicos" },
    { value: "redDice", label: "Rojo", group: "Básicos" },
    { value: "blueDice", label: "Azul", group: "Básicos" },
    { value: "greenDice", label: "Verde", group: "Básicos" },
    { value: "goldDice", label: "Dorado", group: "Básicos" },
    { value: "blackDice", label: "Negro", group: "Básicos" },
    { value: "legendary:universe", label: "Universe", group: "Legendarios" },
    { value: "legendary:pride", label: "Pride", group: "Legendarios" },
    { value: "legendary:magician", label: "Magician", group: "Legendarios" },
    { value: "legendary:warrior", label: "Warrior", group: "Legendarios" },
    { value: "legendary:code", label: "Code", group: "Legendarios" },
] as const;

export type DicePresetValue = (typeof PRESET_OPTIONS)[number]["value"];

export const getDicePreset = (value: string) => {
    if (value.startsWith("legendary:")) {
        const presetKey = value.replace("legendary:", "") as keyof typeof DICE_LEGENDARY_PRESETS;
        return DICE_LEGENDARY_PRESETS[presetKey] ?? DICE_PRESETS.default;
    }

    return DICE_PRESETS[value as keyof typeof DICE_PRESETS] ?? DICE_PRESETS.default;
};