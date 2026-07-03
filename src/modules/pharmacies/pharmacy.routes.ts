import { Router }
from 'express';

import {
  PharmacyController
} from './pharmacy.controller';

const router =
  Router();

const controller =
  new PharmacyController();

router.get(
  '/',
  controller
    .getFeaturedPharmacies
);

export default router;