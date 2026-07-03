import {
  Request,
  Response,
} from 'express';

import { PharmacyService }
from './pharmacy.service';

const service =
  new PharmacyService();

export class PharmacyController {

  async getFeaturedPharmacies(
    req: Request,
    res: Response
  ) {
    try {

      const page =
        Number(
          req.query.page
        ) || 1;

      const data =
        await service
          .getFeaturedPharmacies(
            page
          );

      res.json({
        success: true,
        data,
      });

    } catch (error: any) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
}