import getCurrentUser from "@/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/config/prisma.client";
import { pusherServer } from "@/config/pusher";

export const POST = async (request: NextRequest) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorised!'
            }, { status: 401 });
        }
        const { message, image, conversationId } = await request.json();

        if (!(message || image) || !conversationId) {
            return NextResponse.json({
                success: false,
                message: 'Invalid data!'
            }, { status: 400 });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId,
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true
            }
        });

        const UpdatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = UpdatedConversation.messages[UpdatedConversation.messages.length - 1];

        UpdatedConversation.users.map(async (user) => {
            await pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: lastMessage
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Message saved successfully.',
            newMessage
        }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Error while callinng save message api.'
        }, { status: 500 });
    }
};
