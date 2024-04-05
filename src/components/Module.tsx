import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useDrag, useDragDropManager } from 'react-dnd';
import { useRafLoop } from 'react-use';
import ModuleInterface from '../types/ModuleInterface';
import { addGutterSize, checkOverlapping, getMaxModuleContainer, removeGutterSize } from '../helpers';
import PositionInterface from '../types/PositionInterface';

type ModuleProps = {
  data: ModuleInterface;
  onMove?: (id: number, position: PositionInterface) => void;
  modules: ModuleInterface[]
};

const Module = (props: ModuleProps) => {
  const { data: { id, coord: { x, y, w, h } }, onMove, modules } = props;

  // Transform x, y to left, top
  const [{ top, left }, setPosition] = useState<PositionInterface>(() => ({
    top: y,
    left: x,
  }));


  const dndManager = useDragDropManager();
  const initialPosition = React.useRef<{ top: number; left: number }>();

  // Use request animation frame to process dragging
  const [stop, start] = useRafLoop(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();

    if (!initialPosition.current || !movement) {
      return;
    }

    // create new position considering conditinals to do not move outside of the main container
    const maxModuleContainer = getMaxModuleContainer(w);
    const newTop = Math.max(0, initialPosition.current.top + movement.y);
    const newLeft = Math.max(0, Math.min(initialPosition.current.left + movement.x, maxModuleContainer));

    const newModule = { id, coord: { x: newLeft, y: newTop, w, h } };
    if (!checkOverlapping(modules, newModule)) {
      const newPosition = { top: newTop, left: newLeft };
      setPosition(newPosition);

      if (onMove) {
        onMove(id, newPosition);
      }
    }
  }, false);

  // Wire the module to DnD drag system
  const [, drag] = useDrag(() => ({
    type: 'module',
    item: () => {
      // Track the initial position at the beginning of the drag operation
      initialPosition.current = { top, left };

      // Start raf
      start();
      return { id };
    },
    end: stop,
  }), [top, left]);

  return (
    <Box
      ref={drag}
      display="flex"
      position="absolute"
      border={1}
      borderColor="grey.500"
      padding="10px"
      bgcolor="rgba(0, 0, 0, 0.5)"
      top={addGutterSize(top)}
      left={addGutterSize(left)}
      width={removeGutterSize(w)}
      height={removeGutterSize(h)}
      sx={{
        transitionProperty: 'top, left',
        transitionDuration: '0.1s',
        '& .resizer': {
          opacity: 0,
        },
        '&:hover .resizer': {
          opacity: 1,
        },
      }}
    >
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={40}
        color="#fff"
        sx={{ cursor: 'move' }}
        draggable
      >
        <Box sx={{ userSelect: 'none', pointerEvents: 'none' }}>{id}</Box>
      </Box>
    </Box>
  );
};

export default React.memo(Module);
