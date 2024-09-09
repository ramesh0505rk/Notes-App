import { Button, Container, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NotesApi from '../network/notes_api'
import styles from '../styles/Notespage.module.css'
import TextInputField from "./form/TextInputField";

interface AddNoteDialogProps {
    noteToEdit?: Note
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void
}

const AddNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddNoteDialogProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || '',
            text: noteToEdit?.text || ''
        }
    })

    async function onSubmit(input: NoteInput) {
        try {

            let noteResponse: Note
            if (noteToEdit) {
                noteResponse = await NotesApi.updateNote(noteToEdit._id, input)
            }
            else {
                noteResponse = await NotesApi.createNote(input)
            }
            onNoteSaved(noteResponse)
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? 'Edit note ✍️' : 'Add note 👾'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addNewNote" onSubmit={handleSubmit(onSubmit)}>

                    <TextInputField
                        name="title"
                        label="Title"
                        type='text'
                        placeholder='Title'
                        register={register}
                        registerOptions={{required:'Required'}}
                        error={errors.title}
                    />

                    <TextInputField
                        name='text'
                        label="Note"
                        as='textarea'
                        rows={5}
                        type='text'
                        placeholder='Write your note 😊'
                        register={register}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" form="addNewNote" disabled={isSubmitting} className={styles.blockSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddNoteDialog;