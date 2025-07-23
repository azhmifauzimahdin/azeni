"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import { Invitation } from "@/types";
import toast from "react-hot-toast";
import { GuestService } from "@/lib/services";
import useInvitationStore from "@/stores/invitation-store";
import { Badge } from "@/components/ui/badge";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

interface ScanFormsProps {
  params: { id: string };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const ScanForm: React.FC<ScanFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const duration = initialData?.setting?.scanResetCountdownSeconds ?? 5;
  const [scanned, setScanned] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "checkin" | "checkout" | "finish" | "error" | null
  >(null);
  const [scannedAt, setScannedAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const checkInGuestInInvitation = useInvitationStore(
    (state) => state.checkInGuestInInvitation
  );

  const checkOutGuestInInvitation = useInvitationStore(
    (state) => state.checkOutGuestInInvitation
  );

  const startCamera = async () => {
    setLoadingCamera(true);

    const devices = await Html5Qrcode.getCameras();
    if (!devices || devices.length === 0) {
      toast.error("Kamera tidak ditemukan");
      setLoadingCamera(false);
      return;
    }

    const cameraId = devices[0].id;
    const qr = new Html5Qrcode("qr-camera");
    html5QrCodeRef.current = qr;

    const container = document.getElementById("qr-camera");
    if (container) container.innerHTML = "";

    qr.start(
      cameraId,
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1,
        disableFlip: true,
      },
      (decodedText) => {
        onCheck(params.id, decodedText);
        stopCamera();
      },
      () => {}
    ).finally(() => {
      setCameraOn(true);
      setLoadingCamera(false);

      setTimeout(() => {
        const el = document.getElementById("qr-camera");
        const video = el?.querySelector("video") as HTMLVideoElement | null;
        const canvas = el?.querySelector("canvas") as HTMLCanvasElement | null;

        if (video) {
          video.className = "w-full h-full object-cover";
          video.style.aspectRatio = "1 / 1";
        }
        if (canvas) {
          canvas.className = "w-full h-full object-cover";
          canvas.style.aspectRatio = "1 / 1";
        }
      }, 300);
    });
  };

  const onCheck = async (id: string, guestId: string) => {
    try {
      setLoading(true);
      const res = await GuestService.checkInOutGuest(id, guestId);
      if (res.data.status === "checkin")
        checkInGuestInInvitation(params.id, res.data.id, res.data.date);
      else checkOutGuestInInvitation(params.id, res.data.id, res.data.date);

      setScanned(res.data.name);
      setStatus(res.data.status);
      setScannedAt(res.data.date);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const message =
        error?.response?.data?.message ||
        "Terjadi kesalahan saat check-in/check-out";

      if (message === "Tamu sudah melakukan check-out sebelumnya.") {
        setScanned("Tamu ditemukan");
        setStatus("finish");
        setScannedAt(new Date().toISOString());
      } else {
        setScanned("Tamu tidak ditemukan");
        setStatus("error");
        setScannedAt(new Date().toISOString());
      }
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop();
      await html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
    setCameraOn(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (scanned) {
      let seconds = duration;
      setCountdown(seconds);

      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);

        if (seconds <= 0) {
          clearInterval(interval);
          resetScanner();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanned, duration]);

  const resetScanner = () => {
    setScanned(null);
    setStatus(null);
    setScannedAt(null);
    setCountdown(null);
    startCamera();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-10">
      {initialData?.image && (
        <Img
          src={initialData.image}
          alt="Background"
          wrapperClassName="absolute inset-0 z-0 blur-sm brightness-95"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 z-0 bg-white/35" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg">
        <Img
          src="https://res.cloudinary.com/dxtqjuvcg/image/upload/v1752573270/azen_te7lav.png"
          wrapperClassName="w-10 h-10 mb-4"
          alt="Logo"
          sizes="48px"
        />

        <h1 className="text-3xl md:text-4xl font-bold text-green-app-primary mb-6 text-center">
          Scan Undangan
        </h1>

        {scanned ? (
          <div
            className={cn(
              "text-center mt-4 w-full max-w-sm backdrop-blur-md p-6 rounded-xl shadow-lg border",
              status !== "checkin" && status !== "checkout"
                ? "bg-red-100/70 border-red-200"
                : "bg-white/70 border-green-100"
            )}
          >
            <p className="text-xl font-semibold text-green-app-primary break-words">
              {scanned}
            </p>

            {status && (
              <div className="mt-4 flex flex-col items-center">
                <Badge
                  variant={
                    status === "checkin"
                      ? "primary"
                      : status === "checkout"
                      ? "destructive"
                      : "default"
                  }
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {status === "checkin"
                    ? "Check-in Berhasil"
                    : status === "checkout"
                    ? "Check-out Berhasil"
                    : status === "finish"
                    ? "Sudah Check-out Sebelumnya"
                    : "Gagal Check-in/Check-out"}
                </Badge>

                {scannedAt && (
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(scannedAt).toLocaleString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 w-full space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#008080] h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(countdown ?? 0) * (100 / duration)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Kembali ke mode scan dalam {countdown} detik...
              </p>

              <Button
                variant="secondary"
                onClick={resetScanner}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Memuat...</span>
                  </div>
                ) : (
                  "Kembali Sekarang"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-sm aspect-square rounded-xl overflow-hidden shadow-md bg-black ring-4 ring-[#008080]/10 hover:ring-[#008080]/30 transition-all">
              <div id="qr-camera" className="absolute inset-0 w-full h-full" />
              {!cameraOn && !loadingCamera && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm bg-gray-100 z-10">
                  Kamera belum aktif
                </div>
              )}
              {loadingCamera && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
                  <div className="animate-spin h-8 w-8 border-4 border-[#008080] border-t-transparent rounded-full" />
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
                  <div className="animate-spin h-10 w-10 border-4 border-[#008080] border-t-transparent rounded-full mb-2" />
                  <p className="text-sm text-[#008080] font-medium">
                    Memproses data tamu...
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center mt-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={cameraOn}
                  onCheckedChange={(val) => {
                    if (val) startCamera();
                    else stopCamera();
                  }}
                  disabled={loadingCamera}
                  isFetching={isFetching}
                />
              </div>
              <p className="text-sm text-green-app-primary mt-2">
                {cameraOn
                  ? "Kamera aktif - arahkan ke QR undangan"
                  : "Aktifkan kamera untuk mulai scan"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScanForm;
