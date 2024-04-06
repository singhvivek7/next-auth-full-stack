import { NextResponse } from 'next/server';

export const GET = async () => {
  const response = NextResponse.json({
    status: 'success',
    message: 'User logged out successfully',
  });

  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
};
