import express from "express";
import { createPackageBooking, searchPackages } from "../controllers/packages.controller.js";

const packRouter = express.Router()


packRouter.get("/search" ,searchPackages)
packRouter.post("/book" , createPackageBooking)
// packRouter.get("/search/:id", getPackageById);

export default packRouter