"use client";

import { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import { NAV_LINKS, AUTH_BUTTONS, BRAND } from "./constants";

const NavLink = memo(({ href, label }) => (
  <Link href={href} className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors">
    {label}
  </Link>
));

NavLink.displayName = "NavLink";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href={BRAND.href} className="text-xl font-bold text-zinc-100 hover:text-indigo-400 transition-colors">
          {BRAND.name}
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          {user ? (
            <>
              {AUTH_BUTTONS.loggedIn.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
              <div className="flex items-center gap-3">
                <Link href="/profile" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer">
                  {user.username}
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {AUTH_BUTTONS.loggedOut.map((btn) => (
                <Button key={btn.href} href={btn.href} variant={btn.variant} size="sm">
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

