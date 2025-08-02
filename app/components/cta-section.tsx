import { LinkButton } from "@/components/ui/link";
import { ArrowRight } from "lucide-react";

const CtaSection: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-green-app-primary text-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6" data-aos="fade-up">
        Mulai Buat Undanganmu Hari Ini
      </h2>
      <p className="mb-8 text-lg" data-aos="fade-up" data-aos-delay="100">
        Gratis daftar, tanpa batasan pembuatan!
      </p>
      <LinkButton
        href="/sign-up"
        className="bg-white text-green-app-primary px-8 py-3 rounded-full hover:bg-gray-100 transition-all"
        data-aos="zoom-in"
        data-aos-delay="200"
      >
        Daftar Sekarang <ArrowRight className="ml-2 w-4 h-4" />
      </LinkButton>
    </section>
  );
};

export default CtaSection;
