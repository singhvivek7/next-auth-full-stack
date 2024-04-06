import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/config/app.config';
import { getUserIdByRefreshToken } from '@/lib/helpers';

export const GET = async (req: NextRequest) => {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }
    const isMatched = jwt.verify(refreshToken, appConfig.jwtSecretRefresh);
    if (!isMatched) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = getUserIdByRefreshToken(refreshToken);

    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      status: 'success',
      message: 'Token refreshed successfully',
    });

    const newRefreshToken = jwt.sign(
      { id: userId },
      appConfig.jwtSecretRefresh,
      { expiresIn: '30d' }
    );

    const accessToken = jwt.sign({ id: userId }, appConfig.jwtSecretAccess, {
      expiresIn: '1d',
    });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
};
