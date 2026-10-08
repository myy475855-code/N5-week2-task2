import { Router } from 'express';
import { validate } from '../middleware/validate';
import * as applications from '../controllers/application.controller';
import { idParams } from '../schemas/common.schema';
import { updateStatusBody } from '../schemas/application.schema';

const router = Router();

router.get('/:id', validate({ params: idParams }), applications.getOne);
router.patch(
  '/:id/status',
  validate({ params: idParams, body: updateStatusBody }),
  applications.updateStatus,
);

export default router;
