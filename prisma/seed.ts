import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

function generateKode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${num}${suffix}`;
}

function calculateFinalPrice(
  originalPrice: Decimal,
  discount: Decimal,
  isPercent: boolean
): Decimal {
  const finalPrice = isPercent
    ? originalPrice.sub(originalPrice.mul(discount).div(100))
    : originalPrice.sub(discount);

  return Decimal.max(new Decimal(0), finalPrice);
}

async function generateUniqueCode(): Promise<string> {
  let code = "";
  let unique = false;

  while (!unique) {
    code = generateKode();
    const existing = await prisma.guest.findUnique({ where: { code } });
    if (!existing) unique = true;
  }

  return code;
}

async function main() {
  // Create Theme
  const themeCategory1 = await prisma.themeCategory.create({
    data: {
      name: "Premium",
    },
  });

  // const themeCategory2 = await prisma.themeCategory.create({
  //   data: {
  //     name: "Luxury",
  //   },
  // });

  const themePremium = await prisma.theme.create({
    data: {
      name: "premium-001",
      categoryId: themeCategory1.id,
      thumbnail: "/assets/themes/premium-001/img/thumbnail.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "green",
    },
  });

  // const themeLuxury = await prisma.theme.create({
  //   data: {
  //     name: "Luxury-001",
  //     categoryId: themeCategory2.id,
  //     thumbnail:
  //       "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751205982/thumbnail-premium001_ijf4jj.png",
  //     originalPrice: 100000,
  //     discount: 25000,
  //     isPercent: false,
  //     colorTag: "green",
  //   },
  // });

  // Create Bank
  const bankMandiri = await prisma.bank.create({
    data: {
      name: "Mandiri",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1752682792/bank-mandiri_sjprpl.png",
    },
  });

  const bankBCA = await prisma.bank.create({
    data: {
      name: "BCA",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1752683060/bank-bca_ao5ayt.png",
    },
  });

  const bankKado = await prisma.bank.create({
    data: {
      name: "Kado",
      icon: "",
    },
  });

  const paymentStatus = await prisma.paymentStatus.create({
    data: {
      name: "SUCCESS",
    },
  });

  await prisma.paymentStatus.createMany({
    data: [
      {
        name: "CREATED",
      },
      {
        name: "PENDING",
      },
      {
        name: "FAILED",
      },
      {
        name: "EXPIRED",
      },
      {
        name: "CANCELLED",
      },
      {
        name: "REFUNDED",
      },
    ],
  });

  const music = await prisma.music.create({
    data: {
      name: "Ketika Cinta Bertasbih - Melly Goeslaw Cover Cindi Cintya Dewi ( Lirik )",
      src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1750521731/music/w0esrtsvn4caiuubjza9.mp3",
      origin: "https://www.youtube.com/watch?v=JAqxrXjodn8",
      visibility: true,
    },
  });

  await prisma.music.createMany({
    data: [
      {
        name: "Pernikahan Kita - Arsy Widianto & Tiara Andini Saxophone Cover (FHSax)",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1750586448/music/w0hxevdwcbicvnicamig.mp3",
        origin: "https://www.youtube.com/watch?v=3bao93imICs",
        visibility: true,
      },
      {
        name: "Janji Suci Cover Saxophone - Yovie And Nuno",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1750601830/music/zighsz0uef03pg2vyptj.mp3",
        origin: "https://www.youtube.com/watch?v=NbCCGvl5AQE",
        visibility: true,
      },
    ],
  });
  // Create Invitation
  const invitation1 = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Rey",
      bride: "Dinda",
      slug: "premium-001",
      themeId: themePremium.id,
      musicId: music.id,
      image: "/assets/img/rey-dinda/cover.jpg",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  // const invitation2 = await prisma.invitation.create({
  //   data: {
  //     userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
  //     groom: "Rey",
  //     bride: "Dinda",
  //     slug: "luxury-001",
  //     themeId: themeLuxury.id,
  //     musicId: music.id,
  //     image:
  //       "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1752590889/cover_fhqza7.jpg",
  //     date: new Date("2028-07-27T00:00:00Z"),
  //     isTemplate: true,
  //     expiresAt: new Date("2030-12-31T00:00:00Z"),
  //   },
  // });

  const amountPremium = calculateFinalPrice(
    themePremium.originalPrice,
    themePremium.discount,
    themePremium.isPercent
  );
  // const amountLuxury = calculateFinalPrice(
  //   themeLuxury.originalPrice,
  //   themeLuxury.discount,
  //   themeLuxury.isPercent
  // );
  //create Transaction
  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitation1.id,
        invitationSlug: invitation1.slug,
        groomName: invitation1.groom,
        brideName: invitation1.bride,
        originalAmount: themePremium.originalPrice,
        amount: amountPremium,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatus.id,
      },
      // {
      //   orderId: randomUUID(),
      //   invitationId: invitation2.id,
      //   invitationSlug: invitation2.slug,
      //   groomName: invitation2.groom,
      //   brideName: invitation2.bride,
      //   originalAmount: themeLuxury.originalPrice,
      //   amount: amountLuxury,
      //   date: new Date("2025-01-01T12:00:00Z"),
      //   statusId: paymentStatus.id,
      // },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitation1.id,
        whatsappMessageTemplate: `
