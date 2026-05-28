import express from "express";
import UserMiddleware from "../middlewares/usermiddleware.js";
import {AccountModel} from "../db.js"
import mongoose from "mongoose";
import connectdb from "../connectdb.js";

const router = express.Router();

router.get("/balance", UserMiddleware, async (req, res) => {

      try {
    await connectdb();
    
    const account = await AccountModel.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
      } catch (err) {
    console.error("Signup error:", err.message); // ← this will show in Vercel logs
    return res.status(500).json({ msg: err.message });
  }
})

router.post("/transfer", UserMiddleware, async (req, res) => {

      try {
    await connectdb();
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        const transferAmount = parseFloat(amount);

        if (!transferAmount || transferAmount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Invalid amount" });
        }

        const account = await AccountModel.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < transferAmount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        const toAccount = await AccountModel.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Account Not Found" });
        }

        await AccountModel.updateOne(
            { userId: req.userId },
            { $inc: { balance: -transferAmount } }
        ).session(session);

        await AccountModel.updateOne(
            { userId: to },
            { $inc: { balance: transferAmount } }
        ).session(session);

        await session.commitTransaction();
        res.json({ msg: "Transfer successful" });

    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ msg: "Transfer failed", error: err.message });
    } finally {
        session.endSession();
    }

     } catch (err) {
    console.error("Signup error:", err.message); // ← this will show in Vercel logs
    return res.status(500).json({ msg: err.message });
  }
});

export default router;