'use client'
import useRoutes from "@/hooks/useRoutes";
import { useState } from "react";
import DextopItem from "./DextopItem";
import { CurrentUser } from "@/types";
import Avatar from "./Avatar";
import SettingsModel from "./SettingsModel";

interface DextopSidebarProps {
    currentUser: CurrentUser
}

const DextopSidebar: React.FC<DextopSidebarProps> = ({ currentUser }) => {

    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <SettingsModel
                currentUser={currentUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
                <nav
                    className="mt-4 flex flex-col justify-between"
                >
                    <ul
                        role="list"
                        className="flex flex-col items-center space-y-1"
                    >
                        {
                            routes.map((route, index) => (
                                <DextopItem
                                    key={index}
                                    label={route.label}
                                    href={route.href}
                                    active={route.active}
                                    onClick={route.onClick}
                                    icon={route.icon}
                                />
                            ))
                        }
                    </ul>
                </nav>
                <nav className="mt-4 flex flex-col justify-between items-center" >
                    <div
                        className="cursor-pointer hover:opacity-75 transition"
                        onClick={() => setIsOpen(true)}
                    >
                        <Avatar
                            user={currentUser}
                        />
                    </div>
                </nav>
            </div>
        </>
    );
};

export default DextopSidebar;