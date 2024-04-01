import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/', function(req, res) {
  res.json({message: 'Welcome to TODOMATIC API'});
});

export default router;