import { MatchRoom } from "./GameTypes";
import { countRepetitions, highestRollSum, allPlayersStand } from "./Utils";

//Shared
function updateStateToEndgame(match: MatchRoom, winScore: number) {
    const scores = Object.values(match.sum);
    const reps = countRepetitions(scores, winScore);
    for (const player of match.players) {
        const playerScore = match.sum[player.playerId] ?? 0;

        if (playerScore != winScore)
            player.state = "LOSE";
        else if (reps > 1)
            player.state = "TIE";
        else
            player.state = "WIN";
    }
}

//Free Play
export function verifyFreePlayWin(match: MatchRoom): boolean {
    if (match.turn + 1 >= match.players.length) {
        updateStateToEndgame(match, highestRollSum(match.sum));
        return true;
    }
    return false;
}

// Add42
export function verifyAdd42Win(match: MatchRoom): boolean {
    const scores: number[] = Object.values(match.sum);
    if (scores.includes(42)) {
        updateStateToEndgame(match, 42);
        return true;
    } else if (allPlayersStand(match.players)) {
        updateStateToEndgame(match, findClosestTo42(match.sum));
        return true;
    }
    return false;
}

function findClosestTo42(sum: Record<string, number>): number {
    let max: number = -1;

    for (const score of Object.values(sum)) {
        if (score <= 42 && score > max) {
            max = score;
        }
    }
    return max;
}