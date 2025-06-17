import NotFound from "@/components/screens/not-found";
import { SampleComponents } from "@/components/template";
import { GuestService, InvitationService } from "@/lib/services";
import { Guest, Invitation } from "@/types";
import { handleError } from "@/lib/utils/handle-error";

type InvitationPageProps = {
  params: {
    slug: string;
    guestId: string;
  };
};
const InvitationPage = async ({ params }: InvitationPageProps) => {
  const { slug } = params;
  let invitation: Invitation | null = null;
  let guest: Guest | null = null;

  try {
    invitation = await InvitationService.fetchInvitationByslug(slug);
    guest = await GuestService.fetchGuestById(invitation.id, params.guestId);
  } catch (error: unknown) {
    handleError(error, "invitation");
  }

  if (!invitation) {
    return <NotFound message="Undangan tidak ditemukan" />;
  }

  if (!guest) {
    return <NotFound message="Tamu tidak ditemukan" />;
  }

  const props = {
    ...invitation,
    currentGuest: guest,
  };

  const ThemeComponent = SampleComponents[invitation.theme.name];
  return <ThemeComponent {...props} />;
};

export default InvitationPage;
