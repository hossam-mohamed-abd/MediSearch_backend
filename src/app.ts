import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import authRoutes from "./modules/auth/auth.routes";
import countryRoutes from "./modules/countries/country.routes";
import governorateRoutes from "./modules/governorates/governorate.routes";
import cityRoutes from "./modules/cities/city.routes";
import categoryRoutes from "./modules/categories/category.routes";
import medicineRoutes from "./modules/medicines/medicine.routes";
import favoriteRoutes from "./modules/favorites/favorite.routes";
import pharmacyRoutes from "./modules/pharmacies/pharmacy.routes";
import statisticsRoutes from "./modules/statistics/statistics.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import searchRoutes from "./modules/search/search.routes";
import aiRoutes from "./modules/ai/ai.routes";
import medicineDetailRoutes from "./modules/medicine-detail/medicine.routes";
import pharmacyAuthRoutes from "./modules/pharmacy-auth/pharmacy-auth.routes";
import pharmacyDashboardRoutes
  from "./modules/pharmacy-dashboard/pharmacy-dashboard.routes";
import pharmacyUploadRoutes
  from "./modules/pharmacy-upload/pharmacy-upload.routes";
import pharmacyProfileRoutes from "./modules/pharmacy-profile/pharmacy-profile.routes";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:4200", "https://medi-search-eight.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediSearch API Running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/home/medicines", medicineRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/governorates", governorateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/home/pharmacies", pharmacyRoutes);
app.use("/api/home/statistics", statisticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/drugs", medicineDetailRoutes);
app.use("/api/pharmacy-auth", pharmacyAuthRoutes);
app.use(
  "/api/pharmacy/dashboard",
  pharmacyDashboardRoutes,
);
app.use(
  "/api/pharmacy/upload",
  pharmacyUploadRoutes,
);
app.use(
  "/api/pharmacy/profile",
  pharmacyProfileRoutes,
);
export default app;
