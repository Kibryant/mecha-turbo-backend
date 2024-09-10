import { CreateUser } from "../../../../../core/services/create-user";
import { MongoUserRepository } from "../../../../database/repository/mongo-user-repository";
import { CreateUserController } from "./create-user-controller";

const userRepository = new MongoUserRepository();
const createUser = new CreateUser(userRepository);
const createUserController = new CreateUserController(createUser);

export { createUserController };

