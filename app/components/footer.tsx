import Link from "next/link";
import { Mail, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div
        className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        data-aos="fade-up"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {process.env.NEXT_PUBLIC_BRAND_NAME}
          </h2>
          <p className="text-sm leading-relaxed">
            Undangan digital modern, fleksibel, dan siap dibagikan ke semua
            orang.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2">Navigasi</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:text-foreground transition">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="#fitur" className="hover:text-foreground transition">
                Fitur
              </Link>
            </li>
            <li>
              <Link href="#tema" className="hover:text-foreground transition">
                Tema
              </Link>
            </li>
            <li>
              <Link
                href="#tutorial"
                className="hover:text-foreground transition"
              >
                Tutorial
              </Link>
            </li>
            <li>
              <Link href="#faq" className="hover:text-foreground transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2">Kontak</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <Link
                href="mailto:azen.invitation@gmail.com"
                className="hover:text-foreground transition"
              >
                azen.invitation@gmail.com
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              <Link
                href="https://www.instagram.com/azen.inv?igsh=Nmp6djVucWNzejdm&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition"
              >
                @azen.inv
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}{" "}
        <strong>{process.env.NEXT_PUBLIC_BRAND_NAME}</strong>. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
