import { type ReactNode } from "react";
type NavbarProps = {
  children: ReactNode;
};

export default function Navbar({ children }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background px-3 py-2">{children}</nav>
  );
}
