import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";

import countryRoutes from "./modules/countries/country.routes";

import governorateRoutes from "./modules/governorates/governorate.routes";

import cityRoutes from "./modules/cities/city.routes";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200", "https://medi-search-eight.vercel.app"],
    credentials: true,
  }),
);

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/countries", countryRoutes);

app.use("/api/governorates", governorateRoutes);

app.use("/api/cities", cityRoutes);

export default app;
