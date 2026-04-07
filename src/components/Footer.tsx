import { Github, Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "https://x.com/rset_iedc", label: "Twitter" },
    { icon: Facebook, href: "https://www.facebook.com/iedc.rset/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/rsetiedc/", label: "Instagram" },
    { icon: Linkedin, href: "https://in.linkedin.com/company/rset-iedc", label: "LinkedIn" }
  ];

  return (
    <footer id="footer" className="relative py-16 border-t border-border bg-[#000000]">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:items-center">
          {/* Contact Info */}
          <div className="space-y-6 text-center md:text-left">
            <div>
              <p className="font-mono text-foreground mb-1">Abraham Manoj</p>
              <p className="font-mono text-sm text-muted-foreground">Phone: +91 70120 79459</p>
              <p className="font-mono text-sm text-muted-foreground">Email: abrahammadamana@gmail.com</p>
            </div>
            <div>
              <p className="font-mono text-foreground mb-1">Sebastian Robin</p>
              <p className="font-mono text-sm text-muted-foreground">Phone: +91 62827 67986</p>
              <p className="font-mono text-sm text-muted-foreground">Email: seb.rbn0@gmail.com</p>
            </div>
            <div>
              <p className="font-mono text-foreground mb-1">Aaron Thomas</p>
              <p className="font-mono text-sm text-muted-foreground">Phone: +91 84480 59331</p>
              <p className="font-mono text-sm text-muted-foreground">Email: aaronthomas25700@gmail.com</p>
            </div>
          </div>

          <div className="flex flex-wrap [@media(min-width:1115px)]:flex-nowrap justify-center items-center gap-6 max-w-[340px] [@media(min-width:1115px)]:max-w-none mx-auto">
            <img className="w-40" src="/images/iic_logo.webp" alt="RSET IIC" />
            <img className="w-40" src="/images/rset_jubilee.webp" alt="Silver Jubilee RSET" />
            <img className="w-40" src="/images/rset_iedc.PNG" alt="RSET IEDC" />
          </div>

          {/* ASCII Art
          <div className="hidden md:block font-mono text-xs text-muted-foreground/50 text-center whitespace-pre leading-none">
            {`   _____
  |     |
  | [_] |
  |_____|
  _|___|_
 |_______|`}
          </div> */}

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="font-mono">Follow Us</div>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  // opens the socials in another tab
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            {/* Email contacts */}
            <div className="flex flex-col gap-2 mt-4">
              <a href="mailto:rsetiedc@rajagiritech.edu.in" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm">
                <Mail size={16} />
                <span>rsetiedc@rajagiritech.edu.in</span>
              </a>
              <a href="mailto:iic_rset@rajagiritech.edu.in" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm">
                <Mail size={16} />
                <span>iic_rset@rajagiritech.edu.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            Made with {"</>"} by HackS'US Team
          </p>
          <div className="flex gap-6 font-mono text-xs text-muted-foreground">
            <p className="hover:text-primary transition-colors">Code of Conduct</p>
            <p className="hover:text-primary transition-colors">Privacy Policy</p>
            <p className="hover:text-primary transition-colors">Terms</p>
          </div>
        </div>

        {/* Easter egg hint
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-muted-foreground/30">
            {"// Try the Konami code... if you dare"}
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
