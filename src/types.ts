export type NoteType = {
    id: number;
    text: string;
    position?: { x: number; y: number };
};

export type NoteProps = {
    id: number;
    content: string;
    initialPosition?: { x: number; y: number };
    onMouseDown?: (params: any) => void;
};

export type NotesProps = {
    notes: NoteType[];
    setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
};
