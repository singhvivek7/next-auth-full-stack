import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserIdByAccessToken } from '@/lib/helpers';
import { EmailType, sendMail } from '@/lib/sendMail';
import { User } from '@/models/userModel';
import { appConfig } from '@/config/app.config';

export const GET = async (req: NextRequest) => {
  const accessToken = req.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Invalid token',
      },
      {
        status: 401,
      }
    );
  }

  try {
    const userId = getUserIdByAccessToken(accessToken);

    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { email, name } = await User.findById(userId);

    const token = jwt.sign(
      {
        id: userId,
      },
      appConfig.jwtSecretAccess,
      { expiresIn: '15m' }
    );

    const url = `${appConfig.appDomain}?token=${token}`;

    await sendMail({
      name,
      email,
      url,
      emailType: EmailType.VerifyUser,
    });

    return NextResponse.json(
      { status: 'success', message: 'Email sent' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
};
