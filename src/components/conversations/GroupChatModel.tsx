"use client";
import { User } from "@prisma/client";
import Model from "../Model";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "../inputs/Input";
import Select from "../inputs/Select";
import Button from "../buttons/Button";

interface GroupChatModelProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[]
}

const GroupChatModel: React.FC<GroupChatModelProps> = ({
    isOpen,
    onClose,
    users
}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            members: []
        }
    });

    const members = watch('members');

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/conversations`, {
                ...data,
                isGroup: true
            });
            const { success, message } = response.data;
            if (success) {
                router.refresh();
                onClose();
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
            isOpen={isOpen}
            onClose={onClose}
        >
            <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900" >
                            Create a group chat
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600" >
                            Create a group chat with more than 2 people.
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                placeholder="Enter group name"
                                register={register}
                                disabled={isLoading}
                                required
                                errors={errors}
                                id="name"
                                label="Name"
                            />
                            <Select
                                disabled={isLoading}
                                label="Members"
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name
                                }))}
                                onChange={(value) => setValue('members', value, {
                                    shouldValidate: true
                                })}
                                value={members}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button disabled={isLoading} type="button" onClick={onClose} secondary >
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit" >
                        Create
                    </Button>
                </div>
            </form>
        </Model>
    );
};

export default GroupChatModel;