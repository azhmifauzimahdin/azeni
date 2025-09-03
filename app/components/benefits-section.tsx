import { CheckCircle } from "lucide-react";

const BenefitsSection: React.FC = () => {
  const advantages = [
    "Check-in & Check-out tamu digital",
    "Isi data undangan sendiri atau dibantu admin",
    "Ganti tema kapan saja",
    "Bisa ganti musik tanpa batas",
    "Tersedia menu RSVP interaktif",
    "Undang tamu tanpa batas",
    "Proses lebih cepat tanpa antri",
    "Tema favorit belum tersedia? Bisa request khusus sesuai keinginan",
    "Tema tanpa foto tetap bisa ganti foto karakter sesuai pilihan",
  ];

  return (
    <section className="py-16 px-6" id="fitur">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="relative inline-block text-3xl font-bold tracking-tight text-green-app-primary">
            Kenapa Pilih {process.env.NEXT_PUBLIC_BRAND_NAME}?
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-16 h-1 bg-green-app-primary/60 rounded-full" />
          </h2>
        </div>
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
