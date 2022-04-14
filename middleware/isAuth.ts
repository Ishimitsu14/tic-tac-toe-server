import { NextFunction, Request, Response } from 'express';

import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import { User } from '@models/User';

import { httpNotificationSend, HttpNotificationTypes } from '@utils/httpNotification';

config();

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = jwt.verify(req.headers.authorization, process.env.JSON_PRIVATE_KEY || '');
    // @ts-ignore
    const user = await User.findOne({ where: { id: token.id } });
    if (user) {
      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json(httpNotificationSend(['Not Authorization'], HttpNotificationTypes.ERROR));
    }
  }
  return true;
};
