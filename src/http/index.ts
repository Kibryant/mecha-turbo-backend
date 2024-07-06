import cors from "cors";
import { connect } from "../lib/db/connect";
import userModel from "../lib/db/models/userModel";
import { server } from "../lib/server";
import { config } from "dotenv";
import express from "express";
import adminModel from "../lib/db/models/adminModel";
import { HttpStatusCode } from "../types/http-status-code";
import { compareHash, hash } from "../lib/hash";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";

config();

const jwtMiddleware = expressjwt({
  secret: process.env.JWT_SECRET_KEY || "",
  algorithms: ["HS256"],
  // @ts-ignore
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({ path: ["/login"] })

server.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

server.use(express.json());

server.use(jwtMiddleware);

const MONGODB_URI = process.env.MONGODB_URI || "";

connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
});

server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const isAdmin = await adminModel.findOne({ email });

    if (isAdmin) {
      // const isValidPassword = await compareHash(password, isAdmin.password);

      // if (!isValidPassword) {
      //   return res.json({
      //     message: "Credências Inválidas.",
      //     status: HttpStatusCode.UNAUTHORIZED,
      //   });
      // }

      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY || "");

      return res.json({
        isAdmin: true,
        message: "Admin logado com sucesso.",
        status: HttpStatusCode.OK,
        token,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({
        message: "Usuário não encontrado.",
        status: HttpStatusCode.NOT_FOUND,
      });
      return;
    }

    const isValidPassword = await compareHash(password, user.password);

    if (!isValidPassword) {
      return res.json({
        message: "Credências Inválidas.",
        status: HttpStatusCode.UNAUTHORIZED,
      });
    }

    res.json({
      isAdmin: false,
      message: "Usuário logado com sucesso.",
      status: HttpStatusCode.OK,
      expirationDate: user.expirationDate,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.json({
        message: error.message,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    res.json({
      message: "Erro interno.",
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
});

server.get("/users", async (req, res) => {
  const users = await userModel.find();

  console.log(req.headers.authorization)

  res.json({ users, status: HttpStatusCode.OK });
});

server.post("/add-user", async (req, res) => {
  const { email, password, purchaseDate, expirationDate } = req.body;

  // const purchaseDate = new Date();
  // const expiryDate = new Date(purchaseDate);
  // expiryDate.setFullYear(purchaseDate.getFullYear() + 1);

  try {
    const hashedPassword = await hash(password);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      purchaseDate,
      expirationDate,
    });

    await newUser.save();

    res.json({ user: newUser, status: HttpStatusCode.CREATED });
  } catch (error) {
    if (error instanceof Error) {
      res.json({
        message: error.message,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    res.json({
      message: "Erro interno.",
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
});

server.delete("/delete-user/:id", async (req, res) => {
  const { id } = req.params;

  await userModel.findByIdAndDelete(id);

  res.status(HttpStatusCode.NO_CONTENT).json();
});

server.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;
  const { email, purchaseDate, expirationDate } = req.body;

  const user = await userModel.findById(id);

  if (!user) {
    return res.json({
      message: "Usuário não encontrado.",
      status: HttpStatusCode.NOT_FOUND,
    });
  }

  user.email = email;
  user.purchaseDate = purchaseDate;
  user.expirationDate = expirationDate;

  await user.save();

  res.json({ user, status: HttpStatusCode.OK });
});

server.listen(3333, () => {
  console.log("Server listening on port 3333");
});
