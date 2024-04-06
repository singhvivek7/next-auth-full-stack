import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserIdByAccessToken } from '@/lib/helpers';
import { EmailType, sendMail } from '@/lib/sendMail';
import { User } from '@/models/userModel';
import { appConfig } from '@/config/app.config';

export const POST = async (req: NextRequest) => {
  try {
    const { token } = await req.json();
    if (!token) {
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

    const userId = getUserIdByAccessToken(token);

    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }

    await User.findByIdAndUpdate(userId, {
      isVerified: true,
    });

    return NextResponse.json({
      status: 'success',
      message: 'User verified successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
};
