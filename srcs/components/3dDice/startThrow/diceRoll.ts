export function rollDice(sides: number = 6): number {
    return Math.floor(Math.random() * sides) + 1;
}

export function rollDiceWithMessage(sides: number = 6): number {
    const result = rollDice(sides);
    console.log(`Tirada del dado: ${result}`);
    return result;
}
