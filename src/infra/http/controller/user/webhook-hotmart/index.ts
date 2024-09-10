import { WebHookHotmart } from "../../../../../core/services/webhook-hotmart";
import { MongoUserRepository } from "../../../../database/repository/mongo-user-repository";
import { WebHookHotmartController } from "./webhook-hotmart-controller";


const userRepository = new MongoUserRepository();
const webhookHotmartService = new WebHookHotmart(userRepository);
const webhookHotmartController = new WebHookHotmartController(webhookHotmartService);

export { webhookHotmartController };