var Model = require('../Model/User.js');
var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

router.post('/submitEmployeesDetails',async function(req,res){
    const { fullName, phoneNumber, email, password ,confirmPassword} = req.body;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
    if (!passwordPattern.test(password)) {
        let errorMessage = "Password must meet the following criteria:";
        if (password.length < 8) {
          errorMessage += " At least 8 characters.";
        }
        if (!/[A-Z]/.test(password)) {
          errorMessage += " At least one uppercase letter.";
        }
        if (!/\d/.test(password)) {
          errorMessage += " At least one digit.";
        }
        if (!/[@#$%^&+=]/.test(password)) {
          errorMessage += " At least one special character (@, #, $, %, ^, &, +, =).";
        }
        
        return res.status(400).json({ message: errorMessage });
    }
    // else if (password !== confirmPassword) {
    //     return res.status(400).json({ message: "Passwords do not match" });
    // }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(password,10);
    const data = new Model({
        fullName,
        phoneNumber,
        email,
        password: hashedPassword,
        confirmPassword:hashedConfirmPassword // Store the hashed password
      });
    try{

        await data.save();
        res.status(200).json(data);
    }
    catch(error){
        if (error.code === 110) {
            res.status(400).json({ message: "Email address is already in use." });
          } else {
            res.status(500).json({ message: "Internal server error" });
          }
    }
});
router.get('/getAllEmployees',async(req,res)=>{
    //res.send("getallemployees");
    try{
        const data = await Model.find({}, { password: 0 ,confirmPassword:0});
        res.json(data);
    }
    catch(error){
        res.status(500).json(error.message);
    }
});
router.get(`/uniqueEmail`, async (req, res) => {
    try {
      const email = req.query.email;
  
      // Check if email is undefined or empty
      if (typeof email === 'undefined' || email.trim() === '') {
        return res.status(400).json({ error: 'Email address is required' });
      }
  
      // Check if email is valid
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }
  
      // Now that we've validated the email, we can proceed with the database query
      const user = await Model.findOne({ email });
      console.log('User found:', user);
  
      if (user && user.email === email) {
        // Email exists
        res.json({ exists: true });
      } else {
        // Email is unique
        res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.post('/login', async (req, res) => {
  
    try {
      // Find the user by email
      const { email, password } = req.body;

      const user = await Model.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed cannott find email email address' });
      }
      else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1min' });

        if (isPasswordValid) {
          res.status(200).json({token, message: 'Login successful' });
          console.log(secretKey);


        } else {
          res.status(401).json({ error: 'Authentication failed' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// router.post('/submitEMployeeDetails', async function(req,res){
//   const {fullName, email, phoneNumber,password}= req.body;
//   try{
//     const data = {
//       fullName,
//       email,
//       phoneNumber,
//       password
//     }
//     await data.save();
//     res.status(200).json(data);
//   }
//   catch(error){
//     req.status(500).json(data);
//   }
// })
// router.put('update/:id', async function(req, res){

//   const employeeid= req.params.id;
//   const updateemployeedetails = req.body;
//   try{
//     const data = await Model.findByIdAndUpdate(
//         employeeid,
//         updateemployeedetails,
//         {new:true},    
//       )
//           res.status(200).json(data);
//   }
//   catch(error){
//     res.status(500).json(error.message);
//   }
// })
// router.get('getAllEmployeeDetails', async function(req, res){
//   try{
//     const data = await Model.find();
//     res.status(200).json(data);
//   }
//   catch(error){
//     res.status(500).json(error.message);
//   }
// })
// router.delete('deleteDetails/:id', async function(req,res){
//   try{
//       const employeeid = req.params.id;
//   const deleteDetails = await Model.findByIdAndDelete(
//     employeeid,
//   )
//   if(!deleteDetails){
//     return res.status(400).json({message:'Employee Not found'});
//   }
//    return res.status(500).json({message:'employee details deleted'});
//   }
//   catch(error){
//     res.status(500).json(error.message);
//   }
// })
// const storage = multer.memoryStorage();
// const upload = multer({storage});
// router.post('/uploadImage',upload.single('image'),(req,res){
//   if(!req.file){
//     return res.status(400).json({error:"No file found"});
//   }
//   const {originalName, mimetype, buffer} = req.file;
//   const newImage = new Model({
//     fileName:originalName,
//     mimetype:mimetype,
//     data:buffer,
//   });
//   try{
//     await newImage.save();
//     res.status(200).json({error:"Image Uploaded Succefully"});
//   }
//   catch(error){
//     res.status(500).json(error.message);
//   }

// })
const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/uploadImage', upload.single('image'),async function(req,res){
  if(!req.file){
    return res.status(400).json({error:"Image not uploaded"});
  }  
  const {originalName, mimetype, buffer} = req.file;
  const newImage = new Model({
    fileName:originalName,
    mimetype:mimetype,
    data:buffer,
  });
  try{
    await newImage.save();
    res.status(200).json("Image Uploaded successfully");
  }
  catch(error){
    res.status.json(error.message);
  }
})
  // router.get('/user:id', authenticateUser, (req, res) => {
  //   const user = req.user;
  
  //   // Return user details
  //   res.json(user);
  // });
  
  // // Middleware for authenticating users
  // function authenticateUser(req, res, next) {
  //   // Check for a valid JWT in the request headers
  //   const token = req.headers.authorization;
  
  //   if (!token) {
  //     return res.status(401).json({ message: 'Authentication token not provided' });
  //   }
  
  //   try {
  //     // Verify and decode the JWT
  //     const decoded = jwt.verify(token, secretKey);
  
  //     // Find the user by ID (you can fetch user data from your database)
  //     const user = Model.find((u) => u.id === decoded.id);
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     // Attach the user object to the request for further use
  //     req.user = user;
  
  //     // Continue with the request
  //     next();
  //   } catch (error) {
  //     res.status(401).json({ message: 'Invalid token' });
  //   }
  // }
  
module.exports = router;