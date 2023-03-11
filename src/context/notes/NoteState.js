import React,{useState} from "react";

import NoteContext from "./noteContext";


const NoteState = (props)=>{
  const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    //Fetch all notes
    const fetchNote = async ()=>{
      // Creat a Note via API Call
      //API Call
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
          'auth-token':localStorage.getItem('token')
        }
      });
      const json = await response.json()
      // eslint-disable-next-line 
      setNotes(json);

    }

      //Add a Note
      const addNote = async (title,description,tag)=>{
        // Creat a Note via API Call
        //API Call
        const response = await fetch(`${host}/api/notes/addnotes`, {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',
            'auth-token':localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag})
        });

        const note = await response.json();
        // eslint-disable-next-line 
        setNotes(notes.concat(note)) 
      }
      // Delete a Note
      const deleteNote = async(id)=>{
        //API call for deleting a note
        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type':'application/json',
            'auth-token':localStorage.getItem('token')
          }
        });
        // eslint-disable-next-line 
        const json = await response.json();
        
        //Deleting the notes from the front end 
        
        console.log("Deleting the note with id"+ id);
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
      }
      // Edit a Note
      const editNote= async(id,title,description,tag)=>{
        //API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type':'application/json',
            'auth-token':localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag})
        });
        // eslint-disable-next-line 
        const json = await response.json();
      
        //Logic for editing a note
        //Helps in making deep copy for notes since we cannot change the state directly thus we made a deeep copy of notes and change it....
        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id=== id){
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }
        }
        console.log(newNotes);
        setNotes(newNotes);
      }
    return(
        <NoteContext.Provider value = {{notes,addNote,deleteNote,editNote,fetchNote}}>{props.children}</NoteContext.Provider>
    )
}

export default NoteState;