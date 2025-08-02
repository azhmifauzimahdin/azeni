"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Apakah tamu bisa check-in digital?",
    a: "Bisa! Undangan mendukung fitur check-in dan check-out digital untuk memudahkan pencatatan kehadiran.",
  },
  {
    q: "Apakah data undangan bisa diisi sendiri?",
    a: "Tentu, kamu bebas mengisi dan mengelola data undangan kapan saja, tanpa batas.",
  },
  {
    q: "Apakah bisa mengganti tema undangan?",
    a: "Ya, kamu bisa mengganti tema undangan kapan pun tanpa mengulang dari awal.",
  },
  {
    q: "Apakah musik bisa diganti-ganti?",
    a: "Bisa! Musik pada undangan dapat kamu pilih dan ganti kapan saja sesuai selera.",
  },
  {
    q: "Apakah ada fitur RSVP?",
    a: "Ada! Undangan dilengkapi dengan RSVP interaktif agar tamu bisa konfirmasi kehadiran dengan mudah.",
  },
  {
    q: "Berapa batas jumlah tamu yang bisa diundang?",
    a: "Tidak ada batas! Kamu bisa undang tamu sebanyak yang kamu mau.",
  },
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
              <AccordionContent className="text-sm text-muted-foreground">
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
