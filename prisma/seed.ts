import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Theme
  const theme = await prisma.theme.create({
    data: {
      name: "premium-001",
      thumbnail:
        "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751205982/thumbnail-premium001_ijf4jj.png",
      originalPrice: 50000,
      discount: 0,
      colorTag: "green",
    },
  });

  await prisma.theme.create({
    data: {
      name: "premium-002",
      thumbnail:
        "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751205982/thumbnail-premium001_ijf4jj.png",
      originalPrice: 50000,
      discount: 0,
      colorTag: "green",
    },
  });

  // Create Bank
  const bank1 = await prisma.bank.create({
    data: {
      name: "Mandiri",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1750689696/bank-mandiri_c2baqu.svg",
    },
  });

  const bank2 = await prisma.bank.create({
    data: {
      name: "BCA",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1750689696/bank-bca_v7qdpq.svg",
    },
  });

  const bank3 = await prisma.bank.create({
    data: {
      name: "Kado",
      icon: "",
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

  const music = await prisma.music.create({
    data: {
      name: "Ketika Cinta Bertasbih - Melly Goeslaw Cover Cindi Cintya Dewi ( Lirik )",
      src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1750521731/music/w0esrtsvn4caiuubjza9.mp3",
      origin: "https://www.youtube.com/watch?v=JAqxrXjodn8",
    },
  });

  await prisma.music.createMany({
    data: [
      {
        name: "Pernikahan Kita - Arsy Widianto & Tiara Andini Saxophone Cover (FHSax)",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1750586448/music/w0hxevdwcbicvnicamig.mp3",
        origin: "https://www.youtube.com/watch?v=3bao93imICs",
      },
      {
        name: "Janji Suci Cover Saxophone - Yovie And Nuno",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1750601830/music/zighsz0uef03pg2vyptj.mp3",
        origin: "https://www.youtube.com/watch?v=NbCCGvl5AQE",
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
      musicId: music.id,
      image: "/assets/themes/premium-001/img/cover.jpg",
      date: new Date("2028-07-27T00:00:00Z"),
      expiresAt: new Date("9999-12-31T00:00:00Z"),
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

  // Create Quote Template

  await prisma.quoteTemplate.createMany({
    data: [
      {
        name: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
        author: "QS. Ar-Rum: 21",
      },
      {
        name: "Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan juga orang-orang yang layak (menikah) dari hamba-hamba sahayamu yang laki-laki dan perempuan. Jika mereka miskin, Allah akan memberi kemampuan kepada mereka dengan karunia-Nya.",
        author: "QS. An-Nur: 32",
      },
      {
        name: "Ya Tuhan kami, anugerahkanlah kepada kami istri-istri kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.",
        author: "QS. Al-Furqan: 74",
      },
      {
        name: "Dialah yang menciptakan kamu dari diri yang satu dan dari padanya Dia menciptakan istrinya, agar dia merasa senang kepadanya.",
        author: "QS. Al-A'raf: 189",
      },
    ],
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
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T05:00:00Z"),
      location: "Villa Azila, Cipayung, Jakarta Timur",
      locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
      timezone: "WIB",
    },
  });

  await prisma.schedule.create({
    data: {
      invitationId: invitation.id,
      type: "reception",
      name: "Resepsi",
      startDate: new Date("2028-07-27T05:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      location: "Villa Azila, Cipayung, Jakarta Timur",
      locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
      timezone: "WIB",
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
        accountNumber: "2732638623612512",
        name: "Nyimas Khodijah Nasthiti Adinda",
      },
      {
        invitationId: invitation.id,
        bankId: bank2.id,
        accountNumber: "8364718172726262",
        name: "Reynaldi Aditya Wisnu",
      },
      {
        invitationId: invitation.id,
        bankId: bank3.id,
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const guest = await prisma.guest.create({
    data: {
      invitationId: invitation.id,
      name: "tamu",
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
