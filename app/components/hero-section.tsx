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
            <span className="font-semibold text-lg text-white">
              {process.env.NEXT_PUBLIC_BRAND_NAME}
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-white text-sm">
            <Link href="#fitur" className="hover:underline">
              Fitur
            </Link>
            <Link href="#tema" className="hover:underline">
              Tema
            </Link>
            <Link href="#tutorial" className="hover:underline">
              Tutorial
            </Link>
            <Link href="#faq" className="hover:underline">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative flex flex-col items-center justify-center px-6 h-screen text-center bg-gradient-to-br from-green-app-primary to-green-600 text-white overflow-hidden">
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
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-md"
            data-aos="fade-down"
          >
            Undangan Pernikahan Digital Modern dari&nbsp;
            {process.env.NEXT_PUBLIC_BRAND_NAME}
          </h1>
          <p className="text-lg md:text-xl mb-6" data-aos="fade-up">
            Buat undangan elegan dan fleksibel langsung dari genggaman.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <LinkButton
              href="#tema"
              className="rounded-full px-8 py-3 text-base bg-white text-green-app-primary hover:bg-gray-100 transition-all"
            >
              Lihat Tema <ArrowRight className="ml-2 w-4 h-4" />
            </LinkButton>
            <LinkButton
              href="/sign-in"
              className="rounded-full px-8 py-3 text-base bg-transparent border border-white text-white hover:bg-white/10 transition-all"
            >
              Mulai Sekarang <LogIn className="ml-2 w-4 h-4" />
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
