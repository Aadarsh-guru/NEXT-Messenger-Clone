import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/config/prisma.client";


export const POST = async (request: Request) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return Response.json({
                message: 'Unauthorised',
                success: false,
            }, { status: 401 });
        }
        const { name, image } = await request.json();

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                image,
                name
            }
        });
        return Response.json({
            message: 'Info updated successfully.',
            success: true,
            user: updatedUser
        }, { status: 200 });
    } catch (error: any) {
        return Response.json({
            error: error.message,
            message: 'error in settings api.',
            success: false
        }, { status: 500 });
    };
};