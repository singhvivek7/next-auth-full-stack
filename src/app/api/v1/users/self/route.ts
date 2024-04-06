import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdByAccessToken } from '@/lib/helpers';

dbConnect();

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = getUserIdByAccessToken(accessToken);

    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User does not exists.',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
};
