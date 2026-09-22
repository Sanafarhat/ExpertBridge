import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const { 
      name, 
      email, 
      password, 
      phone, 
      institutionName, 
      type, 
      location, 
      website, 
      description 
    } = data;

    if (!name || !email || !password || !institutionName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: 'INSTITUTION',
        }
      });

      await tx.institution.create({
        data: {
          userId: newUser.id,
          name: institutionName,
          type: type || null,
          location: location || null,
          website: website || null,
          description: description || null,
        }
      });

      return newUser;
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Institution account created successfully',
      userId: user.id
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
