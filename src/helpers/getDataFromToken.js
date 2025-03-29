import jwt from 'jsonwebtoken';

const getDataFromToken = (req) => {
  try {
    // Verify the token using the secret
    const token = req.cookies.get('token')?.value || "";
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return the decoded data (e.g., userId, email)
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return null; // Return null if the token is invalid or expired
  }
};

export default getDataFromToken;