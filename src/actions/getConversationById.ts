import getCurrentUser from "./getCurrentUser";
import prisma from '@/config/prisma.client';


const getConversationById = async (id: string) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) {
            return null;
        }
        const conversation = prisma.conversation.findUnique({
            where: {
                id: id
            },
            include: {
                users: true
            }
        });
        return conversation;
    } catch (error: any) {
        return null;
    }
};

export default getConversationById;