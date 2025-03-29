import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import connectDB from '@/dbConfig/dbConfig';
import getDataFromToken from '@/helpers/getDataFromToken';

export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();

    // Get the token from cookies
    // const token = req.cookies.get('token')?.value || "";

    // Get user data from the token
    const decodedData = getDataFromToken(req);

    if (!decodedData) {
      return NextResponse.json(
        { error: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    // Fetch the user from the database
    const user = await User.findById(decodedData.userId).select('-password'); // Exclude the password field
    // console.log('User found:', user);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in profile route:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong in profile route. Please try again later.' },
      { status: 500 }
    );
  }
}