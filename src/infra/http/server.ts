import express from "express";
import { expressjwt } from "express-jwt";
import { env } from "../../lib/env";
import cors from "cors";

const server = express();

// const jwtMiddleware = expressjwt({
//     secret: env.JWT_SECRET_KEY || "",
//     algorithms: ["HS256"],
//     // @ts-expect-error - The types are wrong
//     getToken: (req) => {
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.split(" ")[0] === "Bearer"
//       ) {
//         return req.headers.authorization.split(" ")[1];
//       } else if (req.query && req.query.token) {
//         return req.query.token;
//       }
//       return undefined;
//     }
// }).unless({ path: ["/login", "/login-adm", "/webhook-hotmart"] })
  
server.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

server.use(express.json());

// server.use(jwtMiddleware);
  

export { server };
