import { Request, Response } from 'express';

import {
  recoveryPasswordPostScheme,
  recoveryPasswordSentLinkPostScheme,
  registerPostScheme,
} from '@validates/AuthValidate';

import { User } from '@models/User';

import validateForm from '@middleware/validateForm';

import { httpNotificationSend, HttpNotificationTypes } from '@utils/httpNotification';

export = {
  register: {
    post: [registerPostScheme, validateForm, async (req: Request, res: Response) => {
      try {
        const { email, username, password } = req.body;
        const user = User.create({ email, username, password });
        await user.save();
        await user.sentConfirmationEmailLinkToUser();
        const token = user.generateJwt();
        res.json({ token, user: user.toJson() });
      } catch (e: any) {
        res.status(400).json(httpNotificationSend([e.message], HttpNotificationTypes.ERROR));
      }
    }],
  },
  login: {
    post: [async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        const { token, user } = await User.auth(email, password);
        res.json({ token, user: user.toJson() });
      } catch (e: any) {
        res.status(400).json(httpNotificationSend([e.message], HttpNotificationTypes.ERROR));
      }
    }],
  },
  'confirmEmail/:hash': {
    get: [async (req: Request, res: Response) => {
      try {
        const { hash } = req.params;
        await User.confirmUser(hash);
        res.status(201).json(httpNotificationSend(
          ['Account is approval.'],
          HttpNotificationTypes.SUCCESS,
        ));
      } catch (e: any) {
        res
          .status(400)
          .json(httpNotificationSend([e.message], HttpNotificationTypes.ERROR));
      }
    }],
  },
  recoveryPassword: {
    post: [
      recoveryPasswordSentLinkPostScheme,
      validateForm,
      async (req: Request, res: Response) => {
        try {
          const { email } = req.body;
          const user = await User.findOne({ where: { email, status: User.statuses.VERIFIED } });
          if (user) {
            await user.sentRecoveryPasswordLinkToUser();
            res
              .status(200)
              .json(httpNotificationSend(
                ['Link to recovery password sent to your email.'],
                HttpNotificationTypes.SUCCESS,
              ));
          } else {
            res
              .status(400)
              .json(httpNotificationSend(
                ['Email address does not exist.'],
                HttpNotificationTypes.ERROR,
              ));
          }
        } catch (e: any) {
          res
            .status(400)
            .json(httpNotificationSend([e.message], HttpNotificationTypes.ERROR));
        }
      }],
  },
  'recoveryPassword/:hash': {
    post: [
      recoveryPasswordPostScheme,
      validateForm,
      async (req: Request, res: Response) => {
        try {
          const { hash } = req.params;
          const { password } = req.body;
          await User.recoveryPassword(hash, password);
          res.status(201).json(httpNotificationSend(
            ['Password is changed'],
            HttpNotificationTypes.SUCCESS,
          ));
        } catch (e: any) {
          res
            .status(400)
            .json(httpNotificationSend([e.message], HttpNotificationTypes.ERROR));
        }
      }],
  },
}
