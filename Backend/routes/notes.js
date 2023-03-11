const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// Route 1: Get All the Notes using: Get "/api/notes/fetchallnotes" . Login Required
router.get('/fetchallnotes', fetchuser,async (req,res)=> {
    try {
    const notes = await Note.find({user:req.user.id});
    res.json(notes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

// Route 2: Add new Notes using: Post "/api/notes/addnotes" . Login Required
router.post('/addnotes', fetchuser,[
    body('title','Enter a valid title').isLength({ min: 3 }),
    body('description','description must be atleast 5 characters').isLength({ min: 6}),
],async (req,res)=> {
    try {
        const{title,description,tag}= req.body;
     //If there are  errors, return Bad request and  the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
    const note = new Note({
        title,description,tag,user: req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

// Route 3: Udpdating an existing Note using: PUT "/api/notes/addnotes" . Login Required
router.put('/updatenote/:id', fetchuser,async (req,res)=> {
    const {title,description, tag}= req.body;
    try {
    //Creating an Object
    const newNote = {};
    if(title){newNote.title= title};
    if(description){newNote.description= description};
    if(tag){newNote.tag= tag};

    //Find the note to be updated and update it 
    let note  = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})


// Route 4: Deleting an existing Note using: DELETE "/api/notes/deletenotes" . Login Required
router.delete('/deletenotes/:id', fetchuser,async (req,res)=> {
    try {
    //Find the note to be deleted and delete it 
    let note  = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    //Allow Deletion if only id user owns this Note
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted successfully",note:note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

module.exports = router