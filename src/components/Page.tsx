import React, { useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import Grid from './Grid';
import Module from './Module';
import { CONTAINER_WIDTH, GUTTER_SIZE } from '../constants';
import ModuleInterface from '../types/ModuleInterface';
import PositionInterface from '../types/PositionInterface';
import { moduleWithPixelsData } from '../helpers';

const Page = () => {

  const moduleData = [
    { id: 1, coord: { x: 1, y: 80, w: 2, h: 200 } },
    { id: 2, coord: { x: 5, y: 0, w: 3, h: 100 } },
    { id: 3, coord: { x: 4, y: 310, w: 3, h: 200 } },
  ];

  const [modules, setModules] = useState<ModuleInterface[]>(moduleWithPixelsData(moduleData));

  const containerRef = useRef<HTMLDivElement>();

  // Wire the module to DnD drag system
  const [, drop] = useDrop({ accept: 'module' });
  drop(containerRef);


  // Calculate container height
  const containerHeight = useMemo(() => (
    Math.max(...modules.map(({ coord: { y, h } }) => y + h)) + GUTTER_SIZE
  ), [modules]);

  const handleModuleMove = (id: number, newPosition: PositionInterface) => {
    const { top, left } = newPosition;

    if (!containerRef.current) return;

    const index = modules.findIndex(item => item.id === id);
    if (index !== -1) {
      const updatedModules = [...modules];
      updatedModules[index].coord.x = left; // TODO we need create a function to handle COLUMN_WIDTH
      updatedModules[index].coord.y = top;

      setModules(updatedModules);
    }
  };

  return (
      <Box
        ref={containerRef}
        position="relative"
        width={CONTAINER_WIDTH + GUTTER_SIZE}
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