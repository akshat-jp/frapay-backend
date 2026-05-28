import Router from "router";
import express from "express";
import zod, { email } from "zod";
import {UserModel} from "../db.js";
import {AccountModel} from "../db.js";
import jwt from "jsonwebtoken"
import UserMiddleware from "../middlewares/usermiddleware.js"
import connectdb from "../connectdb.js";


import JWT_SECRET from "../config.js";

const router  = express.Router();





router.post("/signup", async (req,res)=>{
    
    try {
    await connectdb();
            
            // ... your existing code ...

        

    const UserDetails = zod.object({
        email: zod.string().email(),
        password: zod.string().min(6),
        firstname: zod.string().min(1),
        lastname: zod.string().min(1),
    })

    const body = req.body;

    const check = UserDetails.safeParse(body);

    if(!check.success){
        return res.status(400).json({
            msg : "incorrect credentials format"
        })
    }

    const UserCheck = await UserModel.findOne({
        $or: [
        { email: req.body.email },
        { firstname: req.body.firstname }
    ]   
    })

    if(UserCheck){
        if(UserCheck.email === req.body.email){
            return res.status(400).json({
            msg: "Email Already Exists",
        })
        }

        if(UserCheck.firstname === req.body.firstname){
            return res.status(400).json({
            msg: "Firstname Already Exists",
        })
        }
    
    }

    const NewUser = await UserModel.create({
        email : req.body.email,
        password : req.body.password,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
    })

    const userId = NewUser._id;

    const newaccount = await AccountModel.create({
        userId,
        balance : 1+ Math.random()*10000,
    })

    res.json({
        msg : "User Signed In Successfully",
        balance : newaccount.balance
    })

    } catch (err) {
            console.error("Signup error:", err.message); // ← this will show in Vercel logs
            return res.status(500).json({ msg: err.message });
        }

})

router.post("/signin", async (req,res)=>{

      try {
            await connectdb();
            
            

        


    const UserDetails = zod.object({
        email : zod.string().email().min(1),
        password : zod.string().min(6),
    })

    const body = req.body;

    const check = UserDetails.safeParse(body);

    if(!check.success){
        return res.status(400).json({
            msg : "Incorrect Credentials format"
        })
    }

    const UserCheck = await UserModel.findOne({
        email : req.body.email,
        password : req.body.password,
    })

    if(!UserCheck){
        return res.status(400).json({
            msg : "Incorrect Password Or Email"
        })
    } 

    const userId = UserCheck._id;

    

    const token = jwt.sign({
        userId,
    },JWT_SECRET);

    res.json({
        msg : "User Signed In Successfully",
        token : token,
    })

    } catch (err) {
            console.error("Signup error:", err.message); // ← this will show in Vercel logs
            return res.status(500).json({ msg: err.message });
        }
})

router.get("/bulk", UserMiddleware, async (req, res) => {

      try {
    await connectdb();

  try {
    let { filter } = req.query;

    if (filter) {
      filter = filter.trim().replace(/['"]/g, "");
    }

    let query = {};

    if (filter) {
      query = {
        $or: [
          { firstname: { $regex: filter, $options: "i" } },
          { lastname: { $regex: filter, $options: "i" } }
        ]
      };
    }

    const users = await UserModel.find(query).select("firstname lastname");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

    } catch (err) {
    console.error("Signup error:", err.message); // ← this will show in Vercel logs
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/me", UserMiddleware, async (req,res)=>{

      try {
    await connectdb();
    
    const user = await UserModel.findById(req.userId);

    res.json(user)

      } catch (err) {
    console.error("Signup error:", err.message); // ← this will show in Vercel logs
    return res.status(500).json({ msg: err.message });
  }
})

router.post("update",(req,res)=>{
    //no use...
})

export default router;