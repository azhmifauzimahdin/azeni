import NotFound from "@/components/screens/not-found";
import { SampleComponents } from "@/components/template";
import { GuestService, InvitationService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";

type InvitationPageProps = {
  params: {
    slug: string;
    guestCode: string;
  };
};
const InvitationPage = async ({ params }: InvitationPageProps) => {
  const { slug } = params;
  let invitation = null;
  let guest = null;

  try {
    invitation = await InvitationService.fetchInvitationByslug(slug);
    guest = await GuestService.fetchGuestByCode(
      invitation.data.id,
      params.guestCode
    );
  } catch (error: unknown) {
    handleError(error, "invitation");
  }

  if (!invitation?.data?.theme) {
    return <NotFound message="Tema undangan tidak ditemukan" />;
  }

  if (!guest) {
    return <NotFound message="Tamu tidak ditemukan" />;
  }

  const props = {
    ...invitation.data,
    currentGuest: guest.data,
  };

  const ThemeComponent = SampleComponents[invitation.data.theme.name];
  return <ThemeComponent {...props} />;
};

export default InvitationPage;
