'use client'
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import LoadingModel from "../LoadingModel";

interface UserBoxProps {
    user: User
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/conversations`, { userId: user?.id });
            const { success, data } = response.data;
            if (success) {
                router.push(`/conversations/${data?.id}`);
            }
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [user, router]);

    return (
        <>
            {
                isLoading && <LoadingModel />
            }
            <div
                className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                onClick={handleClick}
            >
                <Avatar
                    user={user}
                />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium to-gray-900" >
                                {user?.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserBox;