import { FullMessageType } from "@/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Avatar from "../users/Avatar";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageModel from "./ImageModel";

interface MessageBoxProps {
    data: FullMessageType;
    isLast: boolean
};

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {

    const session = useSession();
    const [imageModelOpen, setImageModelOpen] = useState(false);
    const isOwn = session.data?.user?.email === data.sender.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== session.data?.user?.email)
        .map((user) => user.name)
        .join(", ");

    const container = clsx(
        `flex gap-4 p-4`,
        isOwn && 'justify-end'
    );

    const avatar = clsx(isOwn && 'order-2');

    const body = clsx(
        `flex flex-col gap-2`,
        isOwn && 'items-end'
    );

    const message = clsx(
        `text-sm w-fit overflow-hidden`,
        isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100',
        data?.image ? 'rounded-md p-0' : 'rounded-full px-3 py-2'
    );

    useEffect(() => {
        axios.post(`/api/conversations/${data.conversationId}/seen`,)
            .then(() => { }).catch((error) => console.log(error));
    }, []);

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar
                    user={data?.sender}
                />
            </div>
            <div className={body}>
                <div className={`flex items-center gap-1`}>
                    <div className="text-sm text-gray-500">
                        {data?.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={message}>
                    <ImageModel
                        src={data.image}
                        isOpen={imageModelOpen}
                        onClose={() => setImageModelOpen(false)}
                    />
                    {data?.image ? (
                        <Image
                            onClick={() => setImageModelOpen(true)}
                            src={data.image}
                            alt="message"
                            height={288}
                            width={288}
                            className="object-cover rounded-md cursor-pointer hover:scale-110 transition"
                        />
                    ) :
                        (
                            <div className="">
                                {data?.body}
                            </div>
                        )
                    }
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-gray-500">
                        {`seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBox;