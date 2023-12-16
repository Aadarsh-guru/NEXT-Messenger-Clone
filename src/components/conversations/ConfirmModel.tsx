'use client'
import useConversation from "@/hooks/useConversation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Model from "../Model";
import { FiAlertTriangle } from 'react-icons/fi';
import { Dialog } from "@headlessui/react";
import Button from "../buttons/Button";

interface ConfirmModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConfirmModel: React.FC<ConfirmModelProps> = ({
    isOpen,
    onClose
}) => {

    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.delete(`/api/conversations/${conversationId}`)
            if (data?.success) {
                onClose();
                toast.success(data?.message);
                router.push('/conversations');
                return router.refresh();
            } else {
                return toast.error(data?.message);
            }
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || error.message || 'something went wrong.')
        } finally {
            setIsLoading(false);
        }
    }, [router, conversationId, onClose]);

    return (
        <Model
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="sm:flex sm:items-start">
                <div className="mt-2 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertTriangle className='h-6 w-6 text-red-600' />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                        Delete Conversation
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 flex flex-row-reverse justify-between sm:justify-start sm:flex-row-reverse">
                <Button
                    disabled={isLoading}
                    danger
                    onClick={onDelete}
                >
                    Delete
                </Button>
                <Button
                    disabled={isLoading}
                    secondary
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </Model>
    );
};

export default ConfirmModel;