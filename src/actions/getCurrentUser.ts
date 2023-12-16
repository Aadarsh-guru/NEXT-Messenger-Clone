import getSession from "./getSession";
import prisma from "../config/prisma.client"

export default async function getCurrentUser() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null
        }
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });
        if (!currentUser) {
            return null
        }
        return currentUser;
    } catch (error: any) {
        return null
    }
}