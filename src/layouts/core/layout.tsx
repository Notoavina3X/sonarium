import { type ReactNode } from "react";
import LeftSidebar from "./left-sidebar";
import RightSidebar from "./right-sidebar";
import NewPost from "@/components/core/form/new-post";
import { useAtom } from "jotai";
import { isModalOpenAtom } from "@/atoms/modalAtoms";

type LayoutProps = {
  children: ReactNode;
};
function Layout({ children }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);

  const handleOpenModal = () => setIsModalOpen(true);
  return (
    <div className="container mx-auto flex items-start gap-2">
      <LeftSidebar handleOpenModal={() => void handleOpenModal()} />
      {children}
      <NewPost />
      <RightSidebar />
    </div>
  );
}

export default Layout;
