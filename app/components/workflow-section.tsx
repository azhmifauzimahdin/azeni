const WorkflowSection: React.FC = () => {
  const steps = [
    {
      title: "Pilih Tema Favorit",
      description:
        "Jelajahi tema undangan yang elegan, simpel, dan responsif di semua perangkat.",
    },
    {
      title: "Isi Informasi Dasar",
      description:
        "Sediakan informasi inti yang dibutuhkan untuk undangan digital Anda.",
    },
    {
      title: "Lakukan Pembayaran",
      description:
        "Pilih metode pembayaran yang nyaman, aman, dan langsung aktif setelah konfirmasi.",
    },
    {
      title: "Lengkapi Isi Undangan",
      description:
        "Tambahkan detail seperti jadwal, lokasi, galeri, RSVP, hingga musik favorit.",
    },
    {
      title: "Bagikan ke Tamu",
      description:
        "Bagikan undangan secara instan ke teman dan keluarga melalui berbagai platform.",
    },
  ];

  return (
    <section
      id="tutorial"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-app-primary opacity-10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-green-app-primary opacity-10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4" data-aos="fade-up">
          Cara Kerja Aplikasi
        </h2>
        <p
          className="text-muted-foreground mb-16 max-w-2xl mx-auto"
          data-aos="fade-up"
        >
          Mulai undangan digital impian Anda dalam 5 langkah mudah.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="bg-gradient-to-br from-white/60 to-muted backdrop-blur-sm border border-border rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-full bg-green-app-primary text-white flex items-center justify-center shadow-md text-sm font-bold">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold group-hover:text-green-app-primary transition-colors">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
