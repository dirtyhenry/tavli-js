import { DiceRoll } from './dice';

// A name for a point, ie 1 to 24.
type PointName = number;

// A count of checkers, ie 0 to 15.
type CheckersCount = number;

type PointDescriptor = [PointName, CheckersCount];

// White is moving 23 -> 0
// Black is moving 0 -> 23
export enum Player { White, Black };

interface PointsHolder {
  [Player.White]: CheckersCount,
  [Player.Black]: CheckersCount 
};

interface BoardState {
  bar: PointsHolder; 
  off: PointsHolder;
  points: PointsHolder[];
}

const EMPTY_POINT = { [Player.White]: 0, [Player.Black]: 0};

export const initialState = (): BoardState => {
  const initialPointsState = Array(24).fill(EMPTY_POINT);

  const initialConfig: PointDescriptor[] = [[24, 2], [8, 3], [13, 5], [6, 5]];
  initialConfig.forEach(([pointName, checkersCount]) => {
    initialPointsState[pointName - 1] = { [Player.White]: checkersCount, [Player.Black]: 0 };
    initialPointsState[24 - (pointName)] = { [Player.White]: 0, [Player.Black]: checkersCount};
  });

  return {
    bar: EMPTY_POINT,
    off: EMPTY_POINT,
    points: initialPointsState,
  };
}

export const nextPossibleStates = (fromState: BoardState, player: Player, diceRoll: DiceRoll): BoardState[] => {
  const allDicesToPlay = (diceRoll[0] === diceRoll[1]) ? [...diceRoll] : [...diceRoll, ...diceRoll];

  return nextPossibleStatesWithManyDice(fromState, player, allDicesToPlay);
} 

const nextPossibleStatesWithManyDice = (fromState: BoardState, player: Player, dicesLeftToPlay: number[]): BoardState[] => {
  if (dicesLeftToPlay.length === 0) {
    return [fromState];
  } else {
    return dicesLeftToPlay.map((diceValue, diceIndex) => {
      const newDicesLeftToPlay = [...dicesLeftToPlay];
      newDicesLeftToPlay.splice(diceIndex, 1);

      const allPossibleStatesPlaying1Dice: BoardState[] = nextPossibleStatesWithOneDice(fromState, player, diceValue);
      const allPossibleStatesPlayingLeftDice: BoardState[] = allPossibleStatesPlaying1Dice.map((newState) => {
        return nextPossibleStatesWithManyDice(newState, player, newDicesLeftToPlay);
      }).reduce((acc, newValues) => ([...acc, ...newValues]), []);

      return allPossibleStatesPlayingLeftDice;
    }).reduce((acc, newValues) => ([...acc, ...newValues]), []);
  }
}

const nextPossibleStatesWithOneDice = (fromState: BoardState, player: Player, diceNumber: number): BoardState[] => {
  // If the player has at least 1 checker on the bar, this dice roll MUST be used to put 
  // the checker back in the game.
  if (fromState.bar[player] > 0) { 
    return []; // TODO: implement this!
  } else {
    const startPositions: number[] = fromState.points.map((state, index) => {
      return state[player] > 0 ? index : -1
    }).filter((index) => (index >= 0));
    
    // Since White is moving 23 -> 0, it can bear off when the max index is 5
    // Since Black is moving 0 -> 23, it can bear off when the min index is 18 
    const isAbleToBearOff = (player === Player.White) ? Math.max(...startPositions) <= 5 : Math.min(...startPositions) >= 18

    return startPositions.map((fromIndex, index, array) => {
      const toIndex = (player === Player.White) ? fromIndex - diceNumber : fromIndex + diceNumber;
      if (isValidDestinationIndex(fromState, player, toIndex)) {
        const newPoints = [...fromState.points];
        newPoints[fromIndex][player] = newPoints[fromIndex][player] - 1;
        newPoints[toIndex][player] = newPoints[toIndex][player] + 1; 
        return [{
          ...fromState,
          points: newPoints
        }];
      } else if (isAbleToBearOff) {
        const newPoints = [...fromState.points];
        newPoints[fromIndex][player] = newPoints[fromIndex][player] - 1;
        const newOffs = { ...fromState.off };
        newOffs[player] = newOffs[player] + 1;
        return [{
          ...fromState,
          off: newOffs,
          points: newPoints
        }];
      } else {
        return [];
      }
    }).reduce((acc, newValues) => ([...acc, ...newValues]), []);
  }
}

const isValidDestinationIndex = (fromState: BoardState, player: Player, index: number): boolean => {
  if (index < 0 || index > 23) {
    return false;
  }

  const targetPoint = fromState.points[index];
  return ((player === Player.White) ? targetPoint[Player.Black] : targetPoint[Player.White]) < 2;
}