import {
  Avatar,
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  session: Session | null;
};

const Header: React.FC<Props> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="pr-3 sm:hidden" justify="center">
        <NavbarBrand>
          <Image
            src="/megalan_logo.png"
            width={500}
            height={250}
            alt="logo"
            className="h-5 w-fit"
          />
          {/* <p className="font-bold text-inherit">MegaLAN</p> */}
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarBrand>
          <Image
            src="/megalan_logo.png"
            width={500}
            height={250}
            alt="logo"
            className="h-5 w-fit"
          />
          {/* <p className="font-bold text-inherit">MegaLAN</p> */}
        </NavbarBrand>
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link color="foreground" href={item.href}>
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {session ? (
            <Avatar
              alt="pfp"
              src={session.user.image ?? undefined}
              showFallback
              fallback={<PersonIcon className="text-black" />}
              size="md"
              onClick={() => router.push("/settings")}
            />
          ) : (
            <Button
              as={Button}
              color="warning"
              href="#"
              variant="flat"
              onClick={() => signIn()}
            >
              Log In
            </Button>
          )}
        </NavbarItem>
        <NavbarItem className="flex lg:hidden">
          {session ? (
            <Avatar
              alt="pfp"
              src={session.user.image ?? undefined}
              showFallback
              fallback={<PersonIcon className="text-black" />}
              size="md"
              onClick={() => router.push("/settings")}
            />
          ) : (
            <Button
              as={Button}
              color="warning"
              href="#"
              variant="flat"
              onClick={() => signIn()}
            >
              Log In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href={item.href}
              size="lg"
              color="foreground"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem key="auth">
          {session ? (
            <Link
              className="w-fit"
              color="danger"
              size="lg"
              onClick={() => signOut()}
            >
              Log Out
            </Link>
          ) : (
            <Link
              className="w-full"
              color="warning"
              size="lg"
              onClick={() => signIn()}
            >
              Log In
            </Link>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
