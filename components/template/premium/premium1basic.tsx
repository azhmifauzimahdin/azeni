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
import { Heart, MapPinCheckInside } from "lucide-react";
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
import { isSameDate } from "@/lib/utils/convert-date";
import LiveStream from "@/components/ui/live-stream";
import {
  IoLogoInstagram,
  IoLogoWhatsapp,
  IoMailOutline,
} from "react-icons/io5";

const Premium1BasicPage: React.FC<Invitation> = (initialInvitation) => {
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
      <LeftSidebar>
        <Premium1Decoration type="003" />
        <h1 className="text-3xl">The Wedding Of</h1>
        <div className="font-gallery text-8xl text-green-primary mb-3 z-20 relative">
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
          <BottomNavbar
            navLinks={navLinks}
            wrapperClassName="bg-white/10 backdrop-blur-md border border-white/20"
          />

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
            className="flex-center h-screen-fixed overflow-hidden relative"
          >
            {/* DECORATIONS */}
            <Premium1Decoration />

            {/* Konten utama */}
            <div className="flex-section relative z-20 w-full">
              <div>The Wedding Of</div>
              <div>
                <div className="font-gallery text-4xl text-green-primary mb-3">
                  {invitation.groom} & {invitation.bride}
                </div>
                <div>{formattedMarriageDate}</div>
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
              <Premium1Decoration />
              <div className="flex-section relative z-20 w-full py-16">
                <h1
                  className="relative z-10 text-3xl tracking-wider text-green-primary font-bold font-gallery uppercase"
                  data-aos="fade-up"
                >
                  PASANGAN
                </h1>
                <h2 className="mb-6 px-3" data-aos="fade-up">
                  {invitation.setting?.coupleIntroductionText}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {invitation.couple?.groomImage && (
                    <Img
                      src={
                        invitation.couple?.groomImage ||
                        "/assets/img/illustration/groom.png"
                      }
                      alt="Groom"
                      wrapperClassName="aspect-[3/4] bg-green-primary rounded-tr-3xl rounded-br-lg shadow-md border-4 border-l-0 border-white"
                      sizes="600px"
                      data-aos="fade-right"
                    />
                  )}
                  <div className="self-start px-3 text-left space-y-2">
                    <h2
                      className="text-2xl font-semibold text-green-primary"
                      data-aos="fade-down"
                    >
                      {invitation.couple?.groomName}
                    </h2>
                  </div>
                  <div className="text-center col-span-2 px-6 py-5 space-y-3">
                    {invitation.couple?.groomAddress && (
                      <p
                        className="text-sm font-medium"
                        data-aos="fade-up"
                        data-aos-delay="700"
                      >
                        {invitation.couple?.groomAddress}
                      </p>
                    )}
                    <p
                      className="text-slate-600 text-sm"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      Putra dari Bapak {invitation.couple?.groomFather} &&nbsp;
                      Ibu {invitation.couple?.groomMother}
                    </p>
                    <p
                      className="text-slate-600 text-sm"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <Link
                        href={invitation.couple?.groomInstagram || ""}
                        target="_blank"
                        className="inline-block"
                      >
                        <IoLogoInstagram size={20} />
                      </Link>
                    </p>
                  </div>
                </div>
                <div
                  className="font-gallery text-5xl font-bold mt-3 mb-6 text-green-primary"
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
                  </div>
                  {invitation.couple?.brideImage && (
                    <Img
                      src={
                        invitation.couple?.brideImage ||
                        "/assets/img/illustration/bride.png"
                      }
                      alt="Bridge"
                      wrapperClassName="aspect-[3/4] bg-green-primary rounded-tl-3xl rounded-bl-lg shadow-md border-4 border-r-0 border-white"
                      sizes="600px"
                      data-aos="fade-left"
                    />
                  )}
                  <div className="text-center col-span-2 px-6 py-5 space-y-3">
                    {invitation.couple?.groomAddress && (
                      <p
                        className="text-sm font-medium"
                        data-aos="fade-up"
                        data-aos-delay="700"
                      >
                        {invitation.couple?.groomAddress}
                      </p>
                    )}
                    <p
                      className="text-slate-600 text-sm"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      Putri dari Bapak {invitation.couple?.groomFather} &&nbsp;
                      Ibu {invitation.couple?.groomMother}
                    </p>
                    <p
                      className="text-slate-600 text-sm"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <Link
                        href={invitation.couple?.brideInstagram || ""}
                        target="_blank"
                        className="inline-block"
                      >
                        <IoLogoInstagram size={20} />
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ====== Schdule Section ======*/}
          {invitation.schedules.length > 0 && (
            <section id="schedule" className="relative overflow-hidden">
              <Premium1Decoration />
              <div className="w-10/12 p-8 overflow-hidden relative py-16 mx-auto flex flex-col items-center gap-3 mt-16">
                <div data-aos="zoom-in">
                  <Img
                    src="/assets/svg/countdown-gray.svg"
                    alt="Countdown"
                    wrapperClassName="w-20 h-20 mx-auto"
                    sizes="300px"
                  />
                </div>

                <div
                  className="text-2xl font-bold text-green-primary"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {formatDate(
                    getEffectiveDate(invitation),
                    "EEEE, dd MMMM yyyy"
                  )}
                </div>
                <div className="mb-5" data-aos="flip-up" data-aos-delay="200">
                  <CountdownTimer
                    targetDate={getEffectiveDate(invitation)}
                    textColor="text-slate-700"
                    bgColor="bg-transparant"
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="300">
                  <GoogleCalender
                    title={`Pernikahan ${invitation.groom} & ${invitation.bride}`}
                    startTime={
                      marriageEvent?.startDate || getEffectiveDate(invitation)
                    }
                    endTime={
                      marriageEvent?.endDate || getEffectiveDate(invitation)
                    }
                    className={buttonVariants({
                      className: "bg-green-primary hover:bg-green-primary/90",
                    })}
                  />
                </div>
              </div>
              <div className="flex-section relative z-20 w-full pb-16">
                <h2 className="mb-3" data-aos="fade-up">
                  {invitation.setting?.scheduleIntroductionText}
                </h2>
                {invitation.schedules.map((schedule, index) => {
                  const dateParts = formatDate(
                    schedule.startDate,
                    "EEEE dd MMMM yyyy"
                  ).split(" ");
                  const datePartsEndDate = formatDate(
                    schedule.endDate,
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
                        {!isSameDate(schedule.startDate, schedule.endDate) && (
                          <>
                            <div className="text-center">-</div>
                            <div
                              className="mb-3 text-xl font-medium font-gallery"
                              data-aos="zoom-in"
                            >
                              {datePartsEndDate[0] || "-"}
                            </div>
                            <div
                              className="flex gap-x-3 font-gallery text-3xl text-green-primary font-bold justify-center mb-2"
                              data-aos="zoom-in"
                            >
                              <div>{datePartsEndDate[1] || "-"}</div>
                              <div className="border-r border-l border-green-primary px-3">
                                {datePartsEndDate[2] || "-"}
                              </div>
                              <div>{datePartsEndDate[3] || "-"}</div>
                            </div>
                          </>
                        )}
                        <div className="mb-3" data-aos="zoom-in">
                          Pukul : {formatTime(schedule.startDate)} -&nbsp;
                          {formatTime(schedule.endDate)}&nbsp;
                          {invitation.setting?.timezone}
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

          {/* ====== Live Stream Section ======*/}
          {invitation.setting?.liveStreamEnabled && (
            <section className="bg-green-primary text-white py-16 relative">
              <LiveStream
                invitation={invitation}
                titleClassName="relative z-10 text-3xl tracking-wider font-bold font-gallery uppercase"
                buttonVariant={buttonVariants({ variant: "white-outline" })}
              />
            </section>
          )}

          {/* ====== Our Story Section ======*/}
          {invitation.stories.length > 0 && (
            <section
              id="story"
              className="flex-center relative overflow-hidden"
            >
              <Premium1Decoration />
              <div className="relative z-20 w-full py-16">
                <h2
                  className="relative z-10 text-3xl tracking-wider text-green-primary font-bold font-gallery uppercase text-center"
                  data-aos="fade-up"
                >
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
                          className="w-full h-full object-contain rounded-lg overflow-hidden hover:scale-105 transition duration-500 my-3"
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
              <Premium1Decoration type="002" />
              <div className="relative text-center z-20 w-full py-16">
                <h2
                  className="relative z-10 text-3xl tracking-wider text-green-primary font-bold font-gallery uppercase"
                  data-aos="fade-up"
                >
                  Galeri
                </h2>
                <p className="mb-8" data-aos="fade-up">
                  Photo By {invitation.groom} & {invitation.bride}
                </p>
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
            <Premium1Decoration />
            <div className="flex-center flex-col text-center gap-3 relative z-20 w-full px-3 py-6 my-3 bg-white/10 border-white/30 backdrop-blur-md shadow-md rounded-lg">
              <h2
                className="relative z-10 text-3xl tracking-wider text-green-primary font-bold font-gallery uppercase"
                data-aos="fade-up"
              >
                Konfirmasi Kehadiran
              </h2>
              <p data-aos="zoom-in">
                {invitation.setting?.rsvpIntroductionText || ""}
              </p>
              {invitation.setting?.rsvpEnabled && (
                <div className="w-full">
                  <RSVP
                    invitation={invitation}
                    onSubmit={handleSubmitRSVP}
                    isLoading={isSubmittingRSVP}
                    textColor="text-green-primary"
                    borderColor="border-green-primary"
                    buttonClassName="bg-green-primary hover:bg-green-secondary text-white"
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

          <div className="h-screen-dvh space-y-16 overflow-hidden">
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <Premium1Decoration />
              <div
                className="flex flex-col items-center justify-center text-center relative z-20 w-full"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                <h1
                  className="text-xl tracking-wider"
                  data-aos="fade-down"
                  data-aos-duration="1000"
                >
                  Terima Kasih
                </h1>
                <p
                  className="tracking-wider mb-5"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="300"
                >
                  Atas Kehadiran dan Doa Restunya
                </p>
                <div
                  className="space-y-3 mb-12"
                  data-aos="zoom-in"
                  data-aos-duration="1200"
                  data-aos-delay="500"
                >
                  <div className="font-gallery text-green-primary text-4xl">
                    {invitation.groom} & {invitation.bride}
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-24 w-full flex flex-col items-center justify-center text-center"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="700"
              >
                <Img
                  src="/assets/img/azen-green.png"
                  alt="Wedding"
                  sizes="300px"
                  wrapperClassName="w-8 h-8 mb-3 mx-auto"
                  data-aos="zoom-in"
                  data-aos-duration="1000"
                />
                <div className="mb-3 font-thin text-xs space-y-3 tracking-wider">
                  Undangan digital © 2025 - {new Date().getFullYear()}
                </div>
                <ul
                  className="flex gap-3"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="900"
                >
                  <li>
                    <Link
                      href="mailto:azen.invitation@gmail.com"
                      className="hover:text-gold-luxury-002 transition"
                    >
                      <IoMailOutline size={20} />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.instagram.com/azen.inv?igsh=Nmp6djVucWNzejdm&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold-luxury-002 transition"
                    >
                      <IoLogoInstagram size={20} />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://api.whatsapp.com/send/?phone=628895276116&text=Halo%2C+saya+tertarik+dengan+undangan+digitalnya.%0ABisa+saya+dapatkan+informasi+lebih+lanjut%3F&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold-luxury-002 transition"
                    >
                      <IoLogoWhatsapp size={20} />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium1BasicPage;
