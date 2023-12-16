'use client'
import useConversation from "@/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

const ChatForm: React.FC = () => {

    const { conversationId } = useConversation();
    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setValue('message', '', { shouldValidate: true });
            const response = await axios.post(`/api/messages`, {
                ...data,
                conversationId
            });
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message || error.message || 'Something went wrong')
        }
    }

    const handleUpload = async (result: any) => {
        try {
            const response = await axios.post(`/api/messages`, {
                image: result?.info?.secure_url,
                conversationId
            });
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message || error.message || 'Something went wrong');
        }
    }

    return (
        <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
            <CldUploadButton
                options={{
                    maxFiles: 1,
                }}
                onUpload={handleUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            >
                <HiPhoto
                    size={30}
                    className='text-sky-500'
                />
            </CldUploadButton>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <MessageInput
                    id='message'
                    register={register}
                    errors={errors}
                    required
                    placeholder='Write a message'
                />
                <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full cursor-pointer transition"
                >
                    <HiPaperAirplane
                        size={20}
                        className='text-white'
                    />
                </button>
            </form>
        </div>
    )
}

export default ChatForm;