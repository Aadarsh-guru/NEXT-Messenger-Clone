'use client'
import clsx from "clsx";
import Link from "next/link";

interface DextopItemProps {
    href: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
    icon: any
}

const MobileItem: React.FC<DextopItemProps> = ({ href, label, active, onClick, icon: Icon }) => {

    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    }

    return (
        <Link
            onClick={handleClick}
            href={href}
            className={clsx(
                `group flex gap-x-3 rounded-md text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
                active && 'bg-gray-100 text-black'
            )}
        >
            <Icon
                className="h-6 w-6"
            />
            <span className="sr-only" >{label}</span>
        </Link>
    )
}

export default MobileItem;