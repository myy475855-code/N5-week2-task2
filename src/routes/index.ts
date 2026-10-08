import { Router } from 'express';
import internshipRoutes from './internship.routes';
import applicationRoutes from './application.routes';

const router = Router();
router.get('/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});
router.use('/internships', internshipRoutes);
router.use('/applications', applicationRoutes);

export default router;
