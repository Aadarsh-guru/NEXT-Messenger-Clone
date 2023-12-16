import getConversationById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages";
import Body from "@/components/conversations/Body";
import ChatForm from "@/components/conversations/ChatForm";
import Header from "@/components/conversations/Header";
import EmptyState from "@/components/users/EmptyState";

interface IPprops {
    params: {
        conversationId: string;
    };
};

const ConversationId: React.FC<IPprops> = async ({ params: { conversationId } }) => {

    const conversation = await getConversationById(conversationId);
    const messages = await getMessages(conversationId);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    };

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <ChatForm />
            </div>
        </div>
    );
};

export default ConversationId;