const express = require('express')
const User= require("../models/user")
const bcrypt = require('bcrypt');
const router=express.Router()
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const getUser = require('../middleware/getUser')


// Route 1 : Sign up for user ----> Creation of new user.
router.post('/signup',
body('username',"username must be of atleast 6 characters.").isLength({min:6}),
body('email',"Invalid email").isEmail(),
body('password',"password must be of atleast 8 characters.").isLength({min:8}) ,
(req, res)=>{
    const addUser = async(req)=>{
        let user= await User.findOne({email:req.body.email,username:req.body.username})
        console.log(user)
        if(user){
            res.status(400).send({success:false,error:"User already exists , change username or email"})
        }else{
            var JWT_SECRET = "udayisg$$db@y"
            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(req.body.password, salt);
            try {
                const addUser=await User.create({username:req.body.username,
                    email:req.body.email,
                    password:hashPass})
                const id={id:addUser._id}
                const newUserAuthToken= jwt.sign(id,JWT_SECRET)
                // console.log(newUserAuthToken)
                res.send({authtoken:newUserAuthToken,success:true})

            } catch (error) {
                res.send({success:false,message:error.message})
            }

                // .then(user => res.send({success:true,user:user}))
                // .catch(err => res.send({success:false,message:err.message}))
        }
    }
    // If any errors are foung it responds it with status code 400
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:false,errors: errors.array() });
    }else{
        addUser(req)
    }
    // console.log(req.body)
    // User.create({
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: req.body.password,
    // }).then(user => res.json(user))
    // .catch(err => res.json({error:"User already exists",msg:err}));
})

// Route 2 : login for user ----> Verification of new user.
router.post('/login',body('email').isEmail(), async (req, res) =>{

    var JWT_SECRET = "udayisg$$db@y"
    
    const user=await User.findOne({email:req.body.email})
    if (user) {
        let validatePassword=await bcrypt.compare(req.body.password,user.password)
        if(validatePassword){
            let data={
                id:user.id
            }
            const authToken= jwt.sign(data,JWT_SECRET)
            res.json({success:true,"authtoken":authToken})
        }
        else{
            res.status(403).json({success:false,"error":"Invalid password"})
        }
    } else {
        res.status(403).json({success:false,"error":"User with email doesn't exist"})
    }
})



// Route 3 : Getting user from auth token

router.post('/getuser',getUser, async (req, res) =>{
    try {
        console.log(req.user.id)
        const getUserFromDb=await User.findById(req.user.id).select({"password":0})
        res.send(getUserFromDb)
    } catch (error) {

        res.status(401).send({"error":error})
    }
})

module.exports=router;