import express, { Express, Request, Response } from "express";
import cors from "cors";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";
import { SignUpSchema } from "./schema/users";

const app: Express = express();


app.use(express.json());
app.use(cors());
app.use("/api", rootRouter);
app.use(errorMiddleware);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, () => console.log("App working"));
