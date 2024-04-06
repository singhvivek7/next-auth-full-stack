import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { isEmail } from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { appConfig } from '@/config/app.config';
import { EmailType, sendMail } from '@/lib/sendMail';

dbConnect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = body;

    if (!name || !email || !password) {
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

    if (user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User already exists.',
        },
        {
          status: 409,
        }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: createdUser._id,
      },
      appConfig.jwtSecretAccess,
      { expiresIn: '15m' }
    );

    const url = `${appConfig.appDomain}?token=${token}`;

    sendMail({ name, email, emailType: EmailType.VerifyUser, url });

    const response = NextResponse.json({
      status: 'success',
      message: 'User created successfully',
    });

    const refreshToken = jwt.sign(
      { id: createdUser._id },
      appConfig.jwtSecretRefresh,
      { expiresIn: '30d' }
    );

    const accessToken = jwt.sign(
      { id: createdUser._id },
      appConfig.jwtSecretAccess,
      { expiresIn: '1d' }
    );

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
