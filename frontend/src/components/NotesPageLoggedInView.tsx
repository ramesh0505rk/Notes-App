import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Note from '../components/Note';
import { Note as NoteModel } from '../models/note';
import * as NotesApi from '../network/notes_api';
import styleUtils from '../styles/utils.module.css';
import AddNoteDialog from "./AddNoteDialog";
import styles from '../styles/Notespage.module.css';

const NotesPageLoggedInView = () => {

    const [notes, setNotes] = useState<NoteModel[]>([])
    const [notesLoading, setNotesLoading] = useState(true)
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false)

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)

    useEffect(() => {
        async function loadNotes() {
            try {
                setShowNotesLoadingError(false)
                setNotesLoading(true)
                const notes = await NotesApi.fetchNotes()
                setNotes(notes)
            } catch (error) {
                console.log(error)
                setShowNotesLoadingError(true)
            } finally {
                setNotesLoading(false)
            }
        }
        loadNotes()
    }, [])

    async function deleteNote(note: NoteModel) {
        try {
            await NotesApi.deleteNote(note._id)
            setNotes(notes.filter(existingNote => existingNote._id !== note._id))
        }
        catch (error) {
            console.log(error)
            alert(error)
        }
    }

    const notesGrid = <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
        {notes.map(note => (
            <Col key={note._id}>
                <Note
                    className={styles.note}
                    note={note}
                    onNoteClicked={setNoteToEdit}
                    onDeleteNoteClicked={deleteNote}
                />
            </Col>
        ))}
    </Row>

    return (
        <>
            <Button onClick={() => setShowAddNoteDialog(true)} className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}>
                <FaPlus />
                Add new note
            </Button>
            {notesLoading && <Spinner animation='border' variant='primary' />}
            {showNotesLoadingError && <p className={styleUtils.errTexts}>Oops something went wrong 🥺 Plaease refresh the page 🩷</p>}
            {!notesLoading && !showNotesLoadingError &&
                <>
                    {
                        notes.length > 0
                            ? notesGrid
                            : <p className={styleUtils.errTexts}>You don't have any notes yet. Please create one ❤️</p>
                    }
                </>
            }

            {
                showAddNoteDialog &&
                <AddNoteDialog
                    onDismiss={() => setShowAddNoteDialog(false)} onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote])
                        setShowAddNoteDialog(false)
                    }} />
            }
            {
                noteToEdit &&
                <AddNoteDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updatedNote) => {
                        setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
                        setNoteToEdit(null)
                    }}
                />
            }
        </>
    );
}

export default NotesPageLoggedInView;