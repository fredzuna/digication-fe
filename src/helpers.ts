import { COLUMN_WIDTH, CONTAINER_WIDTH, GUTTER_SIZE } from './constants';
import ModuleInterface from './types/ModuleInterface';

export const moduleW2LocalWidth = (moduleW: number) => moduleW * COLUMN_WIDTH - GUTTER_SIZE;
export const moduleX2LocalX = (moduleX: number) => moduleW2LocalWidth(moduleX) + GUTTER_SIZE * 2;
export const moduleY2LocalY = (moduleY: number) => moduleY + GUTTER_SIZE;
export const getMaxModuleContainer = (width: number) => CONTAINER_WIDTH - moduleW2LocalWidth(width);

export const removeModuleW2LocalWidth = (moduleW: number) => (moduleW / COLUMN_WIDTH) - GUTTER_SIZE;
export const removeModuleY2LocalY = (moduleY: number) => moduleY - GUTTER_SIZE;
export const removeModuleX2LocalX = (moduleX: number) => removeModuleW2LocalWidth(moduleX) - GUTTER_SIZE * 2;

export const checkOverlapping = (modulesArray: ModuleInterface[], newItem: ModuleInterface) => {
  const { coord: newCoord } = newItem;
  const overlapping = modulesArray.some((existingItem) => {
    if (existingItem.id !== newItem.id) {

      const { coord: oldCoord } = existingItem;

      const oldX = moduleX2LocalX(oldCoord.x);
      const oldY = moduleY2LocalY(oldCoord.y);

      const oldW = moduleW2LocalWidth(oldCoord.w);
      const oldH = oldCoord.h;

      const newW = moduleW2LocalWidth(newCoord.w);
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
