const express = require('express');
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const router = express.Router();
const { body, validationResult } = require('express-validator');

var jwt = require('jsonwebtoken');
const JWT_Secret = 'Aryanisagoodboy';
var fetchuser = require('../middleware/fetchuser');


//ROUTE-1: Create a user using: POST "/api/auth/createuser". No Login Required
router.post('/createuser', [
    body('name','Enter a valid Name').isLength({ min: 3 }),
    body('email','Enter a valid e-mail').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 6}),
], async (req,res)=>{
    let success= false;
    //If there are  errors, return Bad request and  the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    try {
    // Check Whether the user with this email exits already
    let user = await User.findOne({email: req.body.email});
    if (user){
        return res.status(400).json({success,errors:"Sorry a User with this emial already exists"})
    }
    //Adding salt to our password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

    //Create a new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
    
      const data = {
        user:{
            id:user.id
        } 
    }
    //sending token after checking creating user credentials
      const authtoken= jwt.sign(data,JWT_Secret);
      
    //   .then(user => res.json(user)).catch(err=> console.log(err))
    //   res.json({error:'Please enter a Unique value for email'})
    success=true;
    res.json({success, authtoken})
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
})

//ROUTE-2 : Authentication a user using: POST "/api/auth/login" no login required
router.post('/login', [
    body('email','Enter a valid e-mail').isEmail(),
    body('password','Password cannot be blank').exists(),
], async (req,res)=>{
    let success= false;
    //If there are  errors, return Bad request and  the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            success= false;
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success= false;
            return res.status(400).json({success, error:"Please try to login with correct credentials"});
        }
        const data = {
            user:{
                id:user.id
            } 
        }
        const authtoken= jwt.sign(data,JWT_Secret);
        success= true;
        res.json({success, authtoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send ("Internal Server Error")
    }
    })

    //ROUTE-3 : Get loggedin User Details using: POST "/api/auth/getuser" Login required
    router.post('/getuser', fetchuser, async(req,res) => {

        try {
            userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
module.exports = router