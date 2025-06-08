"use client";

import React, { useRef, useState } from "react";
import BottomNavbar from "@/components/navigations/BottomNavbar";
import InvitationModalPremium from "@/components/modals/invitations/invitation-modal-premium";
import SpinningDisc from "@/components/ui/spinning-disc";
import { navLinks } from "@/data/navLinks";
import GoogleCalender from "@/components/ui/google-calender";
import CountdownTimer from "@/components/ui/countdown-timer";
import { formatDate } from "@/utils/formatted-date";
import Image from "@/components/ui/image";
import {
  Calendar,
  CalendarDays,
  Croissant,
  Heart,
  MapPinCheckInside,
} from "lucide-react";
import { formatTime } from "@/utils/formatted-time";
import { Button } from "@/components/ui/button";
import GalleryGrid from "@/components/ui/gallery-grid";

export default function SamplePremium1() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartAudio = () => {
    if (audioRef.current) {
      setMusicPlaying(true);
      audioRef.current.play();
    }
  };

  const invitation = {
    image: "/assets/themes/premium-001/img/cover.jpg",
    name: "Dinda & Rey",
    date: "2028-07-27 00:00:00.000",
    quote: {
      name: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      author: "- QS. Ar-Rum: 21 -",
    },
    schedule: [
      {
        type: "marriage",
        name: "Akad Nikah",
        start: "2028-07-27 10:00:00.000",
        end: "2028-07-27 12:00:00.000",
        location: "Villa Azila, Cipayung, Jakarta Timur",
        location_maps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
      },
      {
        type: "reception",
        name: "Resepsi",
        start: "2028-07-27 12:00:00.000",
        end: "2028-07-27 15:00:00.000",
        location: "Villa Azila, Cipayung, Jakarta Timur",
        location_maps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
      },
    ],
    bride: {
      name: "Nyimas Khodijah Nasthiti Adinda",
      father: "Kemas Herman",
      mother: "Hulwati Husna",
      image: "/assets/themes/premium-001/img/dinda.jpg",
    },
    groom: {
      name: "Reynaldi Aditya Wisnu Hasidi Putra Atmaja Mbayang",
      father: "Achmad Benny Mbayang",
      mother: "Lam Baghdadi",
      image: "/assets/themes/premium-001/img/rey.jpg",
    },
    love_story: [
      {
        id: 1,
        title: "Pertemuan",
        date: "2020-01-01 00:00:00.000",
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di kampus komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        image: "/assets/themes/premium-001/img/story-pertemuan.jpeg",
      },
      {
        id: 2,
        title: "Lamaran",
        date: "2025-05-25 00:00:00.000",
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        image: "/assets/themes/premium-001/img/story-lamaran.jpg",
      },
      {
        id: 2,
        title: "Pernikahan",
        date: "2028-07-27 00:00:00.000",
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        image: "/assets/themes/premium-001/img/story-pernikahan.jpg",
      },
    ],
    galleries: [
      {
        src: "/assets/themes/premium-001/img/gallery-001.jpg",
        description: "Gallery 1",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-002.jpg",
        description: "Gallery 2",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-003.jpg",
        description: "Gallery 3",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-004.jpg",
        description: "Gallery 4",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-005.jpg",
        description: "Gallery 5",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-006.jpg",
        description: "Gallery 6",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-007.jpg",
        description: "Gallery 7",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-008.jpg",
        description: "Gallery 8",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-009.jpg",
        description: "Gallery 9",
      },
      {
        src: "/assets/themes/premium-001/img/gallery-010.jpg",
        description: "Gallery 10",
      },
    ],
  };

  const formattedMarriageDate = formatDate(
    invitation.date,
    "EEEE, dd MMMM yyyy"
  );
  const marriageEvent = invitation.schedule.find(
    (item) => item.type === "marriage"
  );

  return (
    <div>
      <audio
        ref={audioRef}
        src="/assets/themes/premium-001/sounds/backsound.mp3"
        loop
      />
      <SpinningDisc play={musicPlaying} />
      <BottomNavbar navLinks={navLinks} />

      <InvitationModalPremium
        isOpen={isModalOpen}
        onClose={() => {
          handleStartAudio();
          setIsModalOpen(false);
        }}
        invitation={invitation}
      />

      <section
        id="hero"
        // className="bg-[url('/assets/themes/premium-001/img/bg-001.jpg')] bg-img-default"
      >
        <div className="flex-section">
          <div>The Wedding Of</div>
          <Image
            src={invitation.image}
            alt="Foto"
            aspectRatio="aspect-square"
            className="w-5/12 md:w-2/12 rounded-tr-3xl rounded-br-lg rounded-bl-3xl rounded-tl-lg shadow-md mb-3"
          />
          <div className="mb-3">
            <div className="font-alex text-5xl text-green-primary">
              {invitation.name}
            </div>
            <div>{formattedMarriageDate}</div>
          </div>
          <GoogleCalender
            title={`Pernikahan ${invitation.name}`}
            startTime={marriageEvent?.start || invitation.date}
            endTime={marriageEvent?.end || invitation.date}
          />
          <div className="mt-5">
            <CountdownTimer targetDate={invitation.date} />
          </div>
        </div>
        <blockquote className="text-center p-10" data-aos="fade-up">
          &quot;{invitation.quote.name}&quot;
          <cite className="block">{invitation.quote.author}</cite>
        </blockquote>
      </section>

      <section className="bg-slate-100 flex-section">
        <Image
          src="/assets/img/bismillah.png"
          alt="bismillah"
          aspectRatio="aspect-[4/1]"
          className="w-1/2"
          data-aos="fade-up"
        />
        <h2 className="mb-6" data-aos="fade-up">
          Dengan memohon rahmat dan ridha Allah SWT, Kami bermaksud
          menyelenggarakn acara pernikahan putra-putri kami
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="px-3 text-right" data-aos="fade-right">
            <h2
              className="font-alex text-2xl font-bold text-green-primary mb-3"
              data-aos="fade-down"
              data-aos-delay="700"
            >
              {invitation.bride.name}
            </h2>
            <p className="text-slate-600 text-sm">
              Putri dari Bapak {invitation.bride.father} &{" "}
              {invitation.bride.mother}
            </p>
          </div>
          <Image
            src={invitation.bride.image}
            alt="Bridge"
            aspectRatio="aspect-square"
            className="rounded-tl-3xl rounded-bl-lg shadow-md"
            data-aos="fade-left"
          />
        </div>
        <div
          className="font-alex text-5xl font-bold my-3 text-green-primary"
          data-aos="flip-left"
        >
          &
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Image
            src={invitation.groom.image}
            alt="Groom"
            aspectRatio="aspect-square"
            className="rounded-tr-3xl rounded-br-lg shadow-md"
            data-aos="fade-right"
          />
          <div className="self-start px-3 text-left" data-aos="fade-left">
            <h2
              className="font-alex text-2xl font-bold text-green-primary"
              data-aos="fade-down"
              data-aos-delay="700"
            >
              {invitation.groom.name}
            </h2>
            <p className="text-slate-600 text-sm">
              Putra dari Bapak {invitation.groom.father} &{" "}
              {invitation.groom.mother}
            </p>
          </div>
        </div>
      </section>

      <section id="schedule" className="flex-section">
        <h2 className="mb-3" data-aos="fade-up">
          Yang Insyaallah akan diselenggarakan pada :
        </h2>
        {invitation.schedule.map((schedule, index) => {
          const dateParts = formatDate(
            schedule.start,
            "EEEE dd MMMM yyyy"
          ).split(" ");
          return (
            <React.Fragment key={index}>
              <h3
                className="font-bold text-2xl my-3 font-gallery text-green-primary"
                data-aos="fade-up"
              >
                {schedule.name}
              </h3>
              <div
                className="w-10/12 p-8 text-center mb-5 shadow shadow-green-primary rounded-t-full"
                data-aos="fade-up"
              >
                <div data-aos="flip-left">
                  {schedule.type === "marriage" ? (
                    <CalendarDays
                      size={64}
                      className="text-green-primary mx-auto mb-5"
                    />
                  ) : schedule.type === "reception" ? (
                    <Croissant
                      size={64}
                      className="text-green-primary mx-auto mb-5"
                    />
                  ) : (
                    <Calendar
                      size={64}
                      className="text-green-primary mx-auto mb-5"
                    />
                  )}
                </div>
                <div
                  className="mb-3 text-xl font-medium font-gallery"
                  data-aos="zoom-in"
                >
                  {dateParts[0] || "-"}
                </div>
                <div
                  className="flex gap-x-3 font-gallery text-3xl text-green-primary font-bold justify-center mb-2"
                  data-aos="zoom-in"
                >
                  <div>{dateParts[1] || "-"}</div>
                  <div className="border-r border-l border-green-primary px-3">
                    {dateParts[2] || "-"}
                  </div>
                  <div>{dateParts[3] || "-"}</div>
                </div>
                <div className="mb-3" data-aos="zoom-in">
                  Pukul : {formatTime(schedule.start)} -{" "}
                  {formatTime(schedule.end)} WIB
                </div>
                <div className="font-bold" data-aos="zoom-in">
                  Lokasi
                </div>
                <div className="mb-8" data-aos="zoom-in">
                  {schedule.location}
                </div>
                <Button
                  variant="default"
                  className="bg-green-primary hover:bg-green-secondary"
                  onClick={() =>
                    window.open(
                      schedule.location_maps,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  data-aos="zoom-in"
                >
                  <MapPinCheckInside size={16} /> Lihat lokasi
                </Button>
              </div>
            </React.Fragment>
          );
        })}
      </section>

      <section id="story" className="bg-slate-100 px-3 py-10">
        <h2 className="section-title" data-aos="fade-up">
          Our Story
        </h2>
        <div
          className="flex flex-col gap-1 bg-slate-50 px-8 py-3 rounded-lg"
          data-aos="fade-up"
        >
          {invitation.love_story.map((story, index) => (
            <div
              key={index}
              className="relative border-l-2 border-green-primary ps-6 py-2"
              data-aos="fade-up"
            >
              <Heart
                size="42"
                className="absolute top-0 left-[-1.40rem] text-green-primary bg-slate-50 p-2"
              />
              <h3 className="font-gallery text-xl">{story.title}</h3>
              <span className="text-slate-600 text-sm">
                {formatDate(story.date, "MMMM yyyy")}
              </span>

              <Image
                src={story.image}
                alt="Foto"
                aspectRatio="aspect-video"
                className="rounded-lg my-3"
              />

              <p className="mb-3">{story.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="galleries" className="px-3 py-10">
        <h2 className="section-title" data-aos="fade-up">
          Wedding Gallery
        </h2>
        <GalleryGrid galleries={invitation.galleries} />
      </section>
    </div>
  );
}
