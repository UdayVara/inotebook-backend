const express = require('express')
const User= require("../models/user")
const Notes= require("../models/notes")
const router=express.Router()
const { body, validationResult } = require('express-validator');
const getUser = require('../middleware/getUser');
const { get } = require('mongoose');


// Route 1 : Adding new note ----> Creation of new Note.
router.post('/addnote',getUser,
body('title',"Title must be atleast of 3 characters.").isLength({min:3}),
body('description',"description must be of atleast 8 characters.").isLength({min:8}) ,
async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }else{
        try {
            
            const user=await User.findById(req.user.id)
        const newNote= await Notes.create({
            user:user.id,
            title:req.body.title,
            description:req.body.description,
            tags:req.body.tags
        })
        res.send(newNote);
        } catch (error) {
            res.status(404).send("Internal server error." + error)
        }
        
    }
})



// Route 2 : Updating an existing User ----> updating of Existing Note.
router.post('/updatenote/:id',getUser,
body('title',"Title must be atleast of 3 characters.").isLength({min:3}),
body('description',"description must be of atleast 8 characters.").isLength({min:8}) ,
async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }else{
        try {
            // console.log(req.params.id.toString())
        let note=await Notes.findById(req.params.id.toString())
        // console.log(note)
        if(note){
            if (note.user.toString() === req.user.id) {
                const updateNote=await Notes.findByIdAndUpdate(req.params.id,{$set:{title:req.body.title,
                description:req.body.description,
                tags:req.body.tags,
                date:Date.now()}},{new:true})
                
                res.send(updateNote)
            }else{
                res.status(401).send("acess not allowed")
            }
        }else{
            res.status(401).send("Note not found")
        }
        } catch (error) {
            res.status(404).send("Internal server error." + error)
        }
        
    }
})

// Route 3 : To delete note
router.post('/deletenote/:id',getUser,
async(req, res)=>{
    try {
        
        let note=await Notes.findById(req.params.id.toString())
            // console.log(note)
            if(note){
                if (note.user.toString() === req.user.id) {
                    const deleteNote=await Notes.findByIdAndDelete(req.params.id)
                    res.send(deleteNote)
                }else{
                    res.status(401).send("acess not allowed")
                }
            }else{
                res.status(401).send("Note not found")
            }
    } catch (error) {
        res.status(404).send("Internal server error." + error)
    }
    
})

// Route : 4 Fetch all notes of particular User.
router.post('/fetchnotes',getUser,
async(req, res)=>{
    try {
        
        let notes=await Notes.find({user:req.user.id})
        if (notes) {
            res.send(notes)
        } else {
            res.status(404).send("Notes not found")
        }
            // console.log(note)
        
    } catch (error) {
        res.status(404).send("Internal server error." + error)
    }
    
})

module.exports=router;