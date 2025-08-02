import { CheckCircle } from "lucide-react";

const BenefitsSection: React.FC = () => {
  const advantages = [
    "Check-in & Check-out tamu digital",
    "Isi data undangan sendiri tanpa batas",
    "Ganti tema kapan saja",
    "Bisa ganti musik tanpa batas",
    "Tersedia menu RSVP interaktif",
    "Undang tamu tanpa batas",
  ];

  return (
    <section className="py-24 px-6 bg-gray-50" id="fitur">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12" data-aos="fade-up">
          Kenapa Pilih {process.env.NEXT_PUBLIC_BRAND_NAME}?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {advantages.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-gray-700"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <CheckCircle className="text-green-app-primary w-5 h-5 mt-1" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BenefitsSection;
