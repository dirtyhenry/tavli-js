import { initialState, nextPossibleStates, Player } from './board'; 

const initialBoardState = { "bar": { "0": 0, "1": 0}, "off": { "0": 0, "1": 0 }, points: [
  { "0": 0, "1": 2 }, // 0
  { "0": 0, "1": 0 }, // 1
  { "0": 0, "1": 0 }, // 2
  { "0": 0, "1": 0 }, // 3
  { "0": 0, "1": 0 }, // 4
  { "0": 5, "1": 0 }, // 5
  { "0": 0, "1": 0 }, // 6
  { "0": 3, "1": 0 }, // 7
  { "0": 0, "1": 0 }, // 8
  { "0": 0, "1": 0 }, // 9
  { "0": 0, "1": 0 }, // 10
  { "0": 0, "1": 5 }, // 11
  { "0": 5, "1": 0 }, // 12
  { "0": 0, "1": 0 }, // 13
  { "0": 0, "1": 0 }, // 14
  { "0": 0, "1": 0 }, // 15
  { "0": 0, "1": 3 }, // 16
  { "0": 0, "1": 0 }, // 17
  { "0": 0, "1": 5 }, // 18
  { "0": 0, "1": 0 }, // 19
  { "0": 0, "1": 0 }, // 20
  { "0": 0, "1": 0 }, // 21
  { "0": 0, "1": 0 }, // 22
  { "0": 2, "1": 0 }  // 23
]}

describe('The board', () => {
  it('renders the right initial state', () => {
    const state = initialState();
    expect(state).toEqual(initialBoardState);
  })

  it('knows how to move from the white positions', () => {
    const nextStates = nextPossibleStates(initialBoardState, Player.White, [1, 2]);
    expect(nextStates.length).toBe(7);
  })
})
