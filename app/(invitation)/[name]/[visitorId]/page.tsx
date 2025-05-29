/* eslint-disable @typescript-eslint/no-unused-vars */
import { themeComponents } from "@/components/themes";
import { fetchInvitationByname } from "@/lib/services/invitation";
import { Invitation } from "@prisma/client";

type InvitationPageProps = {
  params: {
    name: string;
  };
};
const InvitationPage = async ({ params }: InvitationPageProps) => {
  const invitation: Invitation | null = null;

  // try {
  //   invitation = await fetchInvitationByname(params.name);
  // } catch (error: unknown) {
  //   if (error instanceof Error) {
  //     console.error("Failed to fetch invitation:", error.message);
  //   } else {
  //     console.error("Failed to fetch invitation: Unknown error");
  //   }
  // }

  // const theme = invitation?.theme || "A";
  const theme = invitation || "A";
  const ThemeComponent = themeComponents[theme] || themeComponents["A"];

  return <ThemeComponent data={invitation} />;
};

export default InvitationPage;
