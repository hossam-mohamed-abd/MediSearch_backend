import prisma from "../../config/prisma";

import { PharmacyUploadRepository } from "./pharmacy-upload.repository";

export class PharmacyUploadService {
    private repository =
        new PharmacyUploadRepository();

    async upload(
        userId: bigint,
        file: Express.Multer.File,
    ) {
        const staff =
            await prisma.pharmacy_staff.findFirst({
                where: {
                    user_id: userId,
                },
            });

        if (!staff?.pharmacy_id) {
            throw new Error("Pharmacy not found");
        }

        const timestamp =
            new Date()
                .toISOString()
                .replace(/[-:.TZ]/g, "");

        const fileName =
            `pharmacy_inventory_pharmacy_${staff.pharmacy_id}_${timestamp}.csv`;

        await this.repository.uploadFile(
            fileName,
            file,
        );

        return {
            fileName,
        };
    }
}