import NotFound from "@/components/screens/not-found";
import { SampleComponents } from "@/components/template";
import { generatePageMetadata } from "@/lib/metadata";
import { InvitationService } from "@/lib/services";

type InvitationPageProps = {
  params: {
    slug: string;
    guestCode: string;
  };
};

export const generateMetadata = ({ params }: InvitationPageProps) =>
  generatePageMetadata({ fallbackTitle: "Undangan", slug: params.slug });

const InvitationPage = async ({ params }: InvitationPageProps) => {
  let invitation = null;

  try {
    invitation = await InvitationService.fetchInvitationByslugWithGuestByCode(
      params.slug,
      params.guestCode
    );
  } catch (error: unknown) {
    console.log(error);
  }

  if (!invitation?.data.theme) {
    return <NotFound type="theme" message="Tema undangan tidak ditemukan" />;
  }

  if (!invitation?.data.guest) {
    return <NotFound type="guest" message="Tamu tidak ditemukan" />;
  }

  if (!invitation.data.setting?.invitationEnabled) {
    return (
      <NotFound
        type="inactive"
        message="Undangan Sedang tidak aktif"
        imageUrl={invitation.data.image}
      />
    );
  }

  if (new Date() > new Date(invitation.data.expiresAt)) {
    return <NotFound type="expired" message="Undangan kedaluwarsa" />;
  }

  const ThemeComponent = SampleComponents[invitation.data.theme.name];
  return <ThemeComponent {...invitation.data} />;
};

export default InvitationPage;
