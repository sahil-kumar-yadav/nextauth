import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import connectDB from '@/dbConfig/dbConfig';
import sendEmail from '@/helpers/mailer';

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

    // Declare newUser outside the try block
    let newUser;

    // Create a new user
    try {
      newUser = new User({
        username,
        email,
        password,
      });

      const savedUser = await newUser.save();
      console.log('User created:', savedUser);
    } catch (error) {
      console.error('Failed to create user:', error);
      return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
    }

    // Send verification email
    await sendEmail(
      email,
      'verification',
      newUser._id // Now accessible because newUser is declared outside the inner try block
    );

    return NextResponse.json(
      { message: 'User registered successfully. Verification email sent.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup route:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong. Error in signup.' },
      { status: 500 }
    );
  }
}
