import getCurrentUser from "@/actions/getCurrentUser";
import DextopSidebar from "./DextopSidebar";
import MobileFooter from "./MobileFooter";

const Sidebar: React.FC<React.PropsWithChildren> = async ({ children }) => {

    const currentUser = await getCurrentUser();

    return (
        <div className="h-full">
            <DextopSidebar currentUser={currentUser} />
            <MobileFooter currentUser={currentUser} />
            <main className="lg:pl-20 h-full" >
                {children}
            </main>
        </div>
    );
};

export default Sidebar;