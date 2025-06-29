"use client";

import React, { useEffect, useRef, useState } from "react";
import BottomNavbar from "@/components/navigations/BottomNavbar";
import SpinningDisc from "@/components/ui/spinning-disc";
import { navLinks } from "@/data/navLinks";
import { Comment, Guest, Invitation } from "@/types";
import InvitationModalPremium from "../modals/invitations/invitation-modal-premium";
import Image from "../ui/image";
import GoogleCalender from "../ui/google-calender";
import CountdownTimer from "../ui/countdown-timer";
import { formatDate } from "@/lib/utils/formatted-date";
import {
  Calendar,
  CalendarDays,
  Croissant,
  Heart,
  MapPinCheckInside,
} from "lucide-react";
import { formatTime } from "@/lib/utils/formatted-time";
import { Button } from "../ui/button";
import GalleryGrid from "../ui/gallery-grid";
import WeddingGift from "../ui/wedding-gift";
import CommentSection, { CommentFormValues } from "../ui/comment";
import { CommentService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";

const Premium1Page: React.FC<Invitation & { currentGuest: Guest }> = (
  invitation
) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setComments(invitation.comments);
  }, [invitation.comments]);

  const handleStartAudio = () => {
    if (audioRef.current) {
      setMusicPlaying(true);
      audioRef.current.play();
    }
  };

  const formattedMarriageDate = formatDate(
    invitation.date,
    "EEEE, dd MMMM yyyy"
  );
  const marriageEvent = invitation.schedules.find(
    (item) => item.type === "marriage"
  );

  const handleSubmitComment = async (comment: CommentFormValues) => {
    try {
      setLoading(true);
      const res = await CommentService.postComment(invitation.id, {
        ...comment,
        guestId: invitation.currentGuest.id,
      });
      setComments([res, ...comments]);
      toast.success("Berhasil menambahkan ucapan");
    } catch (error: unknown) {
      handleError(error, "invitation");
      toast.error("Gagal menambahkan ucapan");
    } finally {
      setLoading(false);
    }
  };
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
        className="flex-section"
      >
        <div>The Wedding Of</div>
        <Image
          src={invitation.image}
          alt="Foto"
          aspectRatio="aspect-square"
          className="w-5/12 md:w-2/12 rounded-tr-3xl rounded-br-lg rounded-bl-3xl rounded-tl-lg shadow-md mb-3"
        />
        <div className="mb-3">
          <div className="font-alex text-5xl text-green-primary">
            {invitation.groom} & {invitation.bride}
          </div>
          <div>{formattedMarriageDate}</div>
        </div>
        <GoogleCalender
          title={`Pernikahan ${invitation.groom} & ${invitation.bride}`}
          startTime={marriageEvent?.startDate || invitation.date}
          endTime={marriageEvent?.endDate || invitation.date}
        />
        <div className="mt-5">
          <CountdownTimer targetDate={invitation.date} />
        </div>
      </section>
      <section className="bg-green-primary text-white">
        <blockquote className="text-center p-3" data-aos="fade-up">
          &quot;{invitation.quote?.name}&quot;
          <cite className="block">- {invitation.quote?.author} -</cite>
        </blockquote>
      </section>

      <section className="bg-slate-100 flex-section !px-0">
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
          <div className="px-3 text-right">
            <h2
              className="font-alex text-2xl font-bold text-green-primary mb-3"
              data-aos="fade-down"
            >
              {invitation.couple?.brideName}
            </h2>
            <p
              className="text-slate-600 text-sm"
              data-aos="fade-right"
              data-aos-delay="700"
            >
              Putri dari Bapak {invitation.couple?.brideFather} &&nbsp;
              {invitation.couple?.brideMother}
            </p>
          </div>
          <Image
            src={invitation.couple?.brideImage || ""}
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
            src={invitation.couple?.groomImage || ""}
            alt="Groom"
            aspectRatio="aspect-square"
            className="rounded-tr-3xl rounded-br-lg shadow-md"
            data-aos="fade-right"
          />
          <div className="self-start px-3 text-left">
            <h2
              className="font-alex text-2xl font-bold text-green-primary"
              data-aos="fade-down"
            >
              {invitation.couple?.groomName}
            </h2>
            <p
              className="text-slate-600 text-sm"
              data-aos="fade-left"
              data-aos-delay="700"
            >
              Putra dari Bapak {invitation.couple?.brideFather} &&nbsp;
              {invitation.couple?.brideMother}
            </p>
          </div>
        </div>
      </section>

      <section id="schedule" className="flex-section">
        <h2 className="mb-3" data-aos="fade-up">
          Yang Insyaallah akan diselenggarakan pada :
        </h2>
        {invitation.schedules.map((schedule, index) => {
          const dateParts = formatDate(
            schedule.startDate,
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
                  Pukul : {formatTime(schedule.startDate)} -&nbsp;
                  {formatTime(schedule.endDate)} WIB
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

      <section id="story" className="bg-slate-100">
        <h2 className="section-title" data-aos="fade-up">
          Our Story
        </h2>
        <div
          className="flex flex-col gap-1 bg-slate-50 px-8 py-3 rounded-lg"
          data-aos="fade-up"
        >
          {invitation.stories.map((story, index) => (
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

      <section id="galleries">
        <h2 className="section-title" data-aos="fade-up">
          Wedding Gallery
        </h2>
        <GalleryGrid galleries={invitation.galleries} />
      </section>

      <section className="bg-green-primary">
        <WeddingGift banks={invitation.bankaccounts} />
      </section>

      <section className="text-center flex flex-col justify-center items-center gap-5">
        <p data-aos="zoom-in">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila
          Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do’a restu kepada
          kami.
        </p>
        <Image
          src={invitation.image}
          alt="Foto"
          aspectRatio="aspect-square"
          className="w-5/12 md:w-2/12 rounded-tr-3xl rounded-br-lg rounded-bl-3xl rounded-tl-lg shadow-md mb-3"
          data-aos="zoom-in"
        />
        <div className="mb-3" data-aos="zoom-in">
          <div className="font-alex text-5xl text-green-primary">
            {invitation.groom} & {invitation.bride}
          </div>
          <div>{formattedMarriageDate}</div>
        </div>
      </section>

      <section className="bg-green-primary">
        <h2 className="section-title !text-white" data-aos="fade-up">
          Ucapan & Doa
        </h2>
        <CommentSection
          comments={comments}
          onSubmit={handleSubmitComment}
          loading={loading}
        />
      </section>
    </div>
  );
};

export default Premium1Page;
