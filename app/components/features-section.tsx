import { Img } from "@/components/ui/Img";

const FeaturesSection: React.FC = () => {
  const sections = [
    {
      label: "Tema Elegan",
      icon: "/assets/img/theme.png",
      description:
        "Tema undangan yang elegan, simpel, dan responsif di semua perangkat, sesuai selera kalian.",
    },
    {
      label: "Check-in & Check-out",
      icon: "/assets/img/scan.png",
      description:
        "Tamu dapat check-in dan check-out digital dengan mudah menggunakan QR code.",
    },
    {
      label: "Tamu Tanpa Batas",
      icon: "/assets/img/wedding-invitation.png",
      description: "Undang tamu sebanyak yang kamu mau, tanpa batasan jumlah.",
    },
    {
      label: "Musik Favorit",
      icon: "/assets/img/music.png",
      description:
        "Tambahkan musik favorit untuk membuat undangan lebih hidup dan personal.",
    },
    {
      label: "Quote Romantis",
      icon: "/assets/img/quote.png",
      description:
        "Tambahkan kutipan atau pesan spesial untuk menginspirasi tamu undangan.",
    },
    {
      label: "Media Sosial",
      icon: "/assets/img/media-social.png",
      description:
        "Bagikan undangan melalui media sosial dengan mudah dan cepat.",
    },
    {
      label: "Hitung Mundur",
      icon: "/assets/img/countdown.png",
      description:
        "Tampilkan countdown menuju hari pernikahan agar tamu semakin bersemangat.",
    },
    {
      label: "Simpan Kalender",
      icon: "/assets/img/schedule.png",
      description:
        "Tamu bisa langsung menyimpan jadwal acara ke kalender mereka.",
    },
    {
      label: "Navigasi Lokasi",
      icon: "/assets/img/maps.png",
      description:
        "Berikan petunjuk lokasi acara agar tamu mudah menemukan tempat.",
    },
    {
      label: "Live Streaming",
      icon: "/assets/img/streaming.png",
      description:
        "Tamu yang tidak hadir tetap bisa menyaksikan acara secara live.",
    },
    {
      label: "Cerita Kita",
      icon: "/assets/img/love-story.png",
      description:
        "Ceritakan perjalanan cintamu secara interaktif dan menarik.",
    },
    {
      label: "Galeri Foto",
      icon: "/assets/img/gallery.png",
      description:
        "Tampilkan momen-momen spesial melalui galeri foto dan video.",
    },
    {
      label: "Amplop Digital / Kado Fisik",
      icon: "/assets/img/gift.png",
      description:
        "Tamu bisa memberikan amplop digital atau kado fisik sesuai pilihan, mudah dan praktis.",
    },
    {
      label: "RSVP Interaktif",
      icon: "/assets/img/rsvp.png",
      description:
        "Tamu bisa langsung konfirmasi kehadiran melalui RSVP interaktif.",
    },
    {
      label: "Ucapan & Doa",
      icon: "/assets/img/comment.png",
      description:
        "Tamu bisa menuliskan ucapan selamat dan doa untuk pengantin.",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50" id="fitur">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <div className="mb-12" data-aos="fade-up">
          <h2 className="relative inline-block text-3xl font-extrabold tracking-tight text-green-app-primary">
            Fitur {process.env.NEXT_PUBLIC_BRAND_NAME}?
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-20 h-1 bg-green-app-primary/60 rounded-full" />
          </h2>
          <p className="mt-3 text-gray-500 text-sm md:text-base">
            Semua fitur lengkap untuk undangan digitalmu ✨
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {sections.map((section, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="bg-gradient-to-br from-white/60 to-muted backdrop-blur-sm border border-border rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-full bg-green-app-primary flex items-center justify-center shadow-md text-sm font-bold">
                  <Img
                    src={section.icon}
                    alt={section.label}
                    sizes="24px"
                    wrapperClassName="w-6 aspect-square transition"
                  />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-green-app-primary transition-colors">
                  {section.label}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
