import { randomInt } from '../utils/randomUtils';

export type DiceRoll = [number, number];

export const rollDice = (): DiceRoll => {
  return [ randomInt(1, 6), randomInt(1, 6)];  
}