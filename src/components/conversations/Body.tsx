'use client'
import useConversation from "@/hooks/useConversation";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/types";
import axios from "axios";
import { pusherClient } from "@/config/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMessageType[];
};

const Body: React.FC<BodyProps> = ({ initialMessages }) => {

    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
            .then((_) => null)
            .catch((error) => console.log(error));
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)
                .then((_) => null)
                .catch((error) => console.log(error));
            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }
                return [...current, message];
            })
            bottomRef?.current?.scrollIntoView();
        };

        const updateMessageHandler = (message: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => currentMessage.id === message.id ? message : currentMessage));
        };

        pusherClient.bind('messages:new', messageHandler);
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('messages:new', messageHandler);
            pusherClient.unbind('message:update', updateMessageHandler);
        };
    }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages?.map((message, index) => (
                <MessageBox
                    key={index}
                    isLast={index === messages?.length - 1}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    );
};

export default Body;