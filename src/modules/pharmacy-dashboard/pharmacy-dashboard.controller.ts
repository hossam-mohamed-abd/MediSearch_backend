import { Request, Response } from "express";

import { PharmacyDashboardService } from "./pharmacy-dashboard.service";

const service =
    new PharmacyDashboardService();

export class PharmacyDashboardController {

    getDashboard = async (
        req: Request,
        res: Response,
    ) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            

            const userId = BigInt(req.user.id);

            const data =
                await service.getDashboard(userId);

            return res.json({
                success: true,
                data,
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message,
            });

        }

    };

}