import getCurrentUser from "@/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/config/prisma.client";
import { pusherServer } from "@/config/pusher";

interface IParams {
    conversationId?: string
};

export const POST = async (request: NextRequest, { params: { conversationId } }: { params: IParams }) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({
                message: 'Unauthorised',
                success: false,
            }, { status: 401 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        });

        if (!conversation) {
            return NextResponse.json({
                message: 'conversation not found.',
                success: false,
            }, { status: 400 });
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(lastMessage, { status: 200 });
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
        });

        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        });

        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation, { status: 200 });
        }

        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

        return NextResponse.json(updatedMessage, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            message: 'error in seen conversation api.',
            success: false
        }, { status: 500 });
    }
}