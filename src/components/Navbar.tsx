import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#details", label: "Details" },
    { href: "#tracks", label: "Tracks" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <img src="hacksus_logo.svg" className="h-12" alt="HackSUS Logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-sm tracking-wide group"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </a>
                ))}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="relative text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-sm tracking-wide group"
                >
                  Home
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
                <a
                  href="/#tracks"
                  className="relative text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-sm tracking-wide group"
                >
                  Tracks
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </>
            )}
            <a
              href="https://konfhub.com/hacksus-edition-5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-6 py-2 font-display tracking-wider text-sm hover:bg-primary/90 transition-colors rounded-xl"
            >
              REGISTER NOW
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border">
            <div className="flex flex-col py-4">
              {isHomePage ? (
                <>
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-6 py-3 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="px-6 py-3 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Home
                  </Link>
                  <a
                    href="/#tracks"
                    className="px-6 py-3 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Tracks
                  </a>
                </>
              )}
              <a
                href="#register"
                className="mx-6 mt-4 bg-primary text-primary-foreground px-6 py-3 font-display tracking-wider text-center rounded-lg"
                onClick={() => setIsMobileOpen(false)}
              >
                REGISTER
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
