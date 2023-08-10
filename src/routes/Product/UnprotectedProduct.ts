import express, { Request } from "express";

//databse helper which is prisma
import { db } from "src/utils/db";

// custom.d.ts (or any other .d.ts file in your project)

const unProtectedProduct = express.Router();
