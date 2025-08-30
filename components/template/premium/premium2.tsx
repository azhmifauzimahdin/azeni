"use client";

import React, { useEffect, useRef, useState } from "react";
import BottomNavbar from "@/components/navigations/BottomNavbar";
import SpinningDisc from "@/components/ui/spinning-disc";
import { navLinks } from "@/data/navLinks";
import { Invitation } from "@/types";
import GoogleCalender from "../../ui/google-calender";
import CountdownTimer from "../../ui/countdown-timer";
import { formatDate } from "@/lib/utils/formatted-date";
import { MapPinCheckInside } from "lucide-react";
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
import InvitationModalPremium from "@/components/modals/invitations/invitation-modal-premium";
import Premium2Decoration from "@/components/decorations/premium2-decoration";

const Premium2Page: React.FC<Invitation> = (initialInvitation) => {
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
        <div className="font-playfair text-8xl mb-3">
          {invitation.groom} & {invitation.bride}
        </div>
        <div>
          {formatDate(getEffectiveDate(invitation), "dd")} |&nbsp;
          {formatDate(getEffectiveDate(invitation), "MMMM")} |&nbsp;
          {formatDate(getEffectiveDate(invitation), "yyyy")}
        </div>
      </LeftSidebar>

      <div className="relative w-full sm:w-[390px] min-h-screen bg-white text-gray-800 shadow-lg overflow-hidden">
        <div className={cn(isModalOpen && "h-screen-dvh overflow-hidden")}>
          <audio ref={audioRef} src={invitation.music?.src} loop />
          <SpinningDisc play={musicPlaying} />
          <BottomNavbar
            navLinks={navLinks}
            wrapperClassName="bg-white/10 backdrop-blur-md border border-white/20"
            linkClassName="bg-[#214d80] hover:bg-[#2a5da0] text-white shadow-md"
          />

          <InvitationModalPremium
            isOpen={isModalOpen}
            onClose={() => {
              handleStartAudio();
              setIsModalOpen(false);
            }}
            invitation={invitation}
            variant="002"
          />

          {invitation.setting?.checkinCheckoutEnabled && (
            <QrDownloadDialog codeGuest={invitation.guest.code} />
          )}

          {/* ====== Hero Section ======*/}
          <section
            id="hero"
            className="flex-center h-screen-dvh overflow-hidden relative"
          >
            {/* DECORATIONS */}
            <Premium2Decoration />

            {/* Konten utama */}
            <div className="flex-section relative z-20 w-full">
              <div>The Wedding Of</div>
              <div className="mb-3">
                <div className="font-playfair text-4xl text-[#214d80] mb-3">
                  {invitation.groom} & {invitation.bride}
                </div>
                <div>
                  {formatDate(getEffectiveDate(invitation), "dd")} |&nbsp;
                  {formatDate(getEffectiveDate(invitation), "MMMM")} |&nbsp;
                  {formatDate(getEffectiveDate(invitation), "yyyy")}
                </div>
              </div>
            </div>
          </section>

          {/* ====== Quote Section ======*/}
          {invitation.quote && (
            <section className="bg-[#214d80] text-white pt-28 pb-24 px-5 relative overflow-hidden">
              <Premium2Decoration type="002" />
              <blockquote className="relative text-center" data-aos="fade-up">
                <div className="text-5xl text-white/20 absolute -top-8 left-1/2 -translate-x-1/2 select-none">
                  “
                </div>

                <p className="font-semibold">
                  &quot;{invitation.quote?.name}&quot;
                </p>

                <cite className="block mt-4 text-white/90">
                  — {invitation.quote?.author} —
                </cite>

                <div className="w-16 h-[2px] bg-white/30 mx-auto mt-6 rounded-full"></div>
              </blockquote>
            </section>
          )}

          {/* ====== Couple Section ======*/}
          {invitation.couple && (
            <section className="flex-center relative overflow-hidden py-16 px-5">
              <Premium2Decoration />
              <div className="flex-section bg-white rounded-3xl space-y-6 relative z-10 py-8 px-3 w-full">
                <h1
                  className="relative z-10 text-3xl tracking-wider text-[#214d80] font-playfair font-semibold"
                  data-aos="fade-up"
                >
                  PASANGAN
                </h1>
                <h2 className="px-3" data-aos="fade-up">
                  {invitation.setting?.coupleIntroductionText}
                </h2>

                <div className="text-center space-y-3">
                  <Img
                    src={
                      invitation.couple?.groomImage ||
                      "/assets/img/aditya-nabila/aditya-basic.png"
                    }
                    alt="Groom"
                    wrapperClassName="w-1/2 aspect-[3/4] mx-auto bg-gradient-to-r from-[#2a5da0] to-[#214d80] rounded-t-[200px] rounded-b-[200px] border-2 border-[#214d80] shadow-md mb-5"
                    sizes="200px"
                    data-aos="zoom-in"
                    data-aos-delay="200"
                  />

                  <h2
                    className="font-playfair text-2xl font-semibold text-[#214d80]"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    {invitation.couple?.groomName}
                  </h2>

                  <p
                    className="text-slate-600 text-sm"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    Putra dari Bapak {invitation.couple?.brideFather} &&nbsp;
                    Ibu {invitation.couple?.brideMother}
                  </p>

                  <p
                    className="text-slate-600 text-sm"
                    data-aos="fade-up"
                    data-aos-delay="800"
                  >
                    <Link
                      href={invitation.couple?.groomInstagram}
                      target="_blank"
                      className="inline-block"
                    >
                      <IoLogoInstagram size={20} />
                    </Link>
                  </p>
                </div>

                <div
                  className="font-playfair text-5xl font-bold text-[#214d80]"
                  data-aos="zoom-in"
                  data-aos-delay="1000"
                >
                  &
                </div>

                <div className="text-center space-y-3">
                  <Img
                    src={
                      invitation.couple?.brideImage ||
                      "/assets/img/aditya-nabila/nabila-basic.png"
                    }
                    alt="Bride"
                    wrapperClassName="w-1/2 aspect-[3/4] mx-auto bg-gradient-to-r from-[#2a5da0] to-[#214d80] rounded-t-[200px] rounded-b-[200px] border-2 border-[#214d80] shadow-md mb-5"
                    sizes="200px"
                    data-aos="zoom-in"
                    data-aos-delay="200"
                  />

                  <h2
                    className="font-playfair text-2xl font-semibold text-[#214d80]"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    {invitation.couple?.brideName}
                  </h2>

                  <p
                    className="text-slate-600 text-sm"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    Putra dari Bapak {invitation.couple?.brideFather} &&nbsp;
                    Ibu {invitation.couple?.brideMother}
                  </p>

                  <p
                    className="text-slate-600 text-sm"
                    data-aos="fade-up"
                    data-aos-delay="800"
                  >
                    <Link
                      href={invitation.couple?.brideInstagram}
                      target="_blank"
                      className="inline-block"
                    >
                      <IoLogoInstagram size={20} />
                    </Link>
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ====== Schdule Section ======*/}
          {invitation.schedules.length > 0 && (
            <div
              id="schedule"
              className="relative bg-[#214d80] bg-opacity-25 py-16"
            >
              <Premium2Decoration type="003" />
              <div className="w-10/12 p-8 bg-white border-4 border-white rounded-t-xl rounded-b-xl shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] overflow-hidden relative py-16 mx-auto flex flex-col items-center gap-3">
                <Premium2Decoration type="002" />
                <div data-aos="zoom-in">
                  <Img
                    src="/assets/svg/countdown-gray.svg"
                    alt="Countdown"
                    wrapperClassName="w-20 h-20 mx-auto"
                    sizes="300px"
                  />
                </div>

                <div
                  className="text-2xl font-bold text-[#214d80]"
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
                      className: "bg-[#214d80] hover:bg-[#2a5da0] text-white",
                    })}
                  />
                </div>
              </div>
              <div className="flex-section relative z-20 w-full pt-16">
                <h2 className="text-slate-800 mb-3" data-aos="fade-up">
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
                      <div
                        className="w-10/12 p-8 bg-white border-4 border-white rounded-t-[200px] rounded-b-[200px] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] overflow-hidden relative py-16 mb-10"
                        data-aos="fade-up"
                      >
                        <Premium2Decoration type="004" />
                        <h3
                          className="font-bold text-2xl my-3 font-playfair text-[#214d80]"
                          data-aos="fade-up"
                        >
                          {schedule.name}
                        </h3>
                        <div data-aos="flip-left">
                          {schedule.type === "marriage" ? (
                            <Img
                              src="/assets/svg/marriage-gray.svg"
                              alt="Wedding"
                              wrapperClassName="w-16 h-16 mx-auto mb-5"
                            />
                          ) : schedule.type === "reception" ? (
                            <Img
                              src="/assets/svg/reception-gray.svg"
                              alt="Reception"
                              wrapperClassName="w-16 h-16 mx-auto mb-5"
                            />
                          ) : (
                            <Img
                              src="/assets/svg/schedule-gray.svg"
                              alt="Schedule"
                              wrapperClassName="w-16 h-16 mx-auto mb-5"
                            />
                          )}
                        </div>
                        <div
                          className="mb-3 text-xl font-medium font-playfair"
                          data-aos="zoom-in"
                        >
                          {dateParts[0] || "-"}
                        </div>
                        <div
                          className="flex gap-x-3 font-playfair text-3xl text-[#214d80] font-bold justify-center mb-2"
                          data-aos="zoom-in"
                        >
                          <div>{dateParts[1] || "-"}</div>
                          <div className="border-r border-l border-[#214d80] px-3">
                            {dateParts[2] || "-"}
                          </div>
                          <div>{dateParts[3] || "-"}</div>
                        </div>
                        {!isSameDate(schedule.startDate, schedule.endDate) && (
                          <>
                            <div className="text-center">-</div>
                            <div
                              className="mb-3 text-xl font-medium font-playfair"
                              data-aos="zoom-in"
                            >
                              {datePartsEndDate[0] || "-"}
                            </div>
                            <div
                              className="flex gap-x-3 font-playfair text-3xl text-[#214d80] font-bold justify-center mb-2"
                              data-aos="zoom-in"
                            >
                              <div>{datePartsEndDate[1] || "-"}</div>
                              <div className="border-r border-l border-[#214d80] px-3">
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
                          className="bg-[#214d80] hover:bg-[#2a5da0] text-white"
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
            </div>
          )}

          {/* ====== Live Stream Section ======*/}
          {invitation.setting?.liveStreamEnabled && (
            <section className="bg-[#214d80] text-white py-16 px-5 relative">
              <LiveStream
                invitation={invitation}
                buttonVariant={buttonVariants({
                  className:
                    "bg-transparent hover:bg-[#214d80] text-slate-700 hover:text-white border border-white",
                })}
                titleClassName="text-3xl tracking-wider text-[#214d80] font-playfair font-semibold text-center mb-3"
                wrapperClassName="bg-[#c7d2df] rounded-xl border border-white/20 shadow-lg backdrop-blur-sm text-slate-700"
              />
            </section>
          )}

          {/* ====== Our Story Section ======*/}
          {invitation.stories.length > 0 && (
            <section
              id="story"
              className="flex-center relative overflow-hidden"
            >
              <Premium2Decoration />
              <div className="relative z-20 w-full py-16">
                <h2
                  className="text-3xl tracking-wider text-[#214d80] font-playfair font-semibold text-center mb-8"
                  data-aos="fade-up"
                >
                  Cerita Kita
                </h2>
                <div className="space-y-12 relative px-2">
                  {invitation.stories.map((story, index) => (
                    <div
                      key={index}
                      data-aos="fade-up"
                      className="bg-white border-4 border-[#c7d2df] rounded-t-xl rounded-b-xl shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)] relative p-6"
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-playfair font-semibold text-[#214d80]">
                          {story.title}
                        </h3>
                        <span className="block text-sm text-slate-500">
                          {formatDate(story.date, "MMMM yyyy")}
                        </span>
                      </div>

                      {story.image && (
                        <div className="overflow-hidden rounded-xl mb-4">
                          <Image
                            src={story.image}
                            alt="Foto"
                            className="w-full h-auto object-contain rounded-lg overflow-hidden hover:scale-105 transition duration-500 mb-3"
                            priority
                          />
                        </div>
                      )}

                      <p className="text-slate-800 leading-relaxed text-center">
                        {story.description}
                      </p>

                      <span className="absolute -left-4 top-6 w-2 h-2 bg-[#214d80] rounded-full"></span>
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
              <Premium2Decoration type="003" />
              <div className="relative z-20 w-full text-center py-16">
                <h2
                  className="text-3xl tracking-wider text-[#214d80] font-playfair font-semibold"
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
            <section className="bg-[#214d80] py-16 text-white text-center">
              <h2
                className="text-3xl tracking-wider mb-5 font-playfair font-semibold text-center"
                data-aos="zoom-in"
              >
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
          <section className="bg-[#214d80] bg-opacity-25 flex-center relative overflow-hidden px-5 py-16">
            <Premium2Decoration type="003" />
            <div className="flex-center flex-col text-center gap-3 relative z-20 w-full py-20 px-5 my-3 bg-white border-4 border-white rounded-t-xl rounded-b-xl shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]relative overflow-hidden">
              <Premium2Decoration type="004" />
              <h2
                className="text-3xl text-[#214d80] tracking-wider mb-5 font-playfair font-semibold text-center"
                data-aos="fade-up"
              >
                Konfirmasi Kehadiran
              </h2>
              <p data-aos="zoom-in" className="mb-8">
                {invitation.setting?.rsvpIntroductionText || ""}
              </p>
              {invitation.setting?.rsvpEnabled && (
                <div className="w-full">
                  <RSVP
                    invitation={invitation}
                    onSubmit={handleSubmitRSVP}
                    isLoading={isSubmittingRSVP}
                    textColor="text-[#214d80]"
                    borderColor="border-[#214d80]"
                    buttonClassName="bg-[#214d80] hover:bg-[#2a5da0] text-white"
                  />
                </div>
              )}
            </div>
          </section>

          {invitation.setting?.commentEnabled && (
            <section className="bg-[#214d80] pt-16 pb-24">
              <h2
                className="text-3xl tracking-wider text-white font-playfair font-semibold text-center mb-8"
                data-aos="fade-up"
              >
                Ucapan & Doa
              </h2>
              <CommentSection
                invitation={invitation}
                setInvitation={setInvitation}
                comments={invitation.comments || []}
                buttonClassName="bg-[#214d80] hover:bg-[#2a5da0] text-white"
                textColor="text-[#214d80]"
                replyWrapperClassName="border border-[#214d80]"
              />
            </section>
          )}

          <div className=" h-screen-dvh space-y-16 overflow-hidden">
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <Premium2Decoration type="002" />

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
                  <div className="font-playfair text-[#214d80] text-5xl">
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
                  src="/assets/img/azen-white.png"
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

export default Premium2Page;
