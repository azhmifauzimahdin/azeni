import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const invitation = await prisma.invitation.findFirst({
    where: {
      slug: "luxury-001",
    },
  });

  await prisma.couple.createMany({
    data: [
      {
        invitationId: invitation?.id || "",
        groomName: "Rizky Pratama",
        groomFather: "Bambang Supriyanto",
        groomMother: "Siti Aminah",
        groomImage: "/assets/img/rizky-putri/rikzy.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Putri Ayu Lestari",
        brideFather: "Ahmad Syafrudin",
        brideMother: "Dewi Hartati",
        brideImage: "/assets/img/rizky-putri/putri.jpg",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
