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
  const themeCategoryLuxury = await prisma.themeCategory.findFirst({
    where: {
      name: "Luxury",
    },
  });

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

  const paymentStatusSuccess = await prisma.paymentStatus.findFirst({
    where: {
      name: "SUCCESS",
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
