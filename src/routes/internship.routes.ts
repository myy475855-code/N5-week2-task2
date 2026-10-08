import { Router } from 'express';
import { validate } from '../middleware/validate';
import * as internships from '../controllers/internship.controller';
import * as applications from '../controllers/application.controller';
import { idParams } from '../schemas/common.schema';
import {
  internshipBody,
  internshipPatchBody,
  listInternshipsQuery,
} from '../schemas/internship.schema';
import { createApplicationBody, listApplicationsQuery } from '../schemas/application.schema';

const router = Router();

router.get('/', validate({ query: listInternshipsQuery }), internships.list);
router.post('/', validate({ body: internshipBody }), internships.create);
router.get('/:id', validate({ params: idParams }), internships.getOne);
router.put('/:id', validate({ params: idParams, body: internshipBody }), internships.replace);
router.patch('/:id', validate({ params: idParams, body: internshipPatchBody }), internships.patch);
router.delete('/:id', validate({ params: idParams }), internships.remove);

// Applications are a sub-resource of an internship
router.get(
  '/:id/applications',
  validate({ params: idParams, query: listApplicationsQuery }),
  applications.listForInternship,
);
router.post(
  '/:id/applications',
  validate({ params: idParams, body: createApplicationBody }),
  applications.createForInternship,
);

export default router;
