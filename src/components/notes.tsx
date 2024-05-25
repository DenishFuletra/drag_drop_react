import React, { useEffect, useRef } from 'react';
import Note from './note';
import { NotesProps, NoteType } from '../types';

const Notes: React.FC<NotesProps> = ({ notes, setNotes }) => {
    useEffect(() => {
        // local storage logic
        const savedNotes: NoteType[] = JSON.parse(localStorage.getItem('notes') || '[]');

        const updatedNotes: NoteType[] = notes.map((note) => {
            const savedNote = savedNotes.find((n) => n.id === note.id);
            if (savedNote) {
                return { ...note, position: savedNote.position };
            } else {
                const position = determineNewPosition();
                return { ...note, position };
            }
        });

        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [notes.length, setNotes]);

    const noteRefs = useRef<(HTMLDivElement | null)[]>([]);

    const determineNewPosition = () => {
        const maxX = window.innerWidth - 250;
        const maxY = window.innerHeight - 250;

        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    };

    const handleDragStart = (note: NoteType, e: React.MouseEvent) => {
        const { id } = note;
        const noteRef = noteRefs.current[id];
        let rect: any;

        if (noteRef) {
            rect = noteRef.getBoundingClientRect();
            console.log(rect);
            const offSetX = e.clientX - rect.left;
            const offSetY = e.clientY - rect.top;
            console.log(offSetX, offSetY);
            // console.log(e);

            const startPos = note;

            const updateNotePosition = (id: number, newPosition: NoteType['position']) => {

                const updatedNotes = notes.map((note) => note.id === id ? { ...note, position: newPosition } : note);
                setNotes(updatedNotes);
                localStorage.setItem('notes', JSON.stringify(updatedNotes));
            }
            const checkOverLap = (id: number) => {
                const currentNoteRef = noteRefs.current[id];
                const currentRect = currentNoteRef?.getBoundingClientRect();

                if (!currentRect) return false;

                return notes.some((note) => {
                    if (note.id === id) {
                        return false;
                    }
                    const otherNoteRef = noteRefs.current[note.id];
                    const otherRect = otherNoteRef?.getBoundingClientRect();

                    if (!otherRect) return false;

                    // Check for overlap
                    const overLap = !(
                        currentRect.right < otherRect.left ||
                        currentRect.left > otherRect.right ||
                        currentRect.bottom < otherRect.top ||
                        currentRect.top > otherRect.bottom
                    );

                    return overLap;
                });
            };


            const handleMouseMove = (e: MouseEvent) => {
                let newX = e.clientX - offSetX;
                let newY = e.clientY - offSetY;
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                console.log('newx, newy', newX, newY);

                noteRef.style.left = `${newX}px`;
                noteRef.style.top = `${newY}px`;

            }
            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);

                const finalRect = noteRef.getBoundingClientRect();
                const newPosition = { x: finalRect.left, y: finalRect.top };
                if (checkOverLap(id)) {
                    noteRef.style.left = `${startPos.position?.x}px`;
                    noteRef.style.top = `${startPos.position?.y}px`;

                } else {
                    updateNotePosition(id, newPosition);
                }
            }

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
    };

    const handleSubmit = () => {
        const inputElement: any = document.getElementById('noteInput');

        if (inputElement) {
            const noteText = inputElement.value;
            const note: NoteType = {
                id: +notes[notes.length - 1].id + 1,
                text: noteText,
                position: determineNewPosition()
            }
            setNotes([...notes, note]);
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto',
                marginTop: '20px',
                padding: '10px',
                width: '50%',
                maxWidth: '400px'
            }}>
                <input
                    id='noteInput'
                    type="text"
                    placeholder='Enter the note here'
                    style={{
                        flex: '1',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginRight: '10px',
                        fontSize: '16px'
                    }}
                />
                <button
                    type="button"
                    style={{
                        padding: '8px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                    onClick={() => handleSubmit()}
                >
                    Submit
                </button>
            </div>
            <div>
                {notes.length > 0 &&
                    notes.map((elem) => (
                        <Note
                            key={elem.id}
                            ref={(el) => (noteRefs.current[elem.id] = el)}
                            onMouseDown={(e) => handleDragStart(elem, e)}
                            id={elem.id}
                            initialPosition={elem.position}
                            content={elem.text}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Notes;
