import { MatchRoom, WaitingRoom, GameType } from "./GameTypes"
import { isPlayerBusted, createMatchRoom } from "./DiceGame"
import { verifyFreePlayWin, verifyAdd42Win } from "./Rules"

// Product/Rules
export interface GameRules {
    evaluateRoll(match: MatchRoom, playerId: string): void;
    isGameWon(match: MatchRoom): boolean;
}

export class FreePlayRules implements GameRules {
    evaluateRoll(): void { };
    isGameWon(match: MatchRoom): boolean {
        return verifyFreePlayWin(match);
    }
}

export class Add42Rules implements GameRules {
    evaluateRoll(match: MatchRoom, playerId: string): void {
        isPlayerBusted(match, playerId);
    };
    isGameWon(match: MatchRoom) {
        return verifyAdd42Win(match);
    }
}

// Factory
export abstract class GameFactory {
    abstract createRules(): GameRules;
    createMatch(room: WaitingRoom): MatchRoom {
        return createMatchRoom(room, this.createRules());
    }
}

export class FreePlayFactory extends GameFactory {
    createRules(): GameRules {
        return new FreePlayRules();
    }
}

export class Add42Factory extends GameFactory {
    createRules(): GameRules {
        return new Add42Rules();
    }
}

export function getGameFactory(gameType: GameType): GameFactory {
    switch (gameType) {
        case "FREE_PLAY":
            return new FreePlayFactory();
        case "ADD42":
            return new Add42Factory();
        default:
            throw new Error("Game Type not allowed.");
    }
}