import { type ReactNode } from "react";
import LeftSidebar from "./left-sidebar";
import RightSidebar from "./right-sidebar";
import NewPost from "@/components/core/form/new-post";
import BottomNav from "./bottom-nav";
import SharePost from "@/components/core/form/share-post";
import CommentPost from "@/components/core/form/comment-post";
import ConfirmPopup from "@/components/core/ui/confirm-popup";

type LayoutProps = {
  children: ReactNode;
};
function Layout({ children }: LayoutProps) {
  return (
    <div className="container mx-auto flex items-start gap-2">
      <LeftSidebar />
      {children}
      <NewPost />
      <SharePost />
      <CommentPost />
      <ConfirmPopup />
      <RightSidebar />
      <BottomNav />
    </div>
  );
}

export default Layout;
