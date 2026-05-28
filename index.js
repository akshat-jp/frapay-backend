import express from "express";
import Router from "router";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

import UserRouter from "./routes/userrouter.js";
import MainRouter from "./routes/mainrouter.js";
import AccountsRouter from "./routes/accounts.js"

app.use("/api/v1",MainRouter);
app.use("/api/v1/user",UserRouter);
app.use("/api/v1/accounts", AccountsRouter);

app.listen(3000);