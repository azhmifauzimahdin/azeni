const WorkflowSection: React.FC = () => {
  const stepsOne = [
    {
      title: "Login ke Aplikasi",
      description:
        "Masuk menggunakan akun yang sudah terdaftar atau daftar baru untuk mulai membuat undangan.",
    },
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
      className="py-16 bg-background relative overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-app-primary opacity-10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-green-app-primary opacity-10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 text-center">
        <div className="text-center mb-6" data-aos="fade-up">
          <h2 className="relative inline-block text-3xl font-bold tracking-tight text-green-app-primary">
            Alur Membuat Undangan
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-16 h-1 bg-green-app-primary/60 rounded-full" />
          </h2>
        </div>
        <p
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-16"
          data-aos="fade-up"
        >
          Mulai undangan digital impian Anda dalam 6 langkah mudah.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {stepsOne.map((step, i) => (
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
