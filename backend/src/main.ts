import express, { NextFunction, Request, Response } from "express";
import contractorRoutes from "./routes/contractor.routes.ts";
import entityRoutes from "./routes/entity.routes.ts";
import locationRoutes from "./routes/location.routes.ts";
import workOrderRoutes from "./routes/workOrder.routes.ts";
import billRoutes from "./routes/bill.routes.ts";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

declare global {
  namespace Express {
    export interface Request {
      tokenData: {
        userId: string;
        userName: string;
      };
    }
  }
}

const app = express();
const PORT = process.env.PORT;

if(!process.env.MONGODB_URL)
  throw "MONGODB URL NOT CONFIGURED IN ENV FILE"

await mongoose.connect(process.env.MONGODB_URL);
console.log("connected to db");


app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());

app.post("/login", (req, res) => {
  const user = {
    userName: "demoUser",
    userId: new Types.ObjectId("67643904dec70c21d0748ca3"),
  };

  const token = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  res.cookie("Authorization", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: "strict",
  });

  res.status(200).send({ message: "Login successful" });
  return;
});

const authorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.Authorization;

  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.tokenData = decoded as { userName: string; userId: string };
    next();
    return;
  });
};

app.use("/contractors", authorizationMiddleware, contractorRoutes);
app.use("/entity",authorizationMiddleware, entityRoutes);
app.use("/location",authorizationMiddleware, locationRoutes);
app.use("/work-order", authorizationMiddleware,workOrderRoutes);
app.use("/bill", authorizationMiddleware,billRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Server listening in port 4000");
  return;
});

app.listen(PORT, () => {
  console.log(`LISTENING IN PORT ${PORT}`);
});
