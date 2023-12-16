import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/config/prisma.client";
import { pusherServer } from "@/config/pusher";

interface IParams {
    conversationId?: string
};

export const DELETE = async (request: Request, { params: { conversationId } }: { params: IParams }) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return Response.json({
                message: 'Unauthorised',
                success: false,
            }, { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!existingConversation) {
            return Response.json({
                success: false,
                message: 'no exiting conversation found.'
            }, { status: 400 });
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        existingConversation.users.forEach(async (user) => {
            if (user.email) {
                await pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        });

        return Response.json({
            message: 'Conversation deleted successfully.',
            success: true,
            conversation: deletedConversation
        }, { status: 200 });
    } catch (error: any) {
        return Response.json({
            error: error.message,
            message: 'error in delete conversation api.',
            success: false
        }, { status: 500 });
    }
}