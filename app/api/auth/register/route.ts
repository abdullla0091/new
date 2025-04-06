import { NextResponse } from 'next/server';

// This is a simple demo API endpoint that simulates user registration
// In a real application, you would:
// 1. Validate the input data
// 2. Check if email already exists
// 3. Hash the password
// 4. Store user data in a database
// 5. Return a JWT token or other auth method

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, password } = body;
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real app, you would check if the user already exists
    // and store the new user in your database
    
    // For demo purposes, we'll just simulate a successful response
    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        user: { id: `user_${Date.now()}`, name, email }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 