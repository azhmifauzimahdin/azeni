"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Apakah pengisian undangan bisa dibantu admin?",
    a: "Tentu! Jika kamu ingin, admin dapat membantu mengisi informasi dasar undangan dan menambahkan detail lainnya agar undanganmu siap digunakan dengan cepat.",
  },
  {
    q: "Jika tema yang diinginkan tidak tersedia, apakah bisa request?",
    a: "Bisa! Jika tema favoritmu belum tersedia, kamu dapat mengajukan request, dan tim kami akan membantu menghadirkan tema yang sesuai keinginanmu.",
  },
  {
    q: "Apakah bisa request musik untuk undangan?",
    a: "Bisa! Kamu dapat memilih dan meminta lagu favoritmu untuk diputar di undangan. Admin akan membantu menambahkan musik sesuai permintaan.",
  },
  {
    q: "Berapa lama masa aktif undangan?",
    a: "Undangan digitalmu akan aktif selama 1 tahun penuh, memberikan waktu yang cukup untuk berbagi momen spesial dengan semua tamu. Eksklusif dan langsung siap digunakan tanpa ribet!",
  },
  {
    q: "Apakah harus antri untuk membuat undangan?",
    a: "Tidak perlu! Undangan digital bisa dibuat langsung secara online, praktis tanpa antri.",
  },
  {
    q: "Apakah bisa menghapus fitur tertentu?",
    a: "Tentu! Kamu bisa menyesuaikan undangan digital dengan menghapus fitur yang tidak dibutuhkan, sehingga tampilannya tetap rapi dan sesuai keinginan.",
  },
  {
    q: "Apakah undangan bisa diakses dari semua perangkat?",
    a: "Ya! Undangan digital kami responsif dan bisa diakses dari smartphone, tablet, maupun komputer, sehingga semua tamu bisa melihat undangan dengan nyaman.",
  },
  {
    q: "Apakah bisa mengubah tema setelah undangan dibuat?",
    a: "Tentu! Kamu bisa mengganti tema kapan saja sebelum undangan dibagikan, tanpa harus membuat undangan baru.",
  },
  {
    q: "Apakah bisa mengubah informasi pengantin setelah dibuat?",
    a: "Ya! Semua informasi bisa diperbarui dengan mudah, sehingga kamu selalu bisa memastikan data undangan akurat.",
  },
  {
    q: "Apakah undangan aman dari akses yang tidak diinginkan?",
    a: "Tentu! Undangan dilindungi dengan link unik dan sistem keamanan yang handal, sehingga hanya tamu yang memiliki akses yang bisa melihat undangan.",
  },

  // {
  //   q: "Apakah tamu bisa check-in digital?",
  //   a: "Bisa! Undangan mendukung fitur check-in dan check-out digital untuk memudahkan pencatatan kehadiran.",
  // },
  // {
  //   q: "Apakah data undangan bisa diisi sendiri?",
  //   a: "Tentu, kamu bebas mengisi dan mengelola data undangan kapan saja, tanpa batas.",
  // },
  // {
  //   q: "Apakah bisa mengganti tema undangan?",
  //   a: "Ya, kamu bisa mengganti tema undangan kapan pun tanpa mengulang dari awal.",
  // },
  // {
  //   q: "Apakah musik bisa diganti-ganti?",
  //   a: "Bisa! Musik pada undangan dapat kamu pilih dan ganti kapan saja sesuai selera.",
  // },
  // {
  //   q: "Apakah ada fitur RSVP?",
  //   a: "Ada! Undangan dilengkapi dengan RSVP interaktif agar tamu bisa konfirmasi kehadiran dengan mudah.",
  // },
  // {
  //   q: "Berapa batas jumlah tamu yang bisa diundang?",
  //   a: "Tidak ada batas! Kamu bisa undang tamu sebanyak yang kamu mau.",
  // },
];

const FaqsSection: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-white" id="faq">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="relative inline-block text-3xl font-bold tracking-tight text-green-app-primary">
            Pertanyaan Umum
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-16 h-1 bg-green-app-primary/60 rounded-full" />
          </h2>
        </div>
        <Accordion type="multiple" className="w-full text-left">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="600"
            >
              <AccordionTrigger className="text-base md:text-lg  font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqsSection;
