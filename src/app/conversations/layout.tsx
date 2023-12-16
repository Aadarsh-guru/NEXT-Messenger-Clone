import type { Metadata } from 'next';
import Sidebar from '@/components/users/Sidebar';
import ConversationsList from '@/components/conversations/ConversationsList';
import getConversations from '@/actions/getConversations';
import getUsers from '@/actions/getUsers';

export const metadata: Metadata = {
    title: 'Messenger Clone - Conversations',
    description: 'Generated by create next app',
};

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <Sidebar>
            <ConversationsList
                users={users}
                initialItems={conversations}
            />
            <div className='h-full' >
                {children}
            </div>
        </Sidebar>
    );
};
