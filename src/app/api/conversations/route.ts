import getCurrentUser from "@/actions/getCurrentUser";
import prisma from '@/config/prisma.client';
import { pusherServer } from "@/config/pusher";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({
                message: 'Unauthorized',
                success: false
            }, { status: 401 });
        }
        const { userId, isGroup, members, name } = await request.json();

        if (isGroup && (!members || members.length < 2 || !name)) {
            return NextResponse.json({
                message: 'Add at least 2 members.',
                success: false
            }, { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            {
                                id: user.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            });

            newConversation.users.forEach(async (user) => {
                if (user.email) {
                    await pusherServer.trigger(user.email, 'conversation:new', newConversation);
                }
            });

            return NextResponse.json({
                success: true,
                message: 'conversation has created successfully.',
                data: newConversation
            }, { status: 200 });
        }

        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [user?.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, user?.id]
                        }
                    }
                ]
            }
        });

        const singleConversation = existingConversations[0];

        if (singleConversation) {
            return NextResponse.json({
                success: true,
                message: 'conversation has fetched successfully.',
                data: singleConversation
            }, { status: 200 });
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: user?.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        });

        newConversation.users.forEach(async (user) => {
            if (user.email) {
                await pusherServer.trigger(user.email, 'conversation:new', newConversation);
            }
        });

        return NextResponse.json({
            success: true,
            message: 'conversation has created successfully.',
            data: newConversation
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            success: false,
            message: 'Error while calling create concersation api.'
        }, { status: 500 });
    }
};