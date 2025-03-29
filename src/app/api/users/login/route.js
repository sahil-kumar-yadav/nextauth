import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import connectDB from '@/dbConfig/dbConfig';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { email, password } = await req.json();

    // Check if the email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password. or user does not exist' },
        { status: 401 }
      );
    }
    console.log('User found:', user);

    // Check if the user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in.' },
        { status: 403 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    return NextResponse.json(
      { message: 'Login successful.', token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in login route:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}