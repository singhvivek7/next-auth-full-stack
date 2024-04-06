import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { isEmail } from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { appConfig } from '@/config/app.config';

dbConnect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password }: { email: string; password: string } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please fill all fields',
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Password must be at least 8 characters long',
        },
        {
          status: 400,
        }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid Email' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Email or password wrong.',
        },
        {
          status: 400,
        }
      );
    }

    const isMatched = await bcrypt.compare(password, user.password);
    console.log(isMatched, 'isMatched');

    if (!isMatched) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Email or password wrong.',
        },
        {
          status: 400,
        }
      );
    }

    const response = NextResponse.json({
      status: 'success',
      message: 'User logged in successfully',
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      appConfig.jwtSecretRefresh,
      { expiresIn: '30d' }
    );

    const accessToken = jwt.sign({ id: user._id }, appConfig.jwtSecretAccess, {
      expiresIn: '1d',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
    });
    response.cookies.set('accessToken', accessToken, {
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
