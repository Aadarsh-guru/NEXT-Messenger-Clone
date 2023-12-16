import { IconType } from "react-icons";

interface AuthSocialButtonProps {
    icon: IconType;
    onClick: () => void;
    disabled?: boolean;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
    icon: Icon,
    onClick,
    disabled
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:outline-offset-0 transition-transform active:scale-[98%] cursor-pointer"
        >
            <Icon className="w-5 h-5" />
        </button>
    )
}

export default AuthSocialButton;