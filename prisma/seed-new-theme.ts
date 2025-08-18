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
      colorTag: "green",
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

  const amountPremium = calculateFinalPrice(
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
        amount: amountPremium,
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
        groomImage: "/assets/img/rizky-putri/rey.jpg",
        groomInstagram: "https://www.instagram.com/",
        brideName: "Putri Ayu Lestari",
        brideFather: "Ahmad Syafrudin",
        brideMother: "Dewi Hartati",
        brideImage: "/assets/img/rizky-putri/dinda.jpg",
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
        image: "/assets/img/rizky-putri/story-pertemuan.jpeg",
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
        invitationId: invitationLuxury1.id,
        bankId: bank1?.id || "",
        accountNumber: "2732638623612512",
        name: "Nyimas Khodijah Nasthiti Adinda",
      },
      {
        invitationId: invitationLuxury1.id,
        bankId: bank2?.id || "",
        accountNumber: "8364718172726262",
        name: "Reynaldi Aditya Wisnu",
      },
      {
        invitationId: invitationLuxury1.id,
        bankId: bank3?.id || "",
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
