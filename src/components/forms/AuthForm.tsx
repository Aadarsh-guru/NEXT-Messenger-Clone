'use client'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import AuthSocialButton from "../buttons/AuthSocialButton";
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthForm: React.FC = () => {

    const searchParams = useSearchParams();
    const session = useSession();
    const router = useRouter();
    const [variant, setvariant] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState(searchParams.get('error'))

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/users');
        }
    }, [session?.status])

    const toggleVarient = useCallback(() => {
        if (variant === 'LOGIN') {
            return setvariant('REGISTER');
        }
        if (variant === 'REGISTER') {
            return setvariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            if (variant === 'REGISTER') {
                if (data.password.length < 6) {
                    return toast.error('Password must be 6 characters long');
                }
                const response = await axios.post('/api/auth/register', data);
                const { success, message } = response.data;
                if (success) {
                    reset();
                    setvariant('LOGIN');
                    return toast.success(message);
                }
            }
            if (variant === 'LOGIN') {
                const response = await signIn('credentials', {
                    ...data,
                    redirect: false,
                });
                if (response?.ok) {
                    router.push('/users');
                    return toast.success('Login successful');
                }
                if (response?.error) {
                    setError(response.error);
                    return toast.error(response.error);
                }
            }
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || `Something went wrong!`);
        } finally {
            setIsLoading(false);
        }
    };

    const socialAction = async (action: string) => {
        setIsLoading(true);
        try {
            const response = await signIn(action, {
                redirect: false,
                callbackUrl: '/users'
            });
            if (response?.error) {
                return toast.error(response.error);
            }
            if (response?.ok) {
                router.push('/users');
                return toast.success('Login successful');
            }
        } catch (error) {
            console.log(error);
            return toast.error(`Something went wrong!`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md">
            <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {variant === 'REGISTER' && (
                        <Input
                            id="name"
                            type="text"
                            label="Name"
                            register={register}
                            errors={errors}
                            placeholder="Enter your name"
                            required={true}
                            disabled={isLoading}
                        />
                    )}
                    <Input
                        id="email"
                        type="email"
                        label="Email address"
                        register={register}
                        errors={errors}
                        placeholder="Enter your email"
                        required={true}
                        disabled={isLoading}
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        register={register}
                        errors={errors}
                        placeholder="Enter your password"
                        required={true}
                        disabled={isLoading}
                    />
                    <div className="">
                        <Button
                            disabled={isLoading}
                            fullWidth={true}
                            type="submit"
                            className="transition-transform active:scale-[99%]"
                        >
                            {
                                variant === 'LOGIN' ? 'Sign in' : 'Register'
                            }
                        </Button>
                    </div>
                </form>

                {error && <div className="mt-6 w-full flex justify-center items-center">
                    <p className='text-[12px] text-red-500 font-bold' >Error : {error}</p>
                </div>}

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-sm text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            disabled={isLoading}

                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            disabled={isLoading}
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>

                    <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                        <div className="">
                            {variant === 'LOGIN' ? 'New to our platform?' : 'Already have an account?'}
                        </div>
                        <div className=" underline cursor-pointer" onClick={toggleVarient}>
                            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm;