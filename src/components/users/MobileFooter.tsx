'use client'
import useConversation from "@/hooks/useConversation";
import useRoutes from "@/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { CurrentUser } from "@/types";

interface MobileFooter {
    currentUser: CurrentUser
}

const MobileFooter: React.FC<MobileFooter> = ({ currentUser }) => {

    const routes = useRoutes();
    const { conversationId, isOpen } = useConversation();

    if (isOpen) {
        return null;
    }

    return (
        <div
            className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden"
        >
            {routes.map((route, index) => (
                <MobileItem
                    key={index}
                    label={route.label}
                    href={route.href}
                    active={route.active}
                    onClick={route.onClick}
                    icon={route.icon}
                />
            ))}
        </div>
    )
}

export default MobileFooter;