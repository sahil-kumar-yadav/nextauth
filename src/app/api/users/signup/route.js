import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import connectDB from '@/dbConfig/dbConfig';
import sendEmail from '@/helpers/mailer';
import crypto from 'crypto';

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await req.json();
    const { username, email, password } = body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create a verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
      verifyToken,
      verifyTokenExpiry,
    });

    // Send verification email
    await sendEmail(
      email,
      'verification',
      newUser._id
    ); // here we may need to receive object

    return NextResponse.json(
      { message: 'User registed successfully. Verification email sent.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup route:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}