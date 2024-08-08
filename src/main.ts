import { CreateUserDto } from "./core/domain/dtos/create-user-dto";
import { LoginAdminDto } from "./core/domain/dtos/login-admin-dto";
import { LoginAdminResponse } from "./core/domain/dtos/login-admin-response";
import { LoginUserDto } from "./core/domain/dtos/login-user-dto";
import { UpdateAdminDto } from "./core/domain/dtos/update-admin-dto";
import { UpdateAdminResponse } from "./core/domain/dtos/update-admin-response";
import { UpdateUserDto } from "./core/domain/dtos/update-user-dto";
import { User } from "./core/domain/entities/user";
import { DataWebhookHotmart } from "./types/data-webhook-hotmart";

import { connect } from "./infra/database/connection/connect";
import { MongoAdminRepository } from "./infra/database/repository/mongo-admin-repository";
import { MongoUserRepository } from "./infra/database/repository/mongo-user-repository";
import { ExpressAdapter } from "./infra/http/adapters/express-adapter";
import { AdminController } from "./infra/http/controller/admin-controller";
import { UserController } from "./infra/http/controller/user-controller";
import { server } from "./infra/http/server";
import { Hash } from "./infra/security/hash";
import { Jwt } from "./infra/security/jwt";
import { env } from "./lib/env";

async function setupDatabaseConnection() {
    try {
        await connect(env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

const mongoUserRepository = new MongoUserRepository();
const mongoAdminRepository = new MongoAdminRepository();
const hashService = new Hash();
const jwtService = new Jwt();

const userController = new UserController(mongoUserRepository, hashService);
const adminController = new AdminController(mongoAdminRepository, hashService, jwtService);

function setupRoutes() {
    server.post("/webhook-hotmart", async (req, res) => {
        const expressAdapter = new ExpressAdapter<DataWebhookHotmart, User>(req, res);
        userController.webhookHotmart(expressAdapter);
    });

    server.post("/login", async (req, res) => {
        const expressAdapter = new ExpressAdapter<LoginUserDto, User>(req, res);
        userController.login(expressAdapter);
    });

    server.post("/login-adm", async (req, res) => {
        const expressAdapter = new ExpressAdapter<LoginAdminDto, LoginAdminResponse>(req, res);
        adminController.login(expressAdapter);
    });

    server.get("/users", async (req, res) => {
        const expressAdapter = new ExpressAdapter<null, User[]>(req, res);
        userController.findAll(expressAdapter);
    });

    server.post("/add-user", async (req, res) => {
        console.log(req.body);
        const expressAdapter = new ExpressAdapter<CreateUserDto, User>(req, res);
        userController.create(expressAdapter);
    });

    server.put("/update-user/:id", async (req, res) => {
        const expressAdapter = new ExpressAdapter<UpdateUserDto, User>(req, res);
        userController.update(expressAdapter);
    });

    server.put("/update-admin", async (req, res) => {
        const expressAdapter = new ExpressAdapter<UpdateAdminDto, UpdateAdminResponse>(req, res);
        adminController.update(expressAdapter);
    });

    server.delete("/delete-user/:id", async (req, res) => {
        const expressAdapter = new ExpressAdapter<null, null>(req, res);
        userController.delete(expressAdapter);
    });
}

function startServer() {
    server.listen(3001, () => {
        console.log("Server is running on port 3001");
    });
}

async function main() {
    await setupDatabaseConnection();
    setupRoutes();
    startServer();
}

main();
