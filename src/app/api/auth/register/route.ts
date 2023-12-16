import bcrypt from 'bcryptjs';
import prisma from '@/config/prisma.client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
    try {
        const { name, email, password } = await request.json();
        if (!name || !email || !password) {
            return NextResponse.json({
                success: false,
                message: 'All fields are required.'
            }, { status: 400 });
        }
        const exist = await prisma.user.findFirst({
            where: {
                email
            }
        });
        if (exist) {
            return NextResponse.json({
                success: false,
                message: 'User already exist.'
            }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword
            },
        });
        return NextResponse.json({
            success: true,
            message: 'User registered successfully.',
            user
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            success: false,
            message: 'Error While registering the user.'
        }, { status: 500 });
    }
};