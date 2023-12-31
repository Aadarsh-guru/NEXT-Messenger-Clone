import type { Metadata } from 'next';
import Sidebar from '@/components/users/Sidebar';
import getUsers from '@/actions/getUsers';
import UserList from '@/components/users/UserList';

export const metadata: Metadata = {
    title: 'Messenger Clone - Home',
    description: 'Generated by create next app',
};

export default async function UsersLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const users = await getUsers();

    return (
        <Sidebar>
            <div className='h-full' >
                <UserList users={users} />
                {children}
            </div>
        </Sidebar>
    );
};
