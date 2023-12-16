import AuthForm from "@/components/forms/AuthForm";
import Image from "next/image";

const Home: React.FC = () => {
    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    src={'/images/logo.png'}
                    alt="logo"
                    height={48}
                    width={48}
                    className="mx-auto h-12 w-auto"
                />
                <h2 className="mt-6 text-center text-2xl md:text-3xl font-bold tracking-tight text-gray-900 ">
                    Sign in to your account
                </h2>
            </div>
            {/* form for authentication */}
            <AuthForm />
        </div>
    );
};

export default Home;