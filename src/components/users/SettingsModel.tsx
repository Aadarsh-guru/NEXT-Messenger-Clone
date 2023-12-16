"use client";
import { CurrentUser } from "@/types";
import Model from "../Model";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "../inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../buttons/Button";

interface SettingsModelProps {
    currentUser: CurrentUser;
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModel: React.FC<SettingsModelProps> = ({
    currentUser,
    isOpen,
    onClose
}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        }
    });

    const image = watch('image');

    const handleUpload = async (result: any) => {
        setValue("image", result?.info?.secure_url, {
            shouldValidate: true
        });
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/settings`, data);
            const { message, success } = response.data;
            if (success) {
                router.refresh();
                onClose();
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || error.message || 'something went wrong.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Model
            onClose={onClose}
            isOpen={isOpen}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className=" space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Profile
                        </h2>
                        <p className="mt-1 text-sm leading-6 to-gray-600" >
                            Edit your information.
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                disabled={isLoading}
                                label="Name"
                                id="name"
                                errors={errors}
                                required
                                register={register}
                                placeholder="Enter your name"
                            />
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="image">
                                    Profile photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <Image
                                        alt="avatar"
                                        className="rounded-full"
                                        width={48}
                                        height={48}
                                        src={image && currentUser?.image || '/images/placeholder.jpg'}
                                    />
                                    <CldUploadButton
                                        options={{
                                            maxFiles: 1
                                        }}
                                        onUpload={handleUpload}
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                    >
                                        <Button disabled={isLoading} secondary type="button" >
                                            Change
                                        </Button>
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Button disabled={isLoading} secondary onClick={onClose} >
                            Cancel
                        </Button>
                        <Button disabled={isLoading} type="submit" >
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </Model>
    )
}

export default SettingsModel;