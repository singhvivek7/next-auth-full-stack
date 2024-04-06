import { appConfig } from '@/config/app.config';
import jwt from 'jsonwebtoken';

export const getUserIdByAccessToken = (token: string) => {
  try {
    const { id }: any = jwt.verify(token, appConfig.jwtSecretAccess);
    return id;
  } catch (err) {
    return null;
  }
};

export const getUserIdByRefreshToken = (token: string) => {
  try {
    const { id }: any = jwt.verify(token, appConfig.jwtSecretRefresh);
    return id;
  } catch (err) {
    return null;
  }
};
