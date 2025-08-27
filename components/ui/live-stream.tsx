import { formatDate } from "@/lib/utils/formatted-date";
import { formatTime } from "@/lib/utils/formatted-time";
import { Invitation } from "@/types";
import { Button } from "./button";
import {
  IoLink,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTiktok,
  IoLogoYoutube,
  IoVideocam,
} from "react-icons/io5";
import { cn } from "@/lib/utils";

interface LiveStreamProps {
  invitation: Invitation;
  wrapperClassName?: string;
  titleClassName?: string;
  buttonVariant?: string;
}

const LiveStream: React.FC<LiveStreamProps> = ({
  invitation,
  wrapperClassName = "rounded-xl border border-white/20 shadow-lg backdrop-blur-sm",
  titleClassName = "section-title !text-white",
  buttonVariant,
}) => {
  return (
    <div
      className={cn("relative text-center px-3 py-8 mx-auto", wrapperClassName)}
    >
      <h2 className={titleClassName} data-aos="zoom-in">
        Live Streaming
      </h2>
      <p className="font-semibold" data-aos="zoom-in">
        {formatDate(
          invitation.liveStream?.startDate || "",
          "EEEE, dd MMMM yyyy"
        )}
      </p>
      <p className="opacity-80 text-sm" data-aos="zoom-in">
        {formatTime(invitation.liveStream?.startDate || "")} -&nbsp;
        {formatTime(invitation.liveStream?.endDate || "")}&nbsp;
        {invitation.setting?.timezone}
      </p>
      <p className="mb-5" data-aos="zoom-in">
        {invitation.setting?.liveStreamIntroductionText || ""}
      </p>
      <div className="flex justify-center flex-wrap gap-1">
        {invitation.liveStream?.urlYoutube && (
          <Button
            variant="default"
            className={buttonVariant}
            onClick={() =>
              window.open(
                invitation.liveStream?.urlYoutube,
                "_blank",
                "noopener,noreferrer"
              )
            }
            data-aos="zoom-in"
          >
            <IoLogoYoutube /> Join on YouTube
          </Button>
        )}
        {invitation.liveStream?.urlInstagram && (
          <Button
            variant="default"
            className={buttonVariant}
            onClick={() =>
              window.open(
                invitation.liveStream?.urlInstagram,
                "_blank",
                "noopener,noreferrer"
              )
            }
            data-aos="zoom-in"
          >
            <IoLogoInstagram /> Watch on Instagram
          </Button>
        )}
        {invitation.liveStream?.urlFacebook && (
          <Button
            variant="default"
            className={buttonVariant}
            onClick={() =>
              window.open(
                invitation.liveStream?.urlFacebook,
                "_blank",
                "noopener,noreferrer"
              )
            }
            data-aos="zoom-in"
          >
            <IoLogoFacebook /> Watch on Facebook
          </Button>
        )}
        {invitation.liveStream?.urlTiktok && (
          <Button
            variant="default"
            className={buttonVariant}
            onClick={() =>
              window.open(
                invitation.liveStream?.urlTiktok,
                "_blank",
                "noopener,noreferrer"
              )
            }
            data-aos="zoom-in"
          >
            <IoLogoTiktok /> Watch on TikTok
          </Button>
        )}
        {invitation.liveStream?.urlZoom && (
          <Button
            variant="default"
            className={buttonVariant}
            onClick={() =>
              window.open(
                invitation.liveStream?.urlZoom,
                "_blank",
                "noopener,noreferrer"
              )
            }
            data-aos="zoom-in"
          >
            <IoVideocam /> Join Zoom Meeting
          </Button>
        )}
        {invitation.liveStream?.urlCustom && (
          <Button
            variant="default"
            className={buttonVariant}
            onClick={() =>
              window.open(
                invitation.liveStream?.urlCustom,
                "_blank",
                "noopener,noreferrer"
              )
            }
            data-aos="zoom-in"
          >
            <IoLink /> Join Live Stream
          </Button>
        )}
      </div>
    </div>
  );
};

export default LiveStream;
