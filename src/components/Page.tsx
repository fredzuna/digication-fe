import React, { useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';

import Grid from './Grid';
import Module from './Module';
import { COLUMN_WIDTH, CONTAINER_WIDTH, GUTTER_SIZE } from '../constants';
import ModuleInterface from '../types/ModuleInterface';
import PositionInterface from '../types/PositionInterface';
import { removeModuleX2LocalX, removeModuleY2LocalY } from '../helpers';

const Page = () => {
  const [modules, setModules] = useState<ModuleInterface[]>([
    { id: 1, coord: { x: 1, y: 80, w: 2, h: 200 } },
    { id: 2, coord: { x: 5, y: 0, w: 3, h: 100 } },
    { id: 3, coord: { x: 4, y: 310, w: 3, h: 200 } },
  ]);

  const containerRef = useRef<HTMLDivElement>();

  // Wire the module to DnD drag system
  const [, drop] = useDrop({ accept: 'module' });
  drop(containerRef);


  // Calculate container height
  const containerHeight = useMemo(() => (
    Math.max(...modules.map(({ coord: { y, h } }) => y + h)) + GUTTER_SIZE * 2
  ), [modules]);

  const handleModuleMove = (id: number, newPosition: PositionInterface) => {
    const { top, left } = newPosition;

    if (!containerRef.current) return;

    const index = modules.findIndex(item => item.id === id);
    if (index !== -1) {
      const updatedModules = [...modules];
      updatedModules[index].coord.x = left / COLUMN_WIDTH; // TODO we need create a function to handle COLUMN_WIDTH
      updatedModules[index].coord.y = top;

      console.log(updatedModules)

      setModules(updatedModules);
    }
  };

  return (
      <Box
        ref={containerRef}
        position="relative"
        width={CONTAINER_WIDTH}
        height={containerHeight}
        margin="auto"
        sx={{
          overflow: 'hidden',
          outline: '1px dashed #ccc',
          transition: 'height 0.2s',
        }}
      >
        <Grid height={containerHeight} />
        {modules.map((module) => (
          <Module key={module.id} data={module} modules={modules} onMove={handleModuleMove} />
        ))}
      </Box>
  );
};

export default React.memo(Page);