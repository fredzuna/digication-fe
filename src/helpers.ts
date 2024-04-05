import { COLUMN_WIDTH, CONTAINER_WIDTH, GUTTER_SIZE } from './constants';
import ModuleInterface from './types/ModuleInterface';

export const moduleW2LocalWidth = (moduleW: number) =>
  moduleW * COLUMN_WIDTH - GUTTER_SIZE;
export const moduleX2LocalX = (moduleX: number) =>
  moduleW2LocalWidth(moduleX) + GUTTER_SIZE * 2;
export const moduleY2LocalY = (moduleY: number) => moduleY + GUTTER_SIZE;
export const getMaxModuleContainer = (width: number) => CONTAINER_WIDTH - width;
export const addGutterSize = (size: number) => size + GUTTER_SIZE;
export const removeGutterSize = (size: number) => size - GUTTER_SIZE;

export const checkOverlapping = (
  modulesArray: ModuleInterface[],
  newItem: ModuleInterface,
) => {
  const { coord: newCoord } = newItem;
  const overlapping = modulesArray.some((existingItem) => {
    if (existingItem.id !== newItem.id) {
      const { coord: oldCoord } = existingItem;

      const oldX = oldCoord.x;
      const oldY = oldCoord.y;

      const oldW = oldCoord.w;
      const oldH = oldCoord.h;

      const newW = newCoord.w;
      const newH = newCoord.h;

      return (
        newCoord.x < oldX + oldW &&
        newCoord.x + newW > oldX &&
        newCoord.y < oldY + oldH &&
        newCoord.y + newH > oldY
      );
    }

    return false;
  });

  return overlapping;
};

export const moduleWithPixelsData = (modules: ModuleInterface[]) => {
  const result = modules.map(({ id, coord: { x, y, w, h } }) => ({
    id,
    coord: {
      x: moduleX2LocalX(x),
      y: moduleY2LocalY(y),
      w: moduleW2LocalWidth(w),
      h,
    },
  }));
  return result;
};
