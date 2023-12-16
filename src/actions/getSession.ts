import authOptions from "@/config/nextauth.config";
import { getServerSession } from "next-auth";

const getSession = async () => {
    return await getServerSession(authOptions);
};

export default getSession;