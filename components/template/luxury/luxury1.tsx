"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomNavbar from "@/components/navigations/BottomNavbar";
import SpinningDisc from "@/components/ui/spinning-disc";
import { navLinks } from "@/data/navLinks";
import { Gallery, Invitation } from "@/types";
import GoogleCalender from "../../ui/google-calender";
import CountdownTimer from "../../ui/countdown-timer";
import { formatDate } from "@/lib/utils/formatted-date";
import { MapPinCheckInside } from "lucide-react";
import {
  IoMailOutline,
  IoLogoInstagram,
  IoLogoWhatsapp,
} from "react-icons/io5";
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
import InvitationModalLuxury from "@/components/modals/invitations/invitation-modal-luxury";

const Luxury1Page: React.FC<Invitation> = (initialInvitation) => {
  const [invitation, setInvitation] = useState<Invitation>(initialInvitation);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(true);
  const [isSubmittingRSVP, setIsSubmittingRSVP] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const images = useMemo(
    () => invitation.galleries?.map((g: Gallery) => g.image) || [],
    [invitation.galleries]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // ganti tiap 5 detik
    return () => clearInterval(interval);
  }, [images]);

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
    "dd . MM . yyyy"
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
    <div className="flex justify-end min-h-screen bg-gray-100 text-sm font-lora">
      <LeftSidebar imageSrc={invitation.image}>
        <h1 className="text-3xl font">The Wedding Of</h1>
        <div className="font-italiana text-8xl">
          {invitation.groom} & {invitation.bride}
        </div>
        <div>{formatDate(getEffectiveDate(invitation), "dd.MM.yyyy")}</div>
      </LeftSidebar>

      <div className="relative w-full sm:w-[390px] min-h-screen text-white shadow-lg overflow-hidden">
        {/* Background fixed */}
        <div className="fixed top-0 bottom-0 right-0 left-0 sm:left-auto z-0 h-screen-lvh">
          <Img
            src={images[index]}
            alt="Background"
            wrapperClassName="w-full sm:w-[390px] h-full"
            className="object-cover object-center"
            sizes="500px"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className={cn(isModalOpen && "h-screen-dvh overflow-hidden")}>
          <audio ref={audioRef} src={invitation.music?.src} loop />
          <SpinningDisc play={musicPlaying} />
          <BottomNavbar
            navLinks={navLinks}
            wrapperClassName="bg-white/10 backdrop-blur-md border border-white/20"
            linkClassName="bg-white text-gray-800 hover:bg-gray-200 shadow-md"
          />

          <InvitationModalLuxury
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
            className="flex-center h-screen overflow-hidden relative"
          >
            {/* Konten utama */}
            <div className="flex flex-col items-center justify-center text-center gap-3 relative z-20 w-full">
              <h1 className="font-medium">The Wedding Of</h1>

              <div className="mb-3 space-y-3">
                <div className="font-italiana text-4xl">
                  {invitation.groom} & {invitation.bride}
                </div>
                <div className="text-lg">{formattedMarriageDate}</div>
              </div>
            </div>
          </section>

          {(invitation.quote || invitation.couple) && (
            <div
              className="w-full bg-[url('/assets/themes/luxury-001/img/geometric-white.png')] 
            bg-repeat-y bg-center [background-size:100%_auto] relative"
            >
              {/* ====== Quote Section ======*/}
              {invitation.quote && (
                <section className="text-slate-600 pt-16 px-6 relative">
                  <blockquote
                    className="relative bg-white text-center px-8 pt-8 pb-0 max-w-3xl mx-auto rounded-xl border border-white/20 shadow-lg backdrop-blur-sm space-y-4"
                    data-aos="fade-up"
                  >
                    <p className="font-semibold">
                      &quot;{invitation.quote?.name}&quot;
                    </p>
                    <cite className="block mt-4 ">
                      - {invitation.quote?.author} -
                    </cite>
                    <p className="text-center text-7xl opacity-50">“</p>
                  </blockquote>
                </section>
              )}

              {/* ====== Couple Section ======*/}
              {invitation.couple && (
                <section className="text-slate-700 relative">
                  <div className="flex flex-col items-center justify-center text-center py-16 gap-3 w-full">
                    <h1 className="relative z-10 text-3xl tracking-wider">
                      Pasangan
                    </h1>
                    <h2 className="mb-6 px-3" data-aos="fade-up">
                      {invitation.setting?.coupleIntroductionText}
                    </h2>
                    <div className="w-full grid grid-cols-[1fr_auto_1fr] gap-3">
                      <div className="space-y-4">
                        <Img
                          src={
                            invitation.couple?.groomImage ||
                            "/assets/img/default-groom-invitation.png"
                          }
                          alt="Groom"
                          wrapperClassName="aspect-[3/4] w-10/12 mx-auto shadow-md border-4 border-white rounded-b-3xl rounded-t-[200px] overflow-hidden"
                          sizes="300px"
                          priority
                          data-aos="fade-down"
                        />
                        <h2
                          className="text-xl font-semibold"
                          data-aos="zoom-in"
                        >
                          {invitation.couple?.groomName}
                        </h2>
                        <p
                          className=" text-sm"
                          data-aos="fade-up"
                          data-aos-delay="700"
                        >
                          Putra dari Bapak {invitation.couple?.brideFather}
                          &nbsp;&&nbsp; Ibu {invitation.couple?.brideMother}
                        </p>
                        <p data-aos="fade-up" data-aos-delay="700">
                          <Link
                            href={invitation.couple?.groomInstagram}
                            target="_blank"
                            className="inline-block"
                          >
                            <IoLogoInstagram size={20} />
                          </Link>
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className="text-2xl font-semibold text-slate-600 font-italiana"
                          data-aos="flip-left"
                        >
                          &
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Img
                          src={
                            invitation.couple?.brideImage ||
                            "/assets/img/default-bride-invitation.png"
                          }
                          alt="Bride"
                          wrapperClassName="aspect-[3/4] w-10/12 mx-auto shadow-md border-4 border-white rounded-b-3xl rounded-t-[200px] overflow-hidden"
                          sizes="300px"
                          priority
                          data-aos="fade-down"
                        />
                        <h2
                          className="text-xl font-semibold"
                          data-aos="zoom-in"
                        >
                          {invitation.couple?.brideName}
                        </h2>
                        <p
                          className="text-sm"
                          data-aos="fade-up"
                          data-aos-delay="700"
                        >
                          Putri dari Bapak {invitation.couple?.brideFather}
                          &nbsp;&&nbsp;
                          {invitation.couple?.brideMother}
                        </p>
                        <p data-aos="fade-up" data-aos-delay="700">
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
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ====== Schdule Section ======  */}
          {invitation.schedules.length > 0 && (
            <section
              id="schedule"
              className="relative flex justify-center items-center overflow-hidden bg-gradient-to-b from-transparent to-neutral-500/95"
            >
              <div className="relative z-20 w-full py-20 px-3 space-y-8">
                <div
                  className="w-full p-8 text-center rounded-t-[200px] rounded-b-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-5"
                  data-aos="fade-up"
                >
                  <div data-aos="zoom-in">
                    <Img
                      src="/assets/svg/countdown-white.svg"
                      alt="Countdown"
                      wrapperClassName="w-20 h-20 mx-auto"
                      sizes="300px"
                    />
                  </div>

                  <div
                    className="text-lg"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    {formatDate(
                      getEffectiveDate(invitation),
                      "EEEE, dd MMMM yyyy"
                    )}
                  </div>

                  <div data-aos="flip-up" data-aos-delay="200">
                    <CountdownTimer
                      targetDate={getEffectiveDate(invitation)}
                      bgColor="bg-transparent"
                      labelColor="text-white"
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
                        variant: "white-outline",
                      })}
                    />
                  </div>
                </div>

                <div
                  className="relative rounded-xl overflow-hidden text-center text-white py-16"
                  data-aos="fade-up"
                >
                  <Img
                    src={invitation.image}
                    alt="Background"
                    wrapperClassName="absolute inset-0 w-full h-full"
                    className="object-cover"
                    data-aos="zoom-in"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="text-center space-y-3">
                    <h1 className="relative z-10 text-3xl tracking-wider">
                      Waktu & Tempat
                    </h1>
                    <h2 data-aos="fade-up">
                      {invitation.setting?.scheduleIntroductionText}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {invitation.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition duration-300"
                      data-aos="fade-up"
                    >
                      <div
                        className="flex justify-center mb-6"
                        data-aos="zoom-in"
                      >
                        {schedule.type === "marriage" ? (
                          <Img
                            src="/assets/svg/marriage-gray.svg"
                            alt="Wedding"
                            wrapperClassName="w-16 h-16 mx-auto"
                          />
                        ) : schedule.type === "reception" ? (
                          <Img
                            src="/assets/svg/reception-gray.svg"
                            alt="Reception"
                            wrapperClassName="w-16 h-16 mx-auto"
                          />
                        ) : (
                          <Img
                            src="/assets/svg/schedule-gray.svg"
                            alt="Schedule"
                            wrapperClassName="w-16 h-16 mx-auto"
                          />
                        )}
                      </div>

                      <h3
                        className="text-lg font-semibold text-center text-slate-900 mb-2"
                        data-aos="zoom-in"
                      >
                        {schedule.name}
                      </h3>

                      <div
                        className="text-xl font-bold text-center text-slate-800 mb-2"
                        data-aos="zoom-in"
                      >
                        {formatDate(schedule.startDate, "dd . MM . yyyy")}
                      </div>

                      <p
                        className="text-center text-slate-600 mb-4"
                        data-aos="zoom-in"
                      >
                        {formatTime(schedule.startDate)} –{" "}
                        {formatTime(schedule.endDate)} WIB
                      </p>

                      <div className="text-center" data-aos="zoom-in">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                          Lokasi
                        </p>
                        <p className="text-slate-700">{schedule.location}</p>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <Button
                          onClick={() =>
                            window.open(
                              schedule.locationMaps,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                          className="bg-stone-500 hover:bg-stone-600 text-white transition-colors"
                          data-aos="zoom-in"
                        >
                          <MapPinCheckInside size={16} /> Lihat Lokasi
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ====== Our Story Section ====== */}
          {invitation.stories.length > 0 && (
            <section
              id="story"
              className="flex-center relative overflow-hidden bg-neutral-500/95 px-6 pb-16"
            >
              <div
                className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition duration-300"
                data-aos="fade-up"
              >
                <Img
                  src="/assets/svg/love-story-stone-500.svg"
                  alt="Wedding"
                  wrapperClassName="w-20 h-20 mb-8 mx-auto"
                  data-aos="zoom-in"
                />
                <h1
                  className="text-3xl tracking-wider text-center text-stone-500 mb-8"
                  data-aos="zoom-in"
                >
                  Cerita Kita
                </h1>

                <div className="space-y-8">
                  {invitation.stories.map((story, index) => (
                    <div key={index} data-aos="fade-up">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        {story.title}
                      </h3>
                      <span className="block text-sm text-slate-500 mb-3">
                        {formatDate(story.date, "MMMM yyyy")}
                      </span>

                      {story.image && (
                        <Image
                          src={story.image}
                          alt="Foto"
                          className="w-full h-auto object-contain rounded-lg overflow-hidden mb-3"
                          priority
                        />
                      )}

                      <p className="text-slate-700">{story.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ====== Galleries Section ====== */}
          {invitation.galleries.length > 0 && (
            <section
              id="galleries"
              className="flex-center bg-gradient-to-b from-neutral-500/95 from-0% via-neutral-500/95 via-83% to-transparent to-100% relative overflow-hidden px-6"
            >
              <div className="relative z-20 w-full text-center py-16 space-y-3">
                <h2 className="text-3xl tracking-wider" data-aos="fade-up">
                  Galeri
                </h2>
                <p className="mb-8" data-aos="fade-up">
                  Photo By {invitation.groom} & {invitation.bride}
                </p>
                <GalleryGrid
                  galleries={invitation.galleries}
                  imageRounded="rounded-lg"
                />
              </div>
            </section>
          )}

          {/* ====== Gift Section ====== */}
          {invitation.bankaccounts.length > 0 && (
            <section className="py-20 px-6 text-center relative">
              <div>
                <Img
                  src="/assets/img/gift.png"
                  alt="Wedding"
                  sizes="300px"
                  wrapperClassName="w-20 h-20 mb-8 mx-auto"
                  data-aos="zoom-in"
                />
                <h2 className="text-3xl tracking-wider mb-5" data-aos="fade-up">
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
              </div>
            </section>
          )}

          {/* ====== RSVP Section ====== */}
          <section className="flex-center px-6 py-16 relative overflow-hidden">
            <div className="flex-center text-slate-900 flex-col text-center gap-3 relative z-20 w-full  border border-gray-200 bg-white p-8 rounded-lg">
              <Img
                src="/assets/svg/rsvp-stone-500.svg"
                alt="Wedding"
                wrapperClassName="w-20 h-20 mb-8 mx-auto"
                data-aos="zoom-in"
              />
              <h2
                className="text-3xl tracking-wider text-stone-500"
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
                    buttonClassName="bg-stone-500 hover:bg-stone-600 text-white transition-colors"
                  />
                </div>
              )}
            </div>
          </section>

          {/* ====== Comment Section ====== */}
          {invitation.setting?.commentEnabled && (
            <section
              className="w-full bg-[url('/assets/themes/luxury-001/img/geometric-white.png')] 
            bg-repeat-y bg-center [background-size:100%_auto] relative pt-16 pb-24"
            >
              <h2
                className="text-3xl tracking-wider text-stone-500 text-center mb-8"
                data-aos="fade-up"
              >
                Ucapan & Doa
              </h2>
              <CommentSection
                invitation={invitation}
                setInvitation={setInvitation}
                comments={invitation.comments || []}
                buttonClassName="bg-stone-500 hover:bg-stone-600 text-white transition-colors"
                textColor="text-stone-500"
                replyWrapperClassName="border border-stone-500"
              />
            </section>
          )}

          {/* ====== Footer Section ======*/}
          <div className="flex flex-col items-center justify-center min-h-screen-dvh space-y-16 overflow-hidden relative">
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
                <div className="font-italiana text-5xl">
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
                    className="hover:text-stone-500 transition"
                  >
                    <IoMailOutline size={20} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/azen.inv?igsh=Nmp6djVucWNzejdm&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-500 transition"
                  >
                    <IoLogoInstagram size={20} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://api.whatsapp.com/send/?phone=628895276116&text=Halo%2C+saya+tertarik+dengan+undangan+digitalnya.%0ABisa+saya+dapatkan+informasi+lebih+lanjut%3F&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-500 transition"
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
  );
};

export default Luxury1Page;
