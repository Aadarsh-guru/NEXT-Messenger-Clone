'use client'
import { CurrentUser } from "@/types";
import Image from "next/image";

interface AvatarProps {
    user?: CurrentUser;
};

const Avatar: React.FC<AvatarProps> = ({ user }) => {

    return (
        <div className="relative">
            <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
                <Image
                    className=""
                    src={user?.image || '/images/placeholder.jpg'}
                    alt="avatar"
                    fill
                />
            </div>
            {/* <span className="absolute block ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3 bg-green-500 rounded-full"></span> */}
        </div>
    )
}

export default Avatar;