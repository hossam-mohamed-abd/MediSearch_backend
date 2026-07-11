import supabase, { STORAGE_BUCKET } from "../../config/supabase";

export class PharmacyUploadRepository {
    async uploadFile(
        fileName: string,
        file: Express.Multer.File,
    ) {
        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(
                `pharmacy_uploads/${fileName}`,
                file.buffer,
                {
                    contentType: file.mimetype,
                    upsert: true,
                },
            );

        if (error) {
            throw new Error(error.message);
        }

        return fileName;
    }
}