import { drizzle } from "drizzle-orm/better-sqlite3";
import { users } from "../src/schemas/db/users";
import { hashSync } from "bcryptjs";
import { nanoid } from "nanoid";

// Arabic poetic text about users themselves
const arabicAboutTexts = [
  "أحب القراءة والكتابة، وأؤمن بأن الكلمات تبني الجسور بين القلوب",
  "باحث عن الحقيقة في عالم مليء بالضجيج، أجد السلام في التأمل والصمت",
  "عاشق للحرية والفكر، أومن بأن المستقبل يُصنع بالعلم والمحبة",
  "أكتب ما يخطر في بالي، وأشارك أفكاري مع العالم بحب وسلام",
  "أحلم بمستقبل أفضل للجميع، حيث ينتصر الحب على الكراهية",
  "مبرمج بالنهار، شاعر بالليل، أجد الجمال في التفاصيل الصغيرة",
  "أؤمن بقوة الكلمة وتأثيرها في تغيير العالم نحو الأفضل",
  "باحث عن المعنى في زمن السرعة، أحب الحوار العميق والأفكار الجديدة",
  "الحب والسلام هما طريقي في هذه الحياة المليئة بالتحديات",
  "أكتب لأفهم نفسي والعالم من حولي، وأشارك تجاربي مع الآخرين",
  "عاشق للغة العربية وجمالها، أحاول أن أساهم في إثراء المحتوى العربي",
  "أؤمن بأن المستقبل للشباب الذين يحملون الأمل في قلوبهم",
  "أحب التكنولوجيا والإنسانية معاً، وأسعى للتوازن بينهما",
  "السلام الداخلي هو بداية كل تغيير إيجابي في العالم",
  "أكتب عن الحب والأمل والسلام، لأنها القيم التي نحتاجها اليوم",
];

// More Arabic about texts for variety
const moreAboutTexts = [
  "قارئ نهم، أحب استكشاف الأفكار الجديدة والثقافات المختلفة",
  "مؤمن بالتغيير الإيجابي والعمل الجماعي لبناء مستقبل أفضل",
  "أحب الموسيقى والفن والأدب، وأجد فيها ملاذاً من صخب الحياة",
  "أسعى لنشر الوعي والمعرفة في مجتمعي بكل حب وإخلاص",
  "أؤمن بأن الحوار الحضاري هو الطريق للسلام والتفاهم بين الشعوب",
  "باحث في علوم الحاسوب، عاشق للفلسفة والأدب والشعر",
  "أحب السفر واكتشاف العالم، وتعلم من تجارب الآخرين",
  "أكتب لأترك أثراً إيجابياً في هذا العالم، ولو كان صغيراً",
  "مهتم بالقضايا الإنسانية والعدالة الاجتماعية والبيئة",
  "أؤمن بقوة التعليم في تحرير العقول وبناء المستقبل",
  "أحب الطبيعة والهدوء، وأجد الإلهام في جمال الكون",
  "أسعى لفهم الحياة من خلال القراءة والتأمل والحوار",
  "أؤمن بأن الفن والإبداع هما لغة عالمية تجمع البشر",
  "أحب مشاركة المعرفة ومساعدة الآخرين على النمو والتطور",
  "باحث عن التوازن بين العقل والقلب، بين العلم والروح",
  "أكتب لأعبر عن نفسي وأتواصل مع من يشاركونني نفس القيم",
  "مؤمن بأن الحب هو القوة الأعظم في هذا الكون",
  "أحب الضحك والحياة، وأسعى لنشر الإيجابية في كل مكان",
  "أؤمن بأن كل إنسان يحمل نوراً بداخله، وعلينا مساعدته ليشع",
  "أكتب عن الأمل حتى في أحلك الأوقات، لأن الأمل لا يموت",
];

const allAboutTexts = [...arabicAboutTexts, ...moreAboutTexts];

// Generate valid usernames following the rules
const generateUsername = (index: number): string => {
  const prefixes = [
    "ahmad", "sara", "omar", "layla", "ali", "fatima", "khalid", "nour",
    "hassan", "amira", "youssef", "mona", "tariq", "dina", "walid", "huda",
    "sameer", "rania", "faisal", "salma", "karim", "maya", "rashid", "lina",
    "adel", "hana", "majid", "yasmin", "saad", "leila", "nader", "zaina",
    "fahad", "nadia", "basel", "rim", "malik", "sana", "ziad", "luna",
    "rami", "mariam", "jamal", "noura", "fares", "hiba", "munir", "amal",
    "talal", "reem",
  ];

  const suffixes = ["", "_dev", "_writer", "_tech", "_poet", "_reader",
                    "_thinker", "_dreamer", "_coder", "_mind"];

  // Use prefix from array or generate a simple one
  const prefix = prefixes[index % prefixes.length];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = Math.random() > 0.7 ? Math.floor(Math.random() * 999) : "";

  const username = `${prefix}${suffix}${number}`;

  // Ensure it meets validation: 2-15 chars, starts with letter, lowercase alphanumeric + underscore
  if (username.length > 15) {
    return prefix + (number || "");
  }

  return username;
};

export async function seedUsers(db: ReturnType<typeof drizzle>) {
  console.log("🌱 Seeding users...");

  const userCount = 50;
  const usersData = [];

  for (let i = 0; i < userCount; i++) {
    const username = generateUsername(i);

    // Generate a valid password and hash it
    const password = hashSync("Password123", 10); // Valid: 8+ chars, uppercase, lowercase, number

    // Optional email (70% of users have email)
    const hasEmail = Math.random() > 0.3;
    const email = hasEmail ? `${username}@example.com` : null;

    // Optional about (80% of users have about)
    const hasAbout = Math.random() > 0.2;
    const about = hasAbout
      ? allAboutTexts[Math.floor(Math.random() * allAboutTexts.length)]
      : null;

    // Random dates in the past year
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    usersData.push({
      id: nanoid(),
      username,
      email,
      password,
      about,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  await db.insert(users).values(usersData);

  console.log(`✅ Created ${userCount} users`);
  return usersData;
}

