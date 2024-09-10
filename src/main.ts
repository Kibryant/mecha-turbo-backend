import { CreateUserDto } from "./core/domain/dtos/create-user-dto";
import { connect } from "./infra/database/connection/connect";
import { MongoAdminRepository } from "./infra/database/repository/mongo-admin-repository";
import { MongoUserRepository } from "./infra/database/repository/mongo-user-repository";
import { RequestAdapter } from "./infra/http/adapters/request-adapter";
import { ResponseAdapter } from "./infra/http/adapters/response-adapter";
import { createUserController } from "./infra/http/controller/user/create-user";
import { CreateUserResponseDto } from "./infra/http/controller/user/create-user/create-user-response-dto";
import { webhookHotmartController } from "./infra/http/controller/user/webhook-hotmart";
import { WebhookHotmartRequestDto } from "./infra/http/controller/user/webhook-hotmart/webhook-hotmart-request-dto";
import { WebhookHotmartResponseDto } from "./infra/http/controller/user/webhook-hotmart/webhook-hotmart-response-dto";
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

function setupRoutes() {
    server.post("/webhook-hotmart", async (req, res) => {
        const requestAdapter = new RequestAdapter<WebhookHotmartRequestDto>(req);
        const responseAdapter = new ResponseAdapter<WebhookHotmartResponseDto>(res);

        webhookHotmartController.handle(requestAdapter, responseAdapter);
    });

    // server.post("/login", async (req, res) => {
    //     const expressAdapter = new ExpressAdapter<LoginUserDto, User>(req, res);
    //     userController.login(expressAdapter);
    // });

    // server.post("/login-adm", async (req, res) => {
    //     const expressAdapter = new ExpressAdapter<LoginAdminDto, LoginAdminResponse>(req, res);
    //     adminController.login(expressAdapter);
    // });

    // server.get("/users", async (req, res) => {
    //     const expressAdapter = new ExpressAdapter<null, User[]>(req, res);
    //     userController.findAll(expressAdapter);
    // });

    server.post("/add-user", async (req, res) => {
        const requestAdapter = new RequestAdapter<CreateUserDto>(req);
        const responseAdapter = new ResponseAdapter<CreateUserResponseDto>(res);

        createUserController.handle(requestAdapter, responseAdapter);
    });

    // server.put("/update-user/:id", async (req, res) => {
    //     const expressAdapter = new ExpressAdapter<UpdateUserDto, User>(req, res);
    //     userController.update(expressAdapter);
    // });

    // server.put("/update-admin", async (req, res) => {
    //     const expressAdapter = new ExpressAdapter<UpdateAdminDto, UpdateAdminResponse>(req, res);
    //     adminController.update(expressAdapter);
    // });

    // server.delete("/delete-user/:id", async (req, res) => {
    //     const expressAdapter = new ExpressAdapter<null, null>(req, res);
    //     userController.delete(expressAdapter);
    // });
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
