import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';

const firebaseConfig = {
  apiKey: "AIzaSyAnpUgeckZ73aQGdaCjXgLzJ40FQKYGif4",
  authDomain: "my-app-notes-a0f4c.firebaseapp.com",
  projectId: "my-app-notes-a0f4c",
  storageBucket: "my-app-notes-a0f4c.appspot.com",
  messagingSenderId: "607541200108",
  appId: "1:607541200108:web:6e66c952eac53a1726d1c9"
};

firebase.initializeApp(firebaseConfig);

const NotesApp = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);

  useEffect(() => {
    const notesRef = firebase.database().ref('notes');
    notesRef.on('value', (snapshot) => {
      const notes = snapshot.val();
      const notesList = [];
      for (let id in notes) {
        notesList.push({ id, ...notes[id] });
      }
      setNotes(notesList);
    });
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (note.trim()) {
      if (editNoteId) {
        handleUpdateNote(editNoteId, note);
        setEditNoteId(null);
      } else {
        firebase.database().ref('notes').push({
          content: note,
        });
      }
      setNote('');
    }
  };

  const handleEditNote = (id, content) => {
    setNote(content);
    setEditNoteId(id);
  };

  const handleUpdateNote = (id, content) => {
    firebase.database().ref(`notes/${id}`).update({
      content: content,
    });
  };

  const handleDeleteNote = (id) => {
    firebase.database().ref(`notes/${id}`).remove();
  };

  const handleCancelEdit = () => {
    setNote('');
    setEditNoteId(null);
  };

  return (
    <div className="card mx-auto mt-5 shadow" style={{ width: '480px', height: '550px', backgroundColor: '#FFF59E' }}>
      <div className="card-header bg-dark text-white">
        <h3 className="card-title mb-0">My Notes</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleAddNote}>
          <div className="mb-3">
            <label htmlFor="note" className="form-label">New Note:</label>
            <textarea
              id="note"
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className='d-flex justify-content-end'>
          {editNoteId ?
            <>
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button type="submit" className="btn btn-dark">
                Update Note
              </button>
            </>
            :
            <button type="submit" className="btn btn-dark">
              Add Note
            </button>
          }
          </div>
        </form>
        <hr />
        <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
          <table className="table table-responsive">
            <thead>
              <tr>
                <th>Note</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '80%'}}>{note.content}</td>
                  <td>
                    <div className='d-flex justify-content-end'>
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => handleEditNote(note.id, note.content)}>
                    Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteNote(note.id)}>
                    Delete
                    </button>
                    </div>
                  </td>
                 </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      );
    };

export default NotesApp;