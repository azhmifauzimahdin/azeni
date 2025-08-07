"use client";

import React, { useEffect, useRef, useState } from "react";
import BottomNavbar from "@/components/navigations/BottomNavbar";
import SpinningDisc from "@/components/ui/spinning-disc";
import { navLinks } from "@/data/navLinks";
import { Invitation } from "@/types";
import InvitationModalPremium from "../modals/invitations/invitation-modal-premium";
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
import { CommentService, GuestService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import { Img } from "../ui/Img";
import RSVP, { RSVPFormValues } from "../ui/rsvp";
import { QrDownloadDialog } from "../ui/qr-guest";
import { cn } from "@/lib/utils";
import Premium1Decoration from "../decorations/premium1-decoration";
import { getEffectiveDate } from "@/lib/utils/get-effective-date";
import Image from "../ui/image";

const Premium1Page: React.FC<Invitation> = (initialInvitation) => {
  const [invitation, setInvitation] = useState<Invitation>(initialInvitation);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(true);
  const [isSubmittingComment, setIsSubmittingComment] =
    useState<boolean>(false);
  const [isSubmittingRSVP, setIsSubmittingRSVP] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

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

  const handleSubmitRSVP = async (rsvp: RSVPFormValues) => {
    try {
      setIsSubmittingRSVP(true);
      const res = await GuestService.updateRSVP(invitation.id, {
        ...rsvp,
        guestId: invitation.guest.id,
      });
      setInvitation((prev) => ({
        ...prev,
        guest: res.data,
      }));
      toast.success("Berhasil kirim RSVP");
    } catch (error: unknown) {
      handleError(error, "invitation");
      toast.error("Gagal kirim RSVP");
    } finally {
      setIsSubmittingRSVP(false);
    }
  };

  const handleSubmitComment = async (comment: CommentFormValues) => {
    try {
      setIsSubmittingComment(true);
      const res = await CommentService.postComment(invitation.id, {
        ...comment,
        guestId: invitation.guest.id,
      });
      setInvitation((prev) => ({
        ...prev,
        comments: [res.data, ...(prev.comments || [])],
      }));
      toast.success("Berhasil menambahkan ucapan");
    } catch (error: unknown) {
      handleError(error, "invitation");
      toast.error("Gagal menambahkan ucapan");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div
      className={cn(
        isModalOpen && "sm:h-[calc(var(--vh)_*_100)] sm:overflow-hidden"
      )}
    >
      <audio ref={audioRef} src={invitation.music?.src} loop />
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

      {invitation.setting?.checkinCheckoutEnabled && (
        <QrDownloadDialog codeGuest={invitation.guest.code} />
      )}

      {/* ====== Hero Section ======*/}
      <section
        id="hero"
        className="flex-center h-[calc(var(--vh)_*_100)] overflow-hidden relative"
      >
        {/* DECORATIONS */}
        <Premium1Decoration withAOS={false} />

        {/* Konten utama */}
        <div className="flex-section relative z-20 w-full">
          <div>The Wedding Of</div>
          <Img
            src={invitation.image}
            alt="Foto"
            wrapperClassName="aspect-square w-4/12 rounded-tr-3xl rounded-br-lg rounded-bl-3xl rounded-tl-lg shadow-md mb-3"
            sizes="300px"
            priority
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
            <CountdownTimer targetDate={getEffectiveDate(invitation)} />
          </div>
        </div>
      </section>

      {/* ====== Quote Section ======*/}
      {invitation.quote && (
        <section className="bg-green-primary text-white py-16">
          <blockquote className="text-center p-3" data-aos="fade-up">
            &quot;{invitation.quote?.name}&quot;
            <cite className="block">- {invitation.quote?.author} -</cite>
          </blockquote>
        </section>
      )}

      {/* ====== Couple Section ======*/}
      {invitation.couple && (
        <section className="flex-center relative !px-0 overflow-hidden">
          <Premium1Decoration withAOS={false} />
          <div className="flex-section relative z-20 w-full py-16">
            <Img
              src="/assets/img/bismillah.png"
              alt="bismillah"
              wrapperClassName="w-[200px] h-[47px]"
              sizes="200px"
              data-aos="fade-up"
            />
            <h2 className="mb-6 px-3" data-aos="fade-up">
              {invitation.setting?.coupleIntroductionText}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Img
                src={
                  invitation.couple?.groomImage ||
                  "/assets/img/default-groom.png"
                }
                alt="Groom"
                wrapperClassName="aspect-square rounded-tr-3xl rounded-br-lg shadow-md border-4 border-l-0 border-white"
                sizes="200px"
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
            <div
              className="font-alex text-5xl font-bold my-3 text-green-primary"
              data-aos="flip-left"
            >
              &
            </div>
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
              <Img
                src={
                  invitation.couple?.brideImage ||
                  "/assets/img/default-bride.png"
                }
                alt="Bridge"
                wrapperClassName="aspect-square rounded-tl-3xl rounded-bl-lg shadow-md border-4 border-l-0 border-white"
                sizes="200px"
                data-aos="fade-left"
              />
            </div>
          </div>
        </section>
      )}

      {/* ====== Schdule Section ======*/}
      {invitation.schedules.length > 0 && (
        <section id="schedule" className="flex-center relative overflow-hidden">
          <Premium1Decoration withAOS={false} />
          <div className="flex-section relative z-20 w-full py-16">
            <h2 className="mb-3" data-aos="fade-up">
              {invitation.setting?.scheduleIntroductionText}
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
                          schedule.locationMaps,
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
          </div>
        </section>
      )}

      {/* ====== Our Story Section ======*/}
      {invitation.stories.length > 0 && (
        <section id="story" className="flex-center relative overflow-hidden">
          <Premium1Decoration withAOS={false} />
          <div className="relative z-20 w-full py-16">
            <h2 className="section-title" data-aos="fade-up">
              Our Story
            </h2>
            <div
              className="flex flex-col bg-white/10 px-8 py-3 rounded-lg border border-white/30 backdrop-blur-md shadow-md"
              data-aos="fade-up"
            >
              {invitation.stories.map((story, index) => (
                <div
                  key={index}
                  className="relative border-l-2 border-green-primary ps-6 py-2"
                  data-aos="fade-up"
                >
                  <Heart
                    size={38}
                    className="absolute top-0 left-[-1.22rem] z-10 text-green-primary bg-white p-2 rounded-full shadow-md"
                  />

                  <h3 className="font-gallery text-xl">{story.title}</h3>
                  <span className="text-slate-600 text-sm">
                    {formatDate(story.date, "MMMM yyyy")}
                  </span>

                  {story.image && (
                    <Image
                      src={story.image}
                      alt="Foto"
                      objectFit="object-contain"
                      className="w-full h-full object-contain rounded-lg overflow-hidden my-3"
                      priority
                    />
                  )}

                  <p className="mb-3">{story.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== Galleries Section ======*/}
      {invitation.galleries.length > 0 && (
        <section
          id="galleries"
          className="flex-center relative overflow-hidden"
        >
          <Premium1Decoration withAOS={false} />
          <div className="relative z-20 w-full py-16">
            <h2 className="section-title" data-aos="fade-up">
              Wedding Gallery
            </h2>
            <GalleryGrid galleries={invitation.galleries} />
          </div>
        </section>
      )}

      {/* ====== Gift Section ======*/}
      {invitation.bankaccounts.length > 0 && (
        <section className="bg-green-primary py-16">
          <WeddingGift
            introduction={invitation.setting?.giftIntroductionText || ""}
            banks={invitation.bankaccounts}
          />
        </section>
      )}

      {/* ====== RSVP Section ======*/}
      <section className="flex-center relative overflow-hidden">
        <Premium1Decoration withAOS={false} />
        <div className="flex-center flex-col text-center gap-3 relative z-20 w-full py-16">
          <h2 className="section-title" data-aos="fade-up">
            Konfirmasi Kehadiran
          </h2>
          <p data-aos="zoom-in">
            {invitation.setting?.rsvpIntroductionText || ""}
          </p>
          <Img
            src={invitation.image}
            alt="Foto"
            wrapperClassName="aspect-square w-4/12 rounded-tr-3xl rounded-br-lg rounded-bl-3xl rounded-tl-lg shadow-md mb-3"
            data-aos="zoom-in"
            sizes="300px"
          />
          <div className="mb-3" data-aos="zoom-in">
            <div className="font-alex text-5xl text-green-primary">
              {invitation.groom} & {invitation.bride}
            </div>
            <div>{formattedMarriageDate}</div>
          </div>
          {invitation.setting?.rsvpEnabled && (
            <div className="w-full">
              <RSVP
                invitation={invitation}
                onSubmit={handleSubmitRSVP}
                isLoading={isSubmittingRSVP}
              />
            </div>
          )}
        </div>
      </section>

      {invitation.setting?.commentEnabled && (
        <section className="bg-green-primary pt-16 pb-24">
          <h2 className="section-title !text-white" data-aos="fade-up">
            Ucapan & Doa
          </h2>
          <CommentSection
            comments={invitation.comments}
            onSubmit={handleSubmitComment}
            isLoading={isSubmittingComment}
          />
        </section>
      )}
    </div>
  );
};

export default Premium1Page;
