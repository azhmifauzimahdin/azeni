import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Theme
  const theme = await prisma.theme.create({
    data: {
      name: "premium-001",
      originalPrice: 50000,
      discount: 0,
    },
  });

  // Create Bank
  const bank1 = await prisma.bank.create({
    data: {
      name: "Mandiri",
    },
  });

  const bank2 = await prisma.bank.create({
    data: {
      name: "BCA",
    },
  });

  const bank3 = await prisma.bank.create({
    data: {
      name: "Kado",
    },
  });

  const paymentStatus = await prisma.paymentStatus.create({
    data: {
      name: "Lunas",
    },
  });

  await prisma.paymentStatus.createMany({
    data: [
      {
        name: "Menunggu Pembayaran",
      },
      {
        name: "Batal",
      },
    ],
  });

  // Create Invitation
  const invitation = await prisma.invitation.create({
    data: {
      userId: "39efd6e4-0a47-4a39-b4e0-ef1f8756c4f5",
      groom: "Rey",
      bride: "Dinda",
      slug: "premium-001",
      themeId: theme.id,
      image: "/assets/themes/premium-001/img/cover.jpg",
      date: new Date("2028-07-27T00:00:00Z"),
      expiresAt: new Date("9999-12-31T00:00:00Z"),
    },
  });

  await prisma.music.create({
    data: {
      name: "backsound_dhmtt6",
      invitationId: invitation.id,
    },
  });

  //create Transaction
  await prisma.transaction.create({
    data: {
      invitationId: invitation.id,
      amount: 50000,
      date: new Date("2025-01-01T12:00:00Z"),
      statusId: paymentStatus.id,
    },
  });

  // Create Quote
  await prisma.quote.create({
    data: {
      name: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      author: "QS. Ar-Rum: 21",
      invitationId: invitation.id,
    },
  });

  // Create Schedule
  await prisma.schedule.create({
    data: {
      invitationId: invitation.id,
      type: "marriage",
      name: "Akad Nikah",
      startDate: new Date("2028-07-27T10:00:00Z"),
      endDate: new Date("2028-07-27T12:00:00Z"),
      location: "Villa Azila, Cipayung, Jakarta Timur",
      location_maps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
    },
  });

  await prisma.schedule.create({
    data: {
      invitationId: invitation.id,
      type: "reception",
      name: "Resepsi",
      startDate: new Date("2028-07-27T12:00:00Z"),
      endDate: new Date("2028-07-27T15:00:00Z"),
      location: "Villa Azila, Cipayung, Jakarta Timur",
      location_maps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
    },
  });

  // Create Couple
  await prisma.couple.create({
    data: {
      invitationId: invitation.id,
      groomName: "Reynaldi Aditya Wisnu Hasidi Putra Atmaja Mbayang",
      groomFather: "Achmad Benny Mbayang",
      groomMother: "Lam Baghdadi",
      groomImage: "/assets/themes/premium-001/img/rey.jpg",
      brideName: "Nyimas Khodijah Nasthiti Adinda",
      brideFather: "Kemas Herman",
      brideMother: "Hulwati Husna",
      brideImage: "/assets/themes/premium-001/img/dinda.jpg",
    },
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitation.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        image: "/assets/themes/premium-001/img/story-pertemuan.jpeg",
      },
      {
        invitationId: invitation.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        image: "/assets/themes/premium-001/img/story-lamaran.jpg",
      },
      {
        invitationId: invitation.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        image: "/assets/themes/premium-001/img/story-pernikahan.jpg",
      },
    ],
  });

  // Create Gallery
  await prisma.gallery.createMany({
    data: [
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-001.jpg",
        description: "Gallery 1",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-002.jpg",
        description: "Gallery 2",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-003.jpg",
        description: "Gallery 3",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-004.jpg",
        description: "Gallery 4",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-005.jpg",
        description: "Gallery 5",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-006.jpg",
        description: "Gallery 6",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-007.jpg",
        description: "Gallery 7",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-008.jpg",
        description: "Gallery 8",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-009.jpg",
        description: "Gallery 9",
      },
      {
        invitationId: invitation.id,
        image: "/assets/themes/premium-001/img/gallery-010.jpg",
        description: "Gallery 10",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitation.id,
        bankId: bank1.id,
        nomor: "2732638623612512",
        name: "Nyimas Khodijah Nasthiti Adinda",
      },
      {
        invitationId: invitation.id,
        bankId: bank2.id,
        nomor: "8364718172726262",
        name: "Reynaldi Aditya Wisnu",
      },
      {
        invitationId: invitation.id,
        bankId: bank3.id,
        nomor: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const guest = await prisma.guest.create({
    data: {
      invitationId: invitation.id,
      name: "Hamba Allah",
      address: "-",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  // Create Comments
  await prisma.comment.createMany({
    data: [
      {
        invitationId: invitation.id,
        guestId: guest.id,
        message:
          "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
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
