import { Request, Response, NextFunction } from 'express';

const checkCookiesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies || Object.keys(req.cookies).length === 0) {
    return res.status(400).json({ message: 'No cookies found. Access denied.' });
  }

  next();
};

export  {checkCookiesMiddleware};
