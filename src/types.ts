import { Conversation, Message, User } from "@prisma/client";

export type CurrentUser = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    hashedPassword: string | null;
    createdAt: Date;
    updatedAt: Date;
    conversationIds: string[];
    seenMessageIds: string[];
} | null;

export type FullMessageType = Message & {
    sender: User;
    seen: User[];
};

export type FullConversationType = Conversation & {
    users: User[];
    messages: FullMessageType[];
};