Assalamu'alaikum warahmatullahi wabarakatuh,

Segala puji bagi Allah SWT yang telah mempertemukan dua insan dalam ikatan suci pernikahan.

Dengan penuh syukur, kami bermaksud mengabarkan kabar bahagia bahwa kami akan melangsungkan akad nikah dan walimatul 'urs dalam waktu dekat.

InsyaAllah akan menikah:

*{{brideName}} & {{groomName}}*  

Kami mengundang Bapak/Ibu/Saudara/i *{{name}}* untuk turut hadir dan berbagi doa restu dalam momen istimewa ini. Doa dan kehadiran Anda sangat berarti bagi kami dan keluarga besar.

Informasi lengkap mengenai waktu dan tempat pelaksanaan acara dapat dilihat melalui undangan digital berikut:

{{invitationLink}}

Semoga Allah SWT memberkahi langkah kami, dan semoga Bapak/Ibu/Saudara/i senantiasa diberi kesehatan dan kemudahan dalam segala urusan.

Wassalamu'alaikum warahmatullahi wabarakatuh.  
Hormat kami,  
*{{brideName}} & {{groomName}}*
`.trim(),
      },
      //       {
      //         invitationId: invitation2.id,
      //         whatsappMessageTemplate: `
      // Assalamu'alaikum warahmatullahi wabarakatuh,

      // Segala puji bagi Allah SWT yang telah mempertemukan dua insan dalam ikatan suci pernikahan.

      // Dengan penuh syukur, kami bermaksud mengabarkan kabar bahagia bahwa kami akan melangsungkan akad nikah dan walimatul 'urs dalam waktu dekat.

      // InsyaAllah akan menikah:

      // *{{brideName}} & {{groomName}}*

      // Kami mengundang Bapak/Ibu/Saudara/i *{{name}}* untuk turut hadir dan berbagi doa restu dalam momen istimewa ini. Doa dan kehadiran Anda sangat berarti bagi kami dan keluarga besar.

      // Informasi lengkap mengenai waktu dan tempat pelaksanaan acara dapat dilihat melalui undangan digital berikut:

      // {{invitationLink}}

      // Semoga Allah SWT memberkahi langkah kami, dan semoga Bapak/Ibu/Saudara/i senantiasa diberi kesehatan dan kemudahan dalam segala urusan.

      // Wassalamu'alaikum warahmatullahi wabarakatuh.
      // Hormat kami,
      // *{{brideName}} & {{groomName}}*
      // `.trim(),
      //       },
    ],
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
  await prisma.quote.createMany({
    data: [
      {
        name: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
        author: "QS. Ar-Rum: 21",
        invitationId: invitation1.id,
      },
      // {
      //   name: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      //   author: "QS. Ar-Rum: 21",
      //   invitationId: invitation2.id,
      // },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitation1.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitation1.id,
        type: "reception",
        name: "Resepsi",
        startDate: new Date("2028-07-27T05:00:00Z"),
        endDate: new Date("2028-07-27T08:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      // {
      //   invitationId: invitation2.id,
      //   type: "marriage",
      //   name: "Akad Nikah",
      //   startDate: new Date("2028-07-27T02:00:00Z"),
      //   endDate: new Date("2028-07-27T05:00:00Z"),
      //   location: "Villa Azila, Cipayung, Jakarta Timur",
      //   locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
      //   timezone: "WIB",
      // },
      // {
      //   invitationId: invitation2.id,
      //   type: "reception",
      //   name: "Resepsi",
      //   startDate: new Date("2028-07-27T05:00:00Z"),
      //   endDate: new Date("2028-07-27T08:00:00Z"),
      //   location: "Villa Azila, Cipayung, Jakarta Timur",
      //   locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
      //   timezone: "WIB",
      // },
    ],
  });

  // Create Couple
  await prisma.couple.createMany({
    data: [
      {
        invitationId: invitation1.id,
        groomName: "Reynaldi Aditya Wisnu Hasidi Putra Atmaja Mbayang",
        groomFather: "Achmad Benny Mbayang",
        groomMother: "Lam Baghdadi",
        groomImage: "/assets/img/rey-dinda/rey.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Nyimas Khodijah Nasthiti Adinda",
        brideFather: "Kemas Herman",
        brideMother: "Hulwati Husna",
        brideImage: "/assets/img/rey-dinda/dinda.jpg",
        brideInstagram: "https://www.instagram.com/",
      },
      // {
      //   invitationId: invitation2.id,
      //   groomName: "Reynaldi Aditya Wisnu Hasidi Putra Atmaja Mbayang",
      //   groomFather: "Achmad Benny Mbayang",
      //   groomMother: "Lam Baghdadi",
      //   groomImage: "/assets/themes/premium-001/img/rey.jpg",
      //   brideName: "Nyimas Khodijah Nasthiti Adinda",
      //   brideFather: "Kemas Herman",
      //   brideMother: "Hulwati Husna",
      //   brideImage: "/assets/themes/premium-001/img/dinda.jpg",
      // },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitation1.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        image: "/assets/img/rey-dinda/story-pertemuan.jpeg",
      },
      {
        invitationId: invitation1.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        image: "/assets/img/rey-dinda/story-lamaran.jpg",
      },
      {
        invitationId: invitation1.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        image: "/assets/img/rey-dinda/story-pernikahan.jpg",
      },
      // {
      //   invitationId: invitation2.id,
      //   title: "Pertemuan",
      //   date: new Date("2020-01-01T00:00:00Z"),
      //   description:
      //     "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
      //   image: "/assets/themes/premium-001/img/story-pertemuan.jpeg",
      // },
      // {
      //   invitationId: invitation2.id,
      //   title: "Lamaran",
      //   date: new Date("2025-05-25T00:00:00Z"),
      //   description:
      //     "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
      //   image: "/assets/themes/premium-001/img/story-lamaran.jpg",
      // },
      // {
      //   invitationId: invitation2.id,
      //   title: "Pernikahan",
      //   date: new Date("2028-07-27T00:00:00Z"),
      //   description:
      //     "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
      //   image: "/assets/themes/premium-001/img/story-pernikahan.jpg",
      // },
    ],
  });

  // Create Gallery
  await prisma.gallery.createMany({
    data: [
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-001.jpg",
        description: "Gallery 1",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-002.jpg",
        description: "Gallery 2",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-003.jpg",
        description: "Gallery 3",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-004.jpg",
        description: "Gallery 4",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-005.jpg",
        description: "Gallery 5",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-006.jpg",
        description: "Gallery 6",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-007.jpg",
        description: "Gallery 7",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-008.jpg",
        description: "Gallery 8",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-009.jpg",
        description: "Gallery 9",
      },
      {
        invitationId: invitation1.id,
        image: "/assets/img/rey-dinda/gallery-010.jpg",
        description: "Gallery 10",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitation1.id,
        bankId: bankMandiri.id,
        accountNumber: "2732638623612512",
        name: "Nyimas Khodijah Nasthiti Adinda",
      },
      {
        invitationId: invitation1.id,
        bankId: bankBCA.id,
        accountNumber: "8364718172726262",
        name: "Reynaldi Aditya Wisnu",
      },
      {
        invitationId: invitation1.id,
        bankId: bankKado.id,
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
      // {
      //   invitationId: invitation2.id,
      //   bankId: bankMandiri.id,
      //   accountNumber: "2732638623612512",
      //   name: "Nyimas Khodijah Nasthiti Adinda",
      // },
      // {
      //   invitationId: invitation2.id,
      //   bankId: bankBCA.id,
      //   accountNumber: "8364718172726262",
      //   name: "Reynaldi Aditya Wisnu",
      // },
      // {
      //   invitationId: invitation2.id,
      //   bankId: bankKado.id,
      //   accountNumber: "XXXXX",
      //   name: "Villa Azila, Cipayung, Jakarta Timur",
      // },
    ],
  });

  const kode1 = await generateUniqueCode();
  // const kode2 = await generateUniqueCode();

  const guest1 = await prisma.guest.create({
    data: {
      code: kode1,
      invitationId: invitation1.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  // const guest2 = await prisma.guest.create({
  //   data: {
  //     code: kode2,
  //     invitationId: invitation2.id,
  //     name: "tamu",
  //     isAttending: false,
  //     color: "bg-teal-500",
  //   },
  // });

  const comment1 = await prisma.comment.create({
    data: {
      invitationId: invitation1.id,
      guestId: guest1.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        invitationId: invitation1.id,
        guestId: guest1.id,
        message:
          "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
      },
      {
        invitationId: invitation1.id,
        guestId: guest1.id,
        message: "Selamat menempuh hidup baru!",
        parentId: comment1.id,
      },
    ],
  });

  await prisma.referralCode.createMany({
    data: [
      {
        userId: "39efd6e4-0a47-4a39-b4e0-ef1f8756c4f2",
        userName: "azen",
        code: "NIKAHFLAT20",
        description: "Dapatkan potongan harga langsung sebesar Rp10.000.",
        discount: new Decimal(20000),
        maxDiscount: new Decimal(0),
        isPercent: false,
        isActive: true,
      },
    ],
  });

  await prisma.referralCode.create({
    data: {
      userId: "user_2yXw1nNz13AvBzTrmDBjVeGWW7Q",
      userName: "azen",
      code: "NIKAHFLAT10",
      description: "Dapatkan potongan harga langsung sebesar Rp10.000.",
      discount: new Decimal(10000),
      maxDiscount: new Decimal(0),
      isPercent: false,
      isActive: true,
    },
  });

  await prisma.referralConfig.create({
    data: {
      userId: "39efd6e4-0a47-4a39-b4e0-ef1f8756c4f5",
      description: "Dapatkan potongan harga langsung sebesar Rp10.000.",
      discount: 10000,
      isPercent: false,
      maxDiscount: 0,
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitation1.id,
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
      startDate: new Date("2028-07-27T08:30:00.000Z"),
      endDate: new Date("2028-07-27T11:00:00.000Z"),
      description: "Live streaming acara akad nikah Andi & Bunga",
    },
  });

  // Contoh Undangan dengan pemakaian referral code
  // const invitationUser1 = await prisma.invitation.create({
  //   data: {
  //     userId: "39efd6e4-0a47-4a39-b4e0-ef1f8756c4f5",
  //     groom: "Azhmi",
  //     bride: "Rina",
  //     slug: "azhmi-rina",
  //     themeId: themePremium.id,
  //     musicId: music.id,
  //     image:
  //       "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1752590889/cover_fhqza7.jpg",
  //     date: new Date("2028-07-27T00:00:00Z"),
  //     isTemplate: true,
  //     expiresAt: new Date("2030-12-31T00:00:00Z"),
  //   },
  // });

  // await prisma.transaction.create({
  //   data: {
  //     orderId: randomUUID(),
  //     invitationId: invitationUser1.id,
  //     invitationSlug: invitationUser1.slug,
  //     groomName: invitationUser1.groom,
  //     brideName: invitationUser1.bride,
  //     originalAmount: themePremium.originalPrice,
  //     amount: amountPremium.sub(referral1.discount),
  //     referralCodeId: referral1.id,
  //     referralDiscountAmount: referral1.discount,
  //     date: new Date("2025-01-01T12:00:00Z"),
  //     statusId: paymentStatus.id,
  //   },
  // });
  // const invitationUser2 = await prisma.invitation.create({
  //   data: {
  //     userId: "39efd6e4-0a47-4a39-b4e0-ef1f8756c4f5",
  //     groom: "Azhmi",
  //     bride: "Eni",
  //     slug: "azhmi-eni",
  //     themeId: themePremium.id,
  //     musicId: music.id,
  //     image:
  //       "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1752590889/cover_fhqza7.jpg",
  //     date: new Date("2028-07-27T00:00:00Z"),
  //     isTemplate: true,
  //     expiresAt: new Date("2030-12-31T00:00:00Z"),
  //   },
  // });

  // await prisma.transaction.create({
  //   data: {
  //     orderId: randomUUID(),
  //     invitationId: invitationUser2.id,
  //     invitationSlug: invitationUser2.slug,
  //     groomName: invitationUser2.groom,
  //     brideName: invitationUser2.bride,
  //     originalAmount: themePremium.originalPrice,
  //     amount: amountPremium.sub(referral1.discount),
  //     referralCodeId: referral1.id,
  //     referralDiscountAmount: referral1.discount,
  //     date: new Date("2025-01-01T12:00:00Z"),
  //     statusId: paymentStatus.id,
  //   },
  // });

  // ========= Luxury 001 ===========
  const themeCategoryLuxury = await prisma.themeCategory.create({
    data: {
      name: "Luxury",
    },
  });

  const themeLuxury1 = await prisma.theme.create({
    data: {
      name: "luxury-001",
      categoryId: themeCategoryLuxury.id,
      thumbnail: "/assets/themes/luxury-001/img/thumbnail.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "brown",
    },
  });

  const paymentStatusSuccess = await prisma.paymentStatus.findFirst({
    where: {
      name: "SUCCESS",
    },
  });

  const musicLuxury1 = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=3bao93imICs",
    },
  });

  // Create Invitation
  const invitationLuxury1 = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Rizky",
      bride: "Putri",
      slug: "luxury-001",
      themeId: themeLuxury1.id,
      musicId: musicLuxury1?.id || null,
      image: "/assets/img/rizky-putri/cover.jpg",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountLuxury1 = calculateFinalPrice(
    themeLuxury1.originalPrice,
    themeLuxury1.discount,
    themeLuxury1.isPercent
  );

  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationLuxury1.id,
        invitationSlug: invitationLuxury1.slug,
        groomName: invitationLuxury1.groom,
        brideName: invitationLuxury1.bride,
        originalAmount: themeLuxury1.originalPrice,
        amount: amountLuxury1,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess?.id || "",
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationLuxury1.id,
        whatsappMessageTemplate: `
  Assalamu'alaikum warahmatullahi wabarakatuh,
  
  Segala puji bagi Allah SWT yang telah mempertemukan dua insan dalam ikatan suci pernikahan.
  
  Dengan penuh syukur, kami bermaksud mengabarkan kabar bahagia bahwa kami akan melangsungkan akad nikah dan walimatul 'urs dalam waktu dekat.
  
  InsyaAllah akan menikah:
  
  *{{brideName}} & {{groomName}}*  
  
  Kami mengundang Bapak/Ibu/Saudara/i *{{name}}* untuk turut hadir dan berbagi doa restu dalam momen istimewa ini. Doa dan kehadiran Anda sangat berarti bagi kami dan keluarga besar.
  
  Informasi lengkap mengenai waktu dan tempat pelaksanaan acara dapat dilihat melalui undangan digital berikut:
  
  {{invitationLink}}
  
  Semoga Allah SWT memberkahi langkah kami, dan semoga Bapak/Ibu/Saudara/i senantiasa diberi kesehatan dan kemudahan dalam segala urusan.
  
  Wassalamu'alaikum warahmatullahi wabarakatuh.  
  Hormat kami,  
  *{{brideName}} & {{groomName}}*
  `.trim(),
      },
    ],
  });

  // Create Quote
  await prisma.quote.createMany({
    data: [
      {
        name: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
        author: "QS. Ar-Rum: 21",
        invitationId: invitationLuxury1.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationLuxury1.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationLuxury1.id,
        type: "reception",
        name: "Resepsi",
        startDate: new Date("2028-07-27T05:00:00Z"),
        endDate: new Date("2028-07-27T08:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
    ],
  });

  // Create Couple
  await prisma.couple.createMany({
    data: [
      {
        invitationId: invitationLuxury1.id,
        groomName: "Rizky Pratama",
        groomFather: "Bambang Supriyanto",
        groomMother: "Siti Aminah",
        groomImage: "/assets/img/rizky-putri/rizky.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Putri Ayu Lestari",
        brideFather: "Ahmad Syafrudin",
        brideMother: "Dewi Hartati",
        brideImage: "/assets/img/rizky-putri/putri.jpg",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationLuxury1.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        image: "/assets/img/rizky-putri/story-pertemuan.jpg",
      },
      {
        invitationId: invitationLuxury1.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        image: "/assets/img/rizky-putri/story-lamaran.jpg",
      },
      {
        invitationId: invitationLuxury1.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        image: "/assets/img/rizky-putri/story-pernikahan.jpg",
      },
    ],
  });

  // Create Gallery
  await prisma.gallery.createMany({
    data: [
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-001.jpg",
        description: "Gallery 1",
      },
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-002.jpg",
        description: "Gallery 2",
      },
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-003.jpg",
        description: "Gallery 3",
      },
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-004.jpg",
        description: "Gallery 4",
      },
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-005.jpg",
        description: "Gallery 5",
      },
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-006.jpg",
        description: "Gallery 6",
      },
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-007.jpg",
        description: "Gallery 7",
      },
      {
        invitationId: invitationLuxury1.id,
        image: "/assets/img/rizky-putri/gallery-008.jpg",
        description: "Gallery 8",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationLuxury1.id,
        bankId: bankMandiri?.id || "",
        accountNumber: "2732638623612512",
        name: "Rizky Pratama",
      },
      {
        invitationId: invitationLuxury1.id,
        bankId: bankBCA?.id || "",
        accountNumber: "8364718172726262",
        name: "Putri Ayu Lestari",
      },
      {
        invitationId: invitationLuxury1.id,
        bankId: bankKado?.id || "",
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodeLuxury1 = await generateUniqueCode();

  const guestLuxuri1 = await prisma.guest.create({
    data: {
      code: kodeLuxury1,
      invitationId: invitationLuxury1.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationLuxury1.id,
      guestId: guestLuxuri1.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationLuxury1.id,
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
      startDate: new Date("2028-07-27T08:30:00.000Z"),
      endDate: new Date("2028-07-27T11:00:00.000Z"),
      description: "Live streaming acara akad nikah Andi & Bunga",
    },
  });

  // ======== Luxury 002 =========
  const themeLuxury2 = await prisma.theme.create({
    data: {
      name: "luxury-002",
      categoryId: themeCategoryLuxury?.id || "",
      thumbnail: "/assets/themes/luxury-002/img/thumbnail.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "gold",
    },
  });

  const musicLuxury2 = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=NbCCGvl5AQE",
    },
  });

  // Create Invitation
  const invitationLuxury2 = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Andika",
      bride: "Zahra",
      slug: "luxury-002",
      themeId: themeLuxury2.id,
      musicId: musicLuxury2?.id || null,
      image: "/assets/img/andika-zahra/cover.jpg",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountLuxury2 = calculateFinalPrice(
    themeLuxury2.originalPrice,
    themeLuxury2.discount,
    themeLuxury2.isPercent
  );

  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationLuxury2.id,
        invitationSlug: invitationLuxury2.slug,
        groomName: invitationLuxury2.groom,
        brideName: invitationLuxury2.bride,
        originalAmount: themeLuxury2.originalPrice,
        amount: amountLuxury2,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess?.id || "",
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationLuxury2.id,
        whatsappMessageTemplate: `
  Assalamu'alaikum warahmatullahi wabarakatuh,
  
  Segala puji bagi Allah SWT yang telah mempertemukan dua insan dalam ikatan suci pernikahan.
  
  Dengan penuh syukur, kami bermaksud mengabarkan kabar bahagia bahwa kami akan melangsungkan akad nikah dan walimatul 'urs dalam waktu dekat.
  
  InsyaAllah akan menikah:
  
  *{{brideName}} & {{groomName}}*  
  
  Kami mengundang Bapak/Ibu/Saudara/i *{{name}}* untuk turut hadir dan berbagi doa restu dalam momen istimewa ini. Doa dan kehadiran Anda sangat berarti bagi kami dan keluarga besar.
  
  Informasi lengkap mengenai waktu dan tempat pelaksanaan acara dapat dilihat melalui undangan digital berikut:
  
  {{invitationLink}}
  
  Semoga Allah SWT memberkahi langkah kami, dan semoga Bapak/Ibu/Saudara/i senantiasa diberi kesehatan dan kemudahan dalam segala urusan.
  
  Wassalamu'alaikum warahmatullahi wabarakatuh.  
  Hormat kami,  
  *{{brideName}} & {{groomName}}*
  `.trim(),
      },
    ],
  });

  // Create Quote
  await prisma.quote.createMany({
    data: [
      {
        name: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
        author: "QS. Ar-Rum: 21",
        invitationId: invitationLuxury2.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationLuxury2.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationLuxury2.id,
        type: "reception",
        name: "Resepsi",
        startDate: new Date("2028-07-27T05:00:00Z"),
        endDate: new Date("2028-07-27T08:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
    ],
  });

  // Create Couple
  await prisma.couple.createMany({
    data: [
      {
        invitationId: invitationLuxury2.id,
        groomName: "Andika Saputra",
        groomFather: "Hendra Syahputra",
        groomMother: "Marlina",
        groomImage: "/assets/img/andika-zahra/andika.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Salsabila Zahra",
        brideFather: "Fauzi Ramadhan",
        brideMother: "Yuliana",
        brideImage: "/assets/img/andika-zahra/zahra.jpg",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationLuxury2.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        image: "/assets/img/andika-zahra/story-pertemuan.jpg",
      },
      {
        invitationId: invitationLuxury2.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        image: "/assets/img/andika-zahra/story-lamaran.jpg",
      },
      {
        invitationId: invitationLuxury2.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        image: "/assets/img/andika-zahra/story-pernikahan.jpg",
      },
    ],
  });

  // Create Gallery
  await prisma.gallery.createMany({
    data: [
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-001.jpg",
        description: "Gallery 1",
      },
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-002.jpg",
        description: "Gallery 2",
      },
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-003.jpg",
        description: "Gallery 3",
      },
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-004.jpg",
        description: "Gallery 4",
      },
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-005.jpg",
        description: "Gallery 5",
      },
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-006.jpg",
        description: "Gallery 6",
      },
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-007.jpg",
        description: "Gallery 7",
      },
      {
        invitationId: invitationLuxury2.id,
        image: "/assets/img/andika-zahra/gallery-008.jpg",
        description: "Gallery 8",
      },
    ],
  });

  const bank1 = await prisma.bank.findFirst({
    where: {
      name: "Mandiri",
    },
  });

  const bank2 = await prisma.bank.findFirst({
    where: {
      name: "BCA",
    },
  });

  const bank3 = await prisma.bank.findFirst({
    where: {
      name: "Kado",
    },
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationLuxury2.id,
        bankId: bank1?.id || "",
        accountNumber: "2732638623612512",
        name: "Andika Saputra",
      },
      {
        invitationId: invitationLuxury2.id,
        bankId: bank2?.id || "",
        accountNumber: "8364718172726262",
        name: "Salsabila Zahra",
      },
      {
        invitationId: invitationLuxury2.id,
        bankId: bank3?.id || "",
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodeLuxury2 = await generateUniqueCode();

  const guestLuxuri2 = await prisma.guest.create({
    data: {
      code: kodeLuxury2,
      invitationId: invitationLuxury2.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationLuxury2.id,
      guestId: guestLuxuri2.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationLuxury2.id,
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
      startDate: new Date("2028-07-27T08:30:00.000Z"),
      endDate: new Date("2028-07-27T11:00:00.000Z"),
      description: "Live streaming acara akad nikah Andi & Bunga",
    },
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
