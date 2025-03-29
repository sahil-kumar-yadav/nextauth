import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import connectDB from '@/dbConfig/dbConfig';

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body to get the token
    const { token } = await req.json();
    
    // console.log('Token received:', token);

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required.' },
        { status: 400 }
      );
    }
    
    // Find the user with the provided token
    const user = await User.findOne({ verifyToken: token });
    console.log('User found:', user);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found Invalid or expired verification token.' },
        { status: 400 }
      );
    }

    // Check if the token has expired
    if (user.verifyTokenExpiry < Date.now()) {
      return NextResponse.json(
        { error: 'Verification token has expired.' },
        { status: 400 }
      );
    }

    // Update the user's isVerified status and remove the token and expiry
    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;

    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in verifyemail route:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong in token route. Please try again later.' },
      { status: 500 }
    );
  }
}