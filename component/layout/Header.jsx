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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const updateUser = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser();
    
    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      updateUser();
    };
    
    // Listen for custom auth event (login/logout in same tab)
    const handleAuthChange = () => {
      updateUser();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Link href={BRAND.href} className="text-lg font-bold text-zinc-100 hover:text-indigo-400 transition-colors md:text-xl">
          {BRAND.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-zinc-100 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-6 bg-zinc-100 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-zinc-100 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="absolute left-0 right-0 top-full border-t border-zinc-800 bg-zinc-950 p-4 md:hidden">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  {AUTH_BUTTONS.loggedIn.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                  >
                    {user.username}
                  </Link>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  {AUTH_BUTTONS.loggedOut.map((btn) => (
                    <Button
                      key={btn.href}
                      href={btn.href}
                      variant={btn.variant}
                      size="sm"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

