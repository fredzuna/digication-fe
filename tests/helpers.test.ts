import { COLUMN_WIDTH, GUTTER_SIZE } from '../src/constants';
import {
  checkOverlapping,
  moduleW2LocalWidth,
} from '../src/helpers';
import ModuleInterface from '../src/types/ModuleInterface';

describe('helpers', () => {
  test('moduleW2LocalWidth', () => {
    const w = 2;
    expect(moduleW2LocalWidth(w)).toEqual(w * COLUMN_WIDTH - GUTTER_SIZE);
  });

  test('should return true if there is overlapping', () => {
    const modulesArray: ModuleInterface[] = [
      { id: 1, coord: { x: 0, y: 0, w: 50, h: 50 } },
      { id: 2, coord: { x: 40, y: 40, w: 50, h: 50 } },
    ];
    const newItem: ModuleInterface = {
      id: 3,
      coord: { x: 30, y: 30, w: 50, h: 50 },
    };

    const result = checkOverlapping(modulesArray, newItem);

    expect(result).toBe(true);
  });

  test('should return false if there is no overlapping', () => {
    const modulesArray: ModuleInterface[] = [
      { id: 1, coord: { x: 0, y: 0, w: 50, h: 50 } },
    ];
    const newItem: ModuleInterface = {
      id: 3,
      coord: { x: 60, y: 60, w: 50, h: 50 },
    };
  
    const result = checkOverlapping(modulesArray, newItem);
  
    expect(result).toBe(false);
  });
});
