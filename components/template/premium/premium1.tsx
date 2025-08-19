"use client";

import React, { useEffect, useRef, useState } from "react";
import BottomNavbar from "@/components/navigations/BottomNavbar";
import SpinningDisc from "@/components/ui/spinning-disc";
import { navLinks } from "@/data/navLinks";
import { Invitation } from "@/types";
import InvitationModalPremium from "../../modals/invitations/invitation-modal-premium";
import GoogleCalender from "../../ui/google-calender";
import CountdownTimer from "../../ui/countdown-timer";
import { formatDate } from "@/lib/utils/formatted-date";
import { Heart, Instagram, MapPinCheckInside } from "lucide-react";
import { formatTime } from "@/lib/utils/formatted-time";
import { Button, buttonVariants } from "../../ui/button";
import GalleryGrid from "../../ui/gallery-grid";
import WeddingGift from "../../ui/wedding-gift";
import CommentSection from "../../ui/comment";
import { GuestService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import { Img } from "../../ui/Img";
import RSVP, { RSVPFormValues } from "../../ui/rsvp";
import { QrDownloadDialog } from "../../ui/qr-guest";
import { cn } from "@/lib/utils";
import Premium1Decoration from "../../decorations/premium1-decoration";
import { getEffectiveDate } from "@/lib/utils/get-effective-date";
import Image from "../../ui/image";
import LeftSidebar from "../../ui/left-sidebar";
import Link from "next/link";

const Premium1Page: React.FC<Invitation> = (initialInvitation) => {
  const [invitation, setInvitation] = useState<Invitation>(initialInvitation);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(true);
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
    getEffectiveDate(invitation),
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

  return (
    <div className="flex justify-end min-h-screen bg-gray-100 text-sm">
      <LeftSidebar imageSrc={invitation.image}>
        <h1 className="text-3xl">The Wedding Of</h1>
        <div className="font-alex text-8xl">
          {invitation.groom} & {invitation.bride}
        </div>
        <div>
          {formatDate(getEffectiveDate(invitation), "EEEE dd MMMM yyyy")}
        </div>
      </LeftSidebar>

      <div className="relative w-full sm:w-[390px] min-h-screen bg-white text-gray-800 shadow-lg overflow-hidden">
        <div className={cn(isModalOpen && "h-screen-dvh overflow-hidden")}>
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
                startTime={
                  marriageEvent?.startDate || getEffectiveDate(invitation)
                }
                endTime={marriageEvent?.endDate || getEffectiveDate(invitation)}
                className={buttonVariants({
                  className: "bg-green-primary hover:bg-green-primary/90",
                })}
              />
              <div className="mt-5">
                <CountdownTimer targetDate={getEffectiveDate(invitation)} />
              </div>
            </div>
          </section>

          {/* ====== Quote Section ======*/}
          {invitation.quote && (
            <section className="bg-green-primary text-white py-16 relative">
              <span className="absolute text-6xl opacity-10 top-4 left-4">
                “
              </span>

              <blockquote
                className="relative text-center p-8 max-w-3xl mx-auto rounded-xl border border-white/20 shadow-lg backdrop-blur-sm"
                data-aos="fade-up"
              >
                <p className="font-semibold">
                  &quot;{invitation.quote?.name}&quot;
                </p>
                <cite className="block mt-4 text-white/90">
                  - {invitation.quote?.author} -
                </cite>
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
                      "/assets/img/default-groom-invitation.png"
                    }
                    alt="Groom"
                    wrapperClassName="aspect-square rounded-tr-3xl rounded-br-lg shadow-md border-4 border-l-0 border-white"
                    sizes="200px"
                    data-aos="fade-right"
                  />
                  <div className="self-start px-3 text-left space-y-2">
                    <h2
                      className="text-2xl font-semibold text-green-primary"
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
                      Ibu {invitation.couple?.brideMother}
                    </p>
                    <p
                      className="text-slate-600 text-sm"
                      data-aos="fade-left"
                      data-aos-delay="700"
                    >
                      <Link
                        href={invitation.couple?.groomInstagram}
                        target="_blank"
                      >
                        <Instagram />
                      </Link>
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
                  <div className="px-3 text-right space-y-2">
                    <h2
                      className="text-2xl font-semibold text-green-primary mb-3"
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
                      Ibu {invitation.couple?.brideMother}
                    </p>
                    <p
                      className="text-slate-600 text-sm text-right"
                      data-aos="fade-left"
                      data-aos-delay="700"
                    >
                      <Link
                        href={invitation.couple?.brideInstagram}
                        target="_blank"
                        className="inline-block"
                      >
                        <Instagram />
                      </Link>
                    </p>
                  </div>
                  <Img
                    src={
                      invitation.couple?.brideImage ||
                      "/assets/img/default-bride-invitation.png"
                    }
                    alt="Bridge"
                    wrapperClassName="aspect-square rounded-tl-3xl rounded-bl-lg shadow-md border-4 border-r-0 border-white"
                    sizes="200px"
                    data-aos="fade-left"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ====== Schdule Section ======*/}
          {invitation.schedules.length > 0 && (
            <section
              id="schedule"
              className="flex-center relative overflow-hidden"
            >
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
                            <Img
                              src="/assets/svg/marriage-green.svg"
                              alt="Wedding"
                              wrapperClassName="w-16 h-16 mx-auto mb-5"
                            />
                          ) : schedule.type === "reception" ? (
                            <Img
                              src="/assets/svg/reception-green.svg"
                              alt="Reception"
                              wrapperClassName="w-16 h-16 mx-auto mb-5"
                            />
                          ) : (
                            <Img
                              src="/assets/svg/schedule-green.svg"
                              alt="Schedule"
                              wrapperClassName="w-16 h-16 mx-auto mb-5"
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
            <section
              id="story"
              className="flex-center relative overflow-hidden"
            >
              <Premium1Decoration withAOS={false} />
              <div className="relative z-20 w-full py-16">
                <h2 className="section-title" data-aos="fade-up">
                  Cerita Kita
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
                  Galeri
                </h2>
                <GalleryGrid galleries={invitation.galleries} />
              </div>
            </section>
          )}

          {/* ====== Gift Section ======*/}
          {invitation.bankaccounts.length > 0 && (
            <section className="bg-green-primary py-16 text-white text-center">
              <h2 className="section-title !text-white" data-aos="zoom-in">
                Hadiah Pernikahan
              </h2>
              <p className="mb-5" data-aos="zoom-in">
                {invitation.setting?.giftIntroductionText || ""}
              </p>
              <WeddingGift
                banks={invitation.bankaccounts}
                btnClassName={buttonVariants({
                  variant: "white-outline",
                })}
              />
            </section>
          )}

          {/* ====== RSVP Section ======*/}
          <section className="flex-center relative overflow-hidden">
            <Premium1Decoration withAOS={false} />
            <div className="flex-center flex-col text-center gap-3 relative z-20 w-full px-3 py-6 my-3 bg-white/10 border-white/30 backdrop-blur-md shadow-md rounded-lg">
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
                invitation={invitation}
                setInvitation={setInvitation}
                comments={invitation.comments || []}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Premium1Page;
