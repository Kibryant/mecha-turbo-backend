import cors from "cors";
import { connect } from "../lib/db/connect";
import userModel from "../lib/db/models/userModel";
import { server } from "../lib/server";
import express from "express";
import adminModel from "../lib/db/models/adminModel";
import { HttpStatusCode } from "../types/http-status-code";
import { compareHash, hash } from "../lib/hash";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { DataWebhookHotmart } from "../types/data-webhook-hotmart";
import { env } from "../lib/env";

const jwtMiddleware = expressjwt({
    secret: env.JWT_SECRET_KEY || "",
    algorithms: ["HS256"],

    // @ts-ignore - The types are wrong
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
}).unless({ path: ["/login", "/login-adm", "/webhook-hotmart"] })

server.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

server.use(express.json());

server.use(jwtMiddleware);

const MONGODB_URI = env.MONGODB_URI

connect(MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
});

server.post("/webhook-hotmart", async (req, res) => {
    const hotmartReceivedHottok = req.headers["x-hotmart-hottok"];

    if (hotmartReceivedHottok !== env.HOTMART_HOTTOK) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
            message: "Hottok inválido.",
            status: HttpStatusCode.UNAUTHORIZED
        });
    }

    const { data }: DataWebhookHotmart = req.body;

    const { buyer } = data;

    const { name, email, checkout_phone } = buyer;

    const purchaseDate = new Date()

    const expirationDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
    )

    console.log(name, email, checkout_phone, purchaseDate, expirationDate);

    try {
        const hashedPassword = await hash(checkout_phone);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            purchaseDate,
            expirationDate,
        });

        await newUser.save();

        console.log("Usuário cadastrado com sucesso!");

        return res.json({ user: newUser, status: HttpStatusCode.CREATED });
    } catch (error) {
        if (error instanceof Error) {
            return res.json({
                message: error.message,
                status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }

        return res.json({
            message: "Erro interno.",
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        });
    }
});

server.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
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
            message: "Usuário logado com sucesso.",
            status: HttpStatusCode.OK,
            user: {
                name: user.name,
                email: user.email,
                expirationDate: user.expirationDate,
            }
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

server.post("/login-adm", async (req, res) => {
    const { email, password, accessCode } = req.body;

    try {
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            res.json({
                message: "Credências Inválidas.",
                status: HttpStatusCode.NOT_FOUND,
            });
            return;
        }

        const isValidPassword = await compareHash(password, admin.password);

        if (!isValidPassword) {
            return res.json({
                message: "Credências Inválidas.",
                status: HttpStatusCode.UNAUTHORIZED,
            });
        }

        const isValidAccessCode = await compareHash(accessCode, admin.accessCode);

        if (!isValidAccessCode) {
            return res.json({
                message: "Credências Inválidas.",
                status: HttpStatusCode.UNAUTHORIZED,
            });
        }

        const token = jwt.sign({ email }, env.JWT_SECRET_KEY || "", {});

        res.json({
            message: "Administrador logado com sucesso.",
            status: HttpStatusCode.OK,
            token,
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.per_page as string) || 10;

    try {

        const totalUsers = await userModel.countDocuments();


        const totalPages = Math.ceil(totalUsers / Number(limit));


        if (Number(page) > totalPages) {
            return res.json({
                message: "Página não encontrada.",
                status: HttpStatusCode.NOT_FOUND,
            });
        }

        const skip = (Number(page) - 1) * Number(limit);

        const users = await userModel.find()
            .skip(skip)
            .limit(Number(limit))
            .sort({ purchaseDate: 1 });

        res.json({
            users,
            currentPage: Number(page),
            totalPages,
            totalUsers,
            status: HttpStatusCode.OK
        });
    } catch (error) {

        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            error: 'Erro ao buscar usuários',
            status: HttpStatusCode.INTERNAL_SERVER_ERROR
        });
    }
});

server.post("/add-user", async (req, res) => {
    const { name, email, password, purchaseDate, expirationDate } = req.body;

    try {
        const hashedPassword = await hash(password);

        const newUser = await userModel.create({
            name,
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
    const { name, email, purchaseDate, expirationDate } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
        return res.json({
            message: "Usuário não encontrado.",
            status: HttpStatusCode.NOT_FOUND,
        });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.purchaseDate = purchaseDate || user.purchaseDate;
    user.expirationDate = expirationDate || user.expirationDate;

    await user.save();

    res.json({ user, status: HttpStatusCode.OK });
});

server.put("/update-admin", async (req, res) => {
    const { oldEmail, email, password, accessCode } = req.body;

    console.log(oldEmail, email, password, accessCode)

    let hashedPassword: string | null = null;
    let hashedAccessCode: string | null = null;

    const admin = await adminModel.findOne({ email: oldEmail });

    if (!admin) {
        return res.json({
            message: "Administrador não encontrado.",
            status: HttpStatusCode.NOT_FOUND,
        });
    }

    if (password) {
        hashedPassword = await hash(password);
    }

    if (accessCode) {
        hashedAccessCode = await hash(accessCode);
    }

    admin.email = email || admin.email;
    admin.password = hashedPassword || admin.password;
    admin.accessCode = hashedAccessCode || admin.accessCode

    await admin.save();

    res.json({ message: "Administrador atualizado com sucesso!", status: HttpStatusCode.OK });
});


server.listen(3333, () => {
    console.log("Server listening on port 3333");
});
