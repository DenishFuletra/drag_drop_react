import './App.css'
import { useState } from 'react'
import Notes from './components/notes'
import { NoteType } from './types';



function App() {

  const [notes, setNotes] = useState<NoteType[]>([
    {
      id: 1,
      text: 'this is the note number 1'
    },
    {
      id: 2,
      text: 'this is the note number 2'
    }
  ]
  )

  return (
    <div>
      <Notes notes={notes} setNotes={setNotes} />
    </div>

  )
}

export default App
