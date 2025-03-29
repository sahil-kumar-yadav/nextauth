import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Clear the token cookie by setting it with an empty value and immediate expiration
    const response = NextResponse.json(
      { message: 'Logout successful.' },
      { status: 200 }
    );
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      expires: new Date(0), // Expire the cookie immediately
      path: '/', // Cookie available across the entire site
    });

    return response;
  } catch (error) {
    console.error('Error in logout route:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}