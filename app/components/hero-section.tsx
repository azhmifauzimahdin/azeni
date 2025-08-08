import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/link";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <>
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center text-lg font-medium tracking-wide text-white"
            >
              <Img
                src="/assets/img/azen-white.png"
                alt="sample"
                wrapperClassName="w-[1.04rem] h-[1.04rem]"
                sizes="300px"
                priority
              />
              <div className="pt-0.5 font-medium">
                {(process.env.NEXT_PUBLIC_BRAND_NAME ?? "").slice(1)}
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 text-white text-sm">
            {[
              { href: "#fitur", label: "Fitur" },
              { href: "#tema", label: "Tema" },
              { href: "#tutorial", label: "Tutorial" },
              { href: "#faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative transition-colors duration-200 hover:text-white/80"
              >
                <span className="after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full">
                  {label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative flex flex-col items-center justify-center px-6 min-h-[calc(var(--vh)_*_100)] text-center bg-gradient-to-br from-green-app-primary to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Img
            src="https://res.cloudinary.com/dxtqjuvcg/image/upload/v1754051526/pattern_qhwe3b.jpg"
            alt="pattern"
            wrapperClassName="w-full h-full"
            className="object-cover"
            priority
          />
        </div>

        <div className="max-w-3xl z-10">
          <Img
            src="/assets/img/azen-white.png"
            alt="sample"
            wrapperClassName="w-28 h-28 mx-auto"
            sizes="500px"
            priority
          />
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-md"
            data-aos="fade-down"
          >
            Undangan Pernikahan Digital dari&nbsp;
            {process.env.NEXT_PUBLIC_BRAND_NAME}
          </h1>
          <p className="text-lg md:text-xl mb-6" data-aos="fade-up">
            Buat undangan elegan dan fleksibel langsung dari genggaman.
          </p>

          <div
            className="flex flex-wrap gap-4 justify-center items-center"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <LinkButton
              href="#tema"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-base font-medium bg-white text-green-app-primary hover:bg-gray-100 transition-all duration-200"
            >
              Lihat Tema
              <ArrowRight className="w-4 h-4" />
            </LinkButton>

            <LinkButton
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-base font-medium border border-white text-white bg-transparent hover:bg-white/10 transition-all duration-200"
            >
              Masuk
              <LogIn className="w-4 h-4" />
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
