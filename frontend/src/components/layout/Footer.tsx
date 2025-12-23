import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Thangkas', href: '/shop' },
    { name: 'Buddha Collection', href: '/shop?category=buddha' },
    { name: 'Mandala Art', href: '/shop?category=mandala' },
    { name: 'Deity Paintings', href: '/shop?category=deity' },
    { name: 'New Arrivals', href: '/shop?sort=newest' },
  ],
  artists: [
    { name: 'Featured Artists', href: '/artists' },
    { name: 'Become an Artist', href: '/apply-artist' },
    { name: 'Artist Guidelines', href: '/artist-guidelines' },
    { name: 'Verification Process', href: '/verification' },
  ],
  support: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Shipping & Returns', href: '/shipping' },
    { name: 'Care Instructions', href: '/care' },
    { name: 'FAQ', href: '/faq' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-display text-lg">ॐ</span>
              </div>
              <span className="font-display text-2xl text-background tracking-wide">
                Thangka<span className="text-secondary">Art</span>
              </span>
            </Link>
            <p className="font-body text-background/70 text-sm leading-relaxed mb-6 max-w-sm">
              Connecting sacred Himalayan art with collectors worldwide. Every Thangka tells a story 
              of devotion, tradition, and centuries of artistic mastery.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-lg mb-4 text-secondary">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="font-ui text-sm text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Artists Links */}
          <div>
            <h4 className="font-display text-lg mb-4 text-secondary">Artists</h4>
            <ul className="space-y-2">
              {footerLinks.artists.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="font-ui text-sm text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display text-lg mb-4 text-secondary">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="font-ui text-sm text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <a
              href="mailto:namaste@thangkaart.com"
              className="flex items-center gap-2 font-ui text-sm text-background/70 hover:text-secondary transition-colors"
            >
              <Mail className="h-4 w-4" />
              namaste@thangkaart.com
            </a>
            <a
              href="tel:+977-1-4444444"
              className="flex items-center gap-2 font-ui text-sm text-background/70 hover:text-secondary transition-colors"
            >
              <Phone className="h-4 w-4" />
              +977-1-4444444
            </a>
            <span className="flex items-center gap-2 font-ui text-sm text-background/70">
              <MapPin className="h-4 w-4" />
              Thamel, Kathmandu, Nepal
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-ui text-xs text-background/50">
              © {new Date().getFullYear()} ThangkaArt. All rights reserved. Preserving sacred art traditions.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="font-ui text-xs text-background/50 hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-ui text-xs text-background/50 hover:text-secondary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
