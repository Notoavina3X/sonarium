import React from "react";

// Importing components from "@nextui-org/react" library
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarBrand,
  NavbarMenuItem,
  NavbarItem,
  cn,
} from "@nextui-org/react";
import Link from "next/link";
import { staticConfig } from "@/config/static";
import ThemeSwitch from "@/components/static/ThemeSwitch";

// Creating the Navbar component
const Navbar = React.forwardRef<HTMLElement>((props, ref) => {
  // State to track if the menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean | undefined>(
    false
  );

  // Handle scroll event when the menu is open
  React.useEffect(() => {
    const handleScroll = (event: Event) => {
      // Prevent scrolling when the menu is open
      if (!isMenuOpen) {
        event.preventDefault();
        window.scrollTo(0, 0);
      }
    };

    // Add event listener for scroll when the menu is open
    if (isMenuOpen) {
      window.addEventListener("scroll", handleScroll, { passive: false });
    }

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  // Render the Navbar component
  return (
    <NextUINavbar
      shouldHideOnScroll={!isMenuOpen}
      className={cn(
        "z-50 after:absolute after:bottom-0 after:h-[1px] after:w-[80%] after:bg-gradient-to-r after:from-transparent after:via-background after:to-transparent after:content-['']",
        !isMenuOpen &&
          "rounded-2xl bg-black font-semibold text-primary dark:bg-primary dark:text-black",
        isMenuOpen && "bg-background text-foreground"
      )}
      isBlurred={false}
      onMenuOpenChange={setIsMenuOpen}
      ref={ref}
    >
      <NavbarContent>
        <NavbarBrand>
          <Link
            href="/"
            className={cn(
              "aspect-square h-12 bg-contain bg-center bg-no-repeat",
              isMenuOpen &&
                "bg-[url('/logo-black.svg')] dark:bg-[url('/logo-white.svg')]",
              !isMenuOpen &&
                "bg-[url('/logo.svg')] dark:bg-[url('/logo-black.svg')]"
            )}
          ></Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden gap-5 sm:flex" justify="center">
        {staticConfig.mainNav.map(({ title, href }) => (
          <NavbarItem key={title}>
            <Link href={href}>{title}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarMenu className="flex overflow-hidden">
        <div className="flex flex-1 flex-col justify-evenly ps-5 md:hidden">
          {staticConfig.mainNav.map(({ title, href }) => (
            <NavbarMenuItem key={title}>
              <Link
                href={href}
                className="text-4xl font-bold hover:text-primary focus:text-primary active:text-primary"
              >
                {title}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
        <div className="grid flex-1 place-items-center">
          <ThemeSwitch />
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
});

// Set the display name of the Navbar component
Navbar.displayName = "Navbar";

export default Navbar;
