import React from 'react';
import { NoteProps } from '../types';

const Note = React.forwardRef<HTMLDivElement, NoteProps>(({  content, initialPosition, onMouseDown }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                left: `${initialPosition?.x}px`,
                top: `${initialPosition?.y}px`,
                border: '1px solid black',
                userSelect: 'none',
                padding: '10px',
                width: '250px',
                cursor: 'move',
                backgroundColor: 'lightyellow'
            }}
            onMouseDown={onMouseDown}
        >
            📌 {content}
        </div>
    );
});

export default Note;
