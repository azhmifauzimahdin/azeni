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
    <section className="py-24 px-6 bg-white" id="faq">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10" data-aos="fade-up">
          Pertanyaan Umum
        </h2>
        <Accordion type="multiple" className="w-full text-left">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="600"
            >
              <AccordionTrigger className="text-base md:text-lg text-green-app-primary font-medium">
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
