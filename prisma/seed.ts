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
  await prisma.themeBackground.createMany({
    data: [
      {
        image: "/assets/img/bg-theme/bg-theme-001.jpg",
        type: "001",
      },
      {
        image: "/assets/img/bg-theme/bg-theme-002.jpg",
        type: "001",
      },
      {
        image: "/assets/img/bg-theme/bg-theme-003.jpg",
        type: "001",
      },
      {
        image: "/assets/img/bg-theme/bg-theme-004.jpg",
        type: "001",
      },
    ],
  });

  await prisma.music.createMany({
    data: [
      {
        name: "Ketika Cinta Bertasbih - Melly Goeslaw Cover Cindi Cintya Dewi ( Lirik )",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1750521731/music/w0esrtsvn4caiuubjza9.mp3",
        origin: "https://www.youtube.com/watch?v=JAqxrXjodn8",
        visibility: true,
      },
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
      {
        name: "TULUS - Teman Hidup (Official Music Video)",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1753425823/music/bqpod0xrvoqvd6hypyxx.mp3",
        origin: "https://www.youtube.com/watch?v=dt4Ueda_h6Y",
        visibility: true,
      },
      {
        name: "Tiara Andini, Arsy Widianto - Lagu Pernikahan Kita (Official Music Video)",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1756575825/music/y004rvo4owfzixbgwin8.mp3",
        origin: "https://www.youtube.com/watch?v=ZeFpigRaXbI",
        visibility: true,
      },
      {
        name: "ARVIAN DWI - SATU SHAF DI BELAKANGKU (OFFICIAL LYRIC VIDEO)",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1756575933/music/knsuvoxcdwncdrpvdw2r.mp3",
        origin: "https://www.youtube.com/watch?v=ACEEIS_gCDc",
        visibility: true,
      },
      {
        name: "Nadhif Basalamah - bergema sampai selamanya (Official Music Video)",
        src: "https://res.cloudinary.com/dxtqjuvcg/video/upload/v1756576062/music/gkycphglg6q25pafpjir.mp3",
        origin: "https://www.youtube.com/watch?v=g0c7FeMn5lE",
        visibility: true,
      },
    ],
  });

  await prisma.referralConfig.create({
    data: {
      userId: "39efd6e4-0a47-4a39-b4e0-ef1f8756c4f5",
      description: "Dapatkan potongan harga langsung sebesar Rp5.000.",
      referrerReward: 5000,
      discount: 5000,
      isPercent: false,
      maxDiscount: 0,
      startDate: new Date(),
      endDate: new Date("2025-10-31T23:59:59.999Z"),
    },
  });

  const themeCategoryPremium = await prisma.themeCategory.create({
    data: {
      name: "Premium",
    },
  });

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

  const paymentStatusSuccess = await prisma.paymentStatus.create({
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

  await prisma.imageTemplate.createMany({
    data: [
      {
        type: "cover",
        image: "/assets/img/illustration/cover-luxury-001.png",
      },
      {
        type: "cover",
        image: "/assets/img/illustration/cover-premium-001.png",
      },
      {
        type: "cover",
        image: "/assets/img/illustration/cover-premium-002.png",
      },
      {
        type: "groom",
        image: "/assets/img/illustration/groom-luxury-001.png",
      },
      {
        type: "groom",
        image: "/assets/img/illustration/groom-premium-001.png",
      },
      {
        type: "groom",
        image: "/assets/img/illustration/groom-premium-002.png",
      },
      {
        type: "bride",
        image: "/assets/img/illustration/bride-luxury-001.png",
      },
      {
        type: "bride",
        image: "/assets/img/illustration/bride-premium-001.png",
      },
      {
        type: "bride",
        image: "/assets/img/illustration/bride-premium-001.png",
      },
    ],
  });

  // ============================================================
  // Premium 1
  // ============================================================

  const themePremium1 = await prisma.theme.create({
    data: {
      name: "premium 001",
      categoryId: themeCategoryPremium.id,
      thumbnail: "/assets/themes/premium-001/img/thumbnail.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "green",
    },
  });

  const musicPremium1 = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=dt4Ueda_h6Y",
    },
  });

  // Create Invitation
  const invitationPremium1 = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Rey",
      bride: "Dinda",
      slug: "premium-001",
      themeId: themePremium1.id,
      musicId: musicPremium1?.id || null,
      image: "/assets/img/rey-dinda/cover.jpg",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountPremium1 = calculateFinalPrice(
    themePremium1.originalPrice,
    themePremium1.discount,
    themePremium1.isPercent
  );
  //create Transaction
  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationPremium1.id,
        invitationSlug: invitationPremium1.slug,
        groomName: invitationPremium1.groom,
        brideName: invitationPremium1.bride,
        originalAmount: themePremium1.originalPrice,
        amount: amountPremium1,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess.id,
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationPremium1.id,
        liveStreamEnabled: true,
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
        invitationId: invitationPremium1.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationPremium1.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationPremium1.id,
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
        invitationId: invitationPremium1.id,
        groomName: "Reynaldi Aditya Wisnu Hasidi Putra Atmaja Mbayang",
        groomFather: "Achmad Benny Mbayang",
        groomMother: "Lam Baghdadi",
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/rey-dinda/rey.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Nyimas Khodijah Nasthiti Adinda",
        brideFather: "Kemas Herman",
        brideMother: "Hulwati Husna",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
        brideImage: "/assets/img/rey-dinda/dinda.jpg",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationPremium1.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        image: "/assets/img/rey-dinda/story-pertemuan.jpeg",
      },
      {
        invitationId: invitationPremium1.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        image: "/assets/img/rey-dinda/story-lamaran.jpg",
      },
      {
        invitationId: invitationPremium1.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        image: "/assets/img/rey-dinda/story-pernikahan.jpg",
      },
    ],
  });

  // Create Gallery
  await prisma.gallery.createMany({
    data: [
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-001.jpg",
        description: "Gallery 1",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-002.jpg",
        description: "Gallery 2",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-003.jpg",
        description: "Gallery 3",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-004.jpg",
        description: "Gallery 4",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-005.jpg",
        description: "Gallery 5",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-006.jpg",
        description: "Gallery 6",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-007.jpg",
        description: "Gallery 7",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-008.jpg",
        description: "Gallery 8",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-009.jpg",
        description: "Gallery 9",
      },
      {
        invitationId: invitationPremium1.id,
        image: "/assets/img/rey-dinda/gallery-010.jpg",
        description: "Gallery 10",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationPremium1.id,
        bankId: bankMandiri.id,
        accountNumber: "2732638623612512",
        name: "Nyimas Khodijah Nasthiti Adinda",
      },
      {
        invitationId: invitationPremium1.id,
        bankId: bankBCA.id,
        accountNumber: "8364718172726262",
        name: "Reynaldi Aditya Wisnu",
      },
      {
        invitationId: invitationPremium1.id,
        bankId: bankKado.id,
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodePremium1 = await generateUniqueCode();

  const guestPremium1 = await prisma.guest.create({
    data: {
      code: kodePremium1,
      invitationId: invitationPremium1.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  const commentPremium1 = await prisma.comment.create({
    data: {
      invitationId: invitationPremium1.id,
      guestId: guestPremium1.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationPremium1.id,
      parentId: commentPremium1.id,
      guestId: guestPremium1.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationPremium1.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
    },
  });

  // ============================================================
  // Premium 1 Basic
  // ============================================================

  const themeCategoryPremiumBasic = await prisma.themeCategory.create({
    data: {
      name: "Premium Tanpa Foto",
    },
  });

  const themePremium1Basic = await prisma.theme.create({
    data: {
      name: "premium 001 basic",
      categoryId: themeCategoryPremiumBasic.id,
      thumbnail: "/assets/themes/premium-001/img/thumbnail-basic.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "green",
    },
  });

  const musicPremium1Basic = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=dt4Ueda_h6Y",
    },
  });

  // Create Invitation
  const invitationPremium1Basic = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Rey",
      bride: "Dinda",
      slug: "premium-001-basic",
      themeId: themePremium1Basic.id,
      musicId: musicPremium1Basic?.id || null,
      image: "/assets/img/illustration/cover-premium-001.png",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountPremium1Basic = calculateFinalPrice(
    themePremium1Basic.originalPrice,
    themePremium1Basic.discount,
    themePremium1Basic.isPercent
  );
  //create Transaction
  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationPremium1Basic.id,
        invitationSlug: invitationPremium1Basic.slug,
        groomName: invitationPremium1Basic.groom,
        brideName: invitationPremium1Basic.bride,
        originalAmount: themePremium1Basic.originalPrice,
        amount: amountPremium1Basic,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess.id,
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationPremium1Basic.id,
        liveStreamEnabled: true,
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
        invitationId: invitationPremium1Basic.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationPremium1Basic.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationPremium1Basic.id,
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
        invitationId: invitationPremium1Basic.id,
        groomName: "Reynaldi Aditya Wisnu Hasidi Putra Atmaja Mbayang",
        groomFather: "Achmad Benny Mbayang",
        groomMother: "Lam Baghdadi",
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/illustration/groom-premium-001.png",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Nyimas Khodijah Nasthiti Adinda",
        brideFather: "Kemas Herman",
        brideMother: "Hulwati Husna",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
        brideImage: "/assets/img/illustration/bride-premium-001.png",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationPremium1Basic.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        // image: "/assets/img/rey-dinda/story-pertemuan.jpeg",
      },
      {
        invitationId: invitationPremium1Basic.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        // image: "/assets/img/rey-dinda/story-lamaran.jpg",
      },
      {
        invitationId: invitationPremium1Basic.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        // image: "/assets/img/rey-dinda/story-pernikahan.jpg",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationPremium1Basic.id,
        bankId: bankMandiri.id,
        accountNumber: "2732638623612512",
        name: "Nyimas Khodijah Nasthiti Adinda",
      },
      {
        invitationId: invitationPremium1Basic.id,
        bankId: bankBCA.id,
        accountNumber: "8364718172726262",
        name: "Reynaldi Aditya Wisnu",
      },
      {
        invitationId: invitationPremium1Basic.id,
        bankId: bankKado.id,
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodePremium1Basic = await generateUniqueCode();

  const guestPremium1Basic = await prisma.guest.create({
    data: {
      code: kodePremium1Basic,
      invitationId: invitationPremium1Basic.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  const commentPremium1Basic = await prisma.comment.create({
    data: {
      invitationId: invitationPremium1Basic.id,
      guestId: guestPremium1Basic.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationPremium1Basic.id,
      parentId: commentPremium1Basic.id,
      guestId: guestPremium1Basic.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationPremium1Basic.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
    },
  });

  // ============================================================
  // Luxury 1
  // ============================================================
  const themeCategoryLuxury = await prisma.themeCategory.create({
    data: {
      name: "Luxury",
    },
  });

  const themeLuxury1 = await prisma.theme.create({
    data: {
      name: "luxury 001",
      categoryId: themeCategoryLuxury.id,
      thumbnail: "/assets/themes/luxury-001/img/thumbnail.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "brown",
    },
  });

  const musicLuxury1 = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=ZeFpigRaXbI",
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
        liveStreamEnabled: true,
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
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/rizky-putri/rizky.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Putri Ayu Lestari",
        brideFather: "Ahmad Syafrudin",
        brideMother: "Dewi Hartati",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
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
        isCover: true,
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

  const commentLuxury1 = await prisma.comment.create({
    data: {
      invitationId: invitationLuxury1.id,
      guestId: guestLuxuri1.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationLuxury1.id,
      parentId: commentLuxury1.id,
      guestId: guestLuxuri1.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationLuxury1.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
    },
  });

  // ============================================================
  // Luxury 1 Basic
  // ============================================================

  const themeCategoryLuxuryBasic = await prisma.themeCategory.create({
    data: {
      name: "Luxury Tanpa Foto",
    },
  });

  const themeLuxury1Basic = await prisma.theme.create({
    data: {
      name: "luxury 001 basic",
      categoryId: themeCategoryLuxuryBasic.id,
      thumbnail: "/assets/themes/luxury-001/img/thumbnail-basic.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "brown",
    },
  });

  const musicLuxury1Basic = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=ZeFpigRaXbI",
    },
  });

  // Create Invitation
  const invitationLuxury1Basic = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Rizky",
      bride: "Putri",
      slug: "luxury-001-basic",
      themeId: themeLuxury1Basic.id,
      musicId: musicLuxury1Basic?.id || null,
      image: "/assets/img/illustration/cover-luxury-001.png",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountLuxury1Basic = calculateFinalPrice(
    themeLuxury1Basic.originalPrice,
    themeLuxury1Basic.discount,
    themeLuxury1Basic.isPercent
  );

  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationLuxury1Basic.id,
        invitationSlug: invitationLuxury1Basic.slug,
        groomName: invitationLuxury1Basic.groom,
        brideName: invitationLuxury1Basic.bride,
        originalAmount: themeLuxury1Basic.originalPrice,
        amount: amountLuxury1Basic,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess?.id || "",
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationLuxury1Basic.id,
        liveStreamEnabled: true,
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
        invitationId: invitationLuxury1Basic.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationLuxury1Basic.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationLuxury1Basic.id,
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
        invitationId: invitationLuxury1Basic.id,
        groomName: "Rizky Pratama",
        groomFather: "Bambang Supriyanto",
        groomMother: "Siti Aminah",
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/illustration/groom-luxury-001.png",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Putri Ayu Lestari",
        brideFather: "Ahmad Syafrudin",
        brideMother: "Dewi Hartati",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
        brideImage: "/assets/img/illustration/bride-luxury-001.png",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationLuxury1Basic.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        // image: "/assets/img/rizky-putri/story-pertemuan.jpg",
      },
      {
        invitationId: invitationLuxury1Basic.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        // image: "/assets/img/rizky-putri/story-lamaran.jpg",
      },
      {
        invitationId: invitationLuxury1Basic.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        // image: "/assets/img/rizky-putri/story-pernikahan.jpg",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationLuxury1Basic.id,
        bankId: bankMandiri?.id || "",
        accountNumber: "2732638623612512",
        name: "Rizky Pratama",
      },
      {
        invitationId: invitationLuxury1Basic.id,
        bankId: bankBCA?.id || "",
        accountNumber: "8364718172726262",
        name: "Putri Ayu Lestari",
      },
      {
        invitationId: invitationLuxury1Basic.id,
        bankId: bankKado?.id || "",
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodeLuxury1Basic = await generateUniqueCode();

  const guestLuxuri1Basic = await prisma.guest.create({
    data: {
      code: kodeLuxury1Basic,
      invitationId: invitationLuxury1Basic.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  const commentLuxury1Basic = await prisma.comment.create({
    data: {
      invitationId: invitationLuxury1Basic.id,
      guestId: guestLuxuri1Basic.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationLuxury1Basic.id,
      parentId: commentLuxury1Basic.id,
      guestId: guestLuxuri1Basic.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationLuxury1Basic.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
    },
  });

  // ============================================================
  // Luxury 2
  // ============================================================
  const themeLuxury2 = await prisma.theme.create({
    data: {
      name: "luxury 002",
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
      origin: "https://www.youtube.com/watch?v=ACEEIS_gCDc",
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
        liveStreamEnabled: true,
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
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/andika-zahra/andika.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Salsabila Zahra",
        brideFather: "Fauzi Ramadhan",
        brideMother: "Yuliana",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
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
        isCover: true,
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

  const commentLuxury2 = await prisma.comment.create({
    data: {
      invitationId: invitationLuxury2.id,
      guestId: guestLuxuri2.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationLuxury2.id,
      parentId: commentLuxury2.id,
      guestId: guestLuxuri2.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationLuxury2.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
    },
  });

  // ============================================================
  // Luxury 2 Basic
  // ============================================================
  const themeLuxury2Basic = await prisma.theme.create({
    data: {
      name: "luxury 002 basic",
      categoryId: themeCategoryLuxuryBasic?.id || "",
      thumbnail: "/assets/themes/luxury-002/img/thumbnail-basic.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "gold",
    },
  });

  const musicLuxury2Basic = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=ACEEIS_gCDc",
    },
  });

  // Create Invitation
  const invitationLuxury2Basic = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Andika",
      bride: "Zahra",
      slug: "luxury-002-basic",
      themeId: themeLuxury2Basic.id,
      musicId: musicLuxury2Basic?.id || null,
      image: "/assets/img/illustration/cover-luxury-002.png",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountLuxury2Basic = calculateFinalPrice(
    themeLuxury2Basic.originalPrice,
    themeLuxury2Basic.discount,
    themeLuxury2Basic.isPercent
  );

  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationLuxury2Basic.id,
        invitationSlug: invitationLuxury2Basic.slug,
        groomName: invitationLuxury2Basic.groom,
        brideName: invitationLuxury2Basic.bride,
        originalAmount: themeLuxury2Basic.originalPrice,
        amount: amountLuxury2Basic,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess?.id || "",
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationLuxury2Basic.id,
        liveStreamEnabled: true,
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
        invitationId: invitationLuxury2Basic.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationLuxury2Basic.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationLuxury2Basic.id,
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
        invitationId: invitationLuxury2Basic.id,
        groomName: "Andika Saputra",
        groomFather: "Hendra Syahputra",
        groomMother: "Marlina",
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/illustration/groom-luxury-002.png",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Salsabila Zahra",
        brideFather: "Fauzi Ramadhan",
        brideMother: "Yuliana",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
        brideImage: "/assets/img/illustration/bride-luxury-002.png",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationLuxury2Basic.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        // image: "/assets/img/andika-zahra/story-pertemuan.jpg",
      },
      {
        invitationId: invitationLuxury2Basic.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        // image: "/assets/img/andika-zahra/story-lamaran.jpg",
      },
      {
        invitationId: invitationLuxury2Basic.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        // image: "/assets/img/andika-zahra/story-pernikahan.jpg",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationLuxury2Basic.id,
        bankId: bank1?.id || "",
        accountNumber: "2732638623612512",
        name: "Andika Saputra",
      },
      {
        invitationId: invitationLuxury2Basic.id,
        bankId: bank2?.id || "",
        accountNumber: "8364718172726262",
        name: "Salsabila Zahra",
      },
      {
        invitationId: invitationLuxury2Basic.id,
        bankId: bank3?.id || "",
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodeLuxury2Basic = await generateUniqueCode();

  const guestLuxuri2Basic = await prisma.guest.create({
    data: {
      code: kodeLuxury2Basic,
      invitationId: invitationLuxury2Basic.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  const commentLuxury2Basic = await prisma.comment.create({
    data: {
      invitationId: invitationLuxury2Basic.id,
      guestId: guestLuxuri2Basic.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationLuxury2Basic.id,
      parentId: commentLuxury2Basic.id,
      guestId: guestLuxuri2Basic.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationLuxury2Basic.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
    },
  });

  // ============================================================
  // Premium 2
  // ============================================================
  const themePremium2 = await prisma.theme.create({
    data: {
      name: "premium 002",
      categoryId: themeCategoryPremium?.id || "",
      thumbnail: "/assets/themes/premium-002/img/thumbnail.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "blue",
    },
  });

  const musicPremium2 = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=g0c7FeMn5lE",
    },
  });

  const invitationPremium2 = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Aditya",
      bride: "Nabila",
      slug: "premium-002",
      themeId: themePremium2.id,
      musicId: musicPremium2?.id || null,
      image: "/assets/img/aditya-nabila/cover.jpg",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountPremium2 = calculateFinalPrice(
    themePremium2.originalPrice,
    themePremium2.discount,
    themePremium2.isPercent
  );

  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationPremium2.id,
        invitationSlug: invitationPremium2.slug,
        groomName: invitationPremium2.groom,
        brideName: invitationPremium2.bride,
        originalAmount: themePremium2.originalPrice,
        amount: amountPremium2,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess?.id || "",
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationPremium2.id,
        liveStreamEnabled: true,
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
        invitationId: invitationPremium2.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationPremium2.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationPremium2.id,
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
        invitationId: invitationPremium2.id,
        groomName: "Rizky Aditya Pratama",
        groomFather: "Hendri Pratama",
        groomMother: "Siti Marlina",
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/aditya-nabila/aditya.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Nabila Shafira Rahmawati",
        brideFather: "Budi Santoso",
        brideMother: "Dewi Lestari",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
        brideImage: "/assets/img/aditya-nabila/nabila.jpg",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationPremium2.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        image: "/assets/img/aditya-nabila/story-pertemuan.jpg",
      },
      {
        invitationId: invitationPremium2.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        image: "/assets/img/aditya-nabila/story-lamaran.jpg",
      },
      {
        invitationId: invitationPremium2.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        image: "/assets/img/aditya-nabila/story-pernikahan.jpg",
      },
    ],
  });

  // Create Gallery
  await prisma.gallery.createMany({
    data: [
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-001.jpg",
        description: "Gallery 1",
      },
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-002.jpg",
        description: "Gallery 2",
      },
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-003.jpg",
        description: "Gallery 3",
      },
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-004.jpg",
        description: "Gallery 4",
      },
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-005.jpg",
        description: "Gallery 5",
      },
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-006.jpg",
        description: "Gallery 6",
      },
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-007.jpg",
        description: "Gallery 7",
      },
      {
        invitationId: invitationPremium2.id,
        image: "/assets/img/aditya-nabila/gallery-008.jpg",
        description: "Gallery 8",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationPremium2.id,
        bankId: bank1?.id || "",
        accountNumber: "2732638623612512",
        name: "Andika Saputra",
      },
      {
        invitationId: invitationPremium2.id,
        bankId: bank2?.id || "",
        accountNumber: "8364718172726262",
        name: "Salsabila Zahra",
      },
      {
        invitationId: invitationPremium2.id,
        bankId: bank3?.id || "",
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodePremium2 = await generateUniqueCode();

  const guestPremium2 = await prisma.guest.create({
    data: {
      code: kodePremium2,
      invitationId: invitationPremium2.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  const commentPremium2 = await prisma.comment.create({
    data: {
      invitationId: invitationPremium2.id,
      guestId: guestPremium2.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationPremium2.id,
      parentId: commentPremium2.id,
      guestId: guestPremium2.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationPremium2.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
    },
  });

  // ============================================================
  // Premium 2 Basic
  // ============================================================

  const themePremium2Basic = await prisma.theme.create({
    data: {
      name: "premium 002 basic",
      categoryId: themeCategoryPremiumBasic?.id || "",
      thumbnail: "/assets/themes/premium-002/img/thumbnail-basic.png",
      originalPrice: 100000,
      discount: 25000,
      isPercent: false,
      colorTag: "blue",
    },
  });

  const musicPremium2Basic = await prisma.music.findFirst({
    where: {
      origin: "https://www.youtube.com/watch?v=g0c7FeMn5lE",
    },
  });

  const invitationPremium2Basic = await prisma.invitation.create({
    data: {
      userId: "user_30JNC1ArV5rsaCSXTv3dncovRuN",
      groom: "Aditya",
      bride: "Nabila",
      slug: "premium-002-basic",
      themeId: themePremium2Basic.id,
      musicId: musicPremium2Basic?.id || null,
      image: "/assets/img/illustration/cover-premium-002.png",
      date: new Date("2028-07-27T00:00:00Z"),
      isTemplate: true,
      expiresAt: new Date("2030-12-31T00:00:00Z"),
    },
  });

  const amountPremium2Basic = calculateFinalPrice(
    themePremium2Basic.originalPrice,
    themePremium2Basic.discount,
    themePremium2Basic.isPercent
  );

  await prisma.transaction.createMany({
    data: [
      {
        orderId: randomUUID(),
        invitationId: invitationPremium2Basic.id,
        invitationSlug: invitationPremium2Basic.slug,
        groomName: invitationPremium2Basic.groom,
        brideName: invitationPremium2Basic.bride,
        originalAmount: themePremium2Basic.originalPrice,
        amount: amountPremium2Basic,
        date: new Date("2025-01-01T12:00:00Z"),
        statusId: paymentStatusSuccess?.id || "",
      },
    ],
  });

  // Create Setting
  await prisma.setting.createMany({
    data: [
      {
        invitationId: invitationPremium2Basic.id,
        liveStreamEnabled: true,
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
        invitationId: invitationPremium2Basic.id,
      },
    ],
  });

  // Create Schedule
  await prisma.schedule.createMany({
    data: [
      {
        invitationId: invitationPremium2Basic.id,
        type: "marriage",
        name: "Akad Nikah",
        startDate: new Date("2028-07-27T02:00:00Z"),
        endDate: new Date("2028-07-27T05:00:00Z"),
        location: "Villa Azila, Cipayung, Jakarta Timur",
        locationMaps: "https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6",
        timezone: "WIB",
      },
      {
        invitationId: invitationPremium2Basic.id,
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
        invitationId: invitationPremium2Basic.id,
        groomName: "Rizky Aditya Pratama",
        groomFather: "Hendri Pratama",
        groomMother: "Siti Marlina",
        groomAddress:
          "Jl. Melati No. 25, Sukamaju, Cibinong, Bogor, Jawa Barat",
        groomImage: "/assets/img/illustration/groom-premium-002.png",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Nabila Shafira Rahmawati",
        brideFather: "Budi Santoso",
        brideMother: "Dewi Lestari",
        brideAddress:
          "Jl. Kenanga Raya Blok B-12, Sukahati, Cibinong, Bogor, Jawa Barat",
        brideImage: "/assets/img/illustration/bride-premium-002.png",
        brideInstagram: "https://www.instagram.com/",
      },
    ],
  });

  // Create Story
  await prisma.story.createMany({
    data: [
      {
        invitationId: invitationPremium2Basic.id,
        title: "Pertemuan",
        date: new Date("2020-01-01T00:00:00Z"),
        description:
          "Semua berawal dari sebuah pertemuan sederhana. Kami dipertemukan dalam satu kegiatan di komunitas, tanpa pernah menyangka bahwa pertemuan itu akan menjadi awal dari kisah yang lebih indah. Dari obrolan ringan, tumbuh rasa nyaman. Dari pertemanan yang tulus, perlahan hadir rasa yang lebih mendalam.",
        // image: "/assets/img/andika-zahra/story-pertemuan.jpg",
      },
      {
        invitationId: invitationPremium2Basic.id,
        title: "Lamaran",
        date: new Date("2025-05-25T00:00:00Z"),
        description:
          "Hingga akhirnya, pada 25 April 2025, ia menyatakan niat tulus untuk membawa hubungan ini ke jenjang yang lebih serius. Dengan restu keluarga dan niat yang mantap, kami bertunangan dan mulai mempersiapkan langkah besar berikutnya.",
        // image: "/assets/img/andika-zahra/story-lamaran.jpg",
      },
      {
        invitationId: invitationPremium2Basic.id,
        title: "Pernikahan",
        date: new Date("2028-07-27T00:00:00Z"),
        description:
          "Dan kini, dengan penuh rasa syukur, kami mengundang keluarga dan sahabat terkasih untuk menjadi bagian dari hari bahagia kami, sebuah momen sakral di mana kami mengikat janji suci untuk sehidup semati.",
        // image: "/assets/img/andika-zahra/story-pernikahan.jpg",
      },
    ],
  });

  // Create BankAccounts
  await prisma.bankAccount.createMany({
    data: [
      {
        invitationId: invitationPremium2Basic.id,
        bankId: bank1?.id || "",
        accountNumber: "2732638623612512",
        name: "Andika Saputra",
      },
      {
        invitationId: invitationPremium2Basic.id,
        bankId: bank2?.id || "",
        accountNumber: "8364718172726262",
        name: "Salsabila Zahra",
      },
      {
        invitationId: invitationPremium2Basic.id,
        bankId: bank3?.id || "",
        accountNumber: "XXXXX",
        name: "Villa Azila, Cipayung, Jakarta Timur",
      },
    ],
  });

  const kodePremium2Basic = await generateUniqueCode();

  const guestPremium2Basic = await prisma.guest.create({
    data: {
      code: kodePremium2Basic,
      invitationId: invitationPremium2Basic.id,
      name: "tamu",
      address: "Magelang",
      isAttending: false,
      color: "bg-teal-500",
    },
  });

  const commentPremium2Basic = await prisma.comment.create({
    data: {
      invitationId: invitationPremium2Basic.id,
      guestId: guestPremium2Basic.id,
      message:
        "Semoga Allah SWT menjadikan kalian pasangan yang saling mencintai, saling mendukung, dan saling mengingatkan dalam kebaikan.",
    },
  });

  await prisma.comment.create({
    data: {
      invitationId: invitationPremium2Basic.id,
      parentId: commentPremium2Basic.id,
      guestId: guestPremium2Basic.id,
      message:
        "Terima kasih atas ucapannya yang indah, semoga kebaikan dan kebahagiaan juga selalu bersama kamu.",
    },
  });

  await prisma.liveStream.create({
    data: {
      invitationId: invitationPremium2Basic.id,
      startDate: new Date("2028-07-27T02:00:00Z"),
      endDate: new Date("2028-07-27T08:00:00Z"),
      urlYoutube: "https://youtube.com/",
      urlInstagram: "https://instagram.com/",
      urlTiktok: "https://tiktok.com/",
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
