import { drizzle } from "drizzle-orm/better-sqlite3";
import { comments } from "../src/schemas/db/comments";
import { createId } from "@paralleldrive/cuid2";

type CommentData = {
  id: string;
  postId: string;
  parentId: string | null;
  userId: string;
  text: string;
  votes: number;
  reportCount: number;
  flagged: boolean;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
};

// Arabic poetic comments about love, future, and peace
const poeticComments = [
  "كلام جميل يلامس القلب، الحب فعلاً هو القوة الأعظم في هذا الكون.",
  "أحسنت، المستقبل يبدأ من هنا والآن، من أفعالنا الصغيرة اليومية.",
  "السلام يبدأ من داخلنا، شكراً على هذا التذكير المهم.",
  "كلماتك تبعث الأمل في النفس، نحتاج المزيد من هذه الرسائل الإيجابية.",
  "موضوع رائع ومهم، الحب والسلام هما ما يحتاجه عالمنا اليوم.",
  "أتفق معك تماماً، المستقبل بأيدينا وعلينا أن نصنعه بالحب.",
  "شكراً على المشاركة، هذا ما نحتاج سماعه في هذه الأيام.",
  "كلام من القلب، يصل مباشرة إلى القلب. بارك الله فيك.",
  "السلام عليك، موضوع يستحق النقاش والتأمل.",
  "أحببت هذه الكلمات، تذكرني بأهمية الحب في حياتنا.",
  "المستقبل واعد إذا آمنا بقدرتنا على التغيير، شكراً لك.",
  "السلام طريق طويل لكنه يستحق كل خطوة، معك في هذا.",
  "الحب يصنع المعجزات، هذا صحيح ونراه كل يوم.",
  "كلمات ملهمة، أتمنى أن يقرأها الكثيرون ويتأثروا بها.",
  "المستقبل للمتفائلين والحالمين، لنواصل الحلم والعمل.",
];

// More poetic comments
const moreComments = [
  "موضوع عميق ومؤثر، شكراً على مشاركته معنا.",
  "الحب هو الجواب دائماً، في كل الأوقات والظروف.",
  "أتمنى أن نرى المزيد من هذه المواضيع الإيجابية.",
  "السلام مسؤولية كل فرد منا، لنبدأ من أنفسنا.",
  "كلام جميل يبعث الطمأنينة في النفس، شكراً لك.",
  "المستقبل أجمل عندما نبنيه معاً بالحب والتعاون.",
  "أحسنت القول، الحب يجمعنا ويقوينا.",
  "السلام يحتاج إلى صبر وحكمة، وأنت عبرت عن ذلك بشكل جميل.",
  "موضوع يستحق التأمل والمناقشة، شكراً لطرحه.",
  "الحب والسلام ليسا رفاهية بل ضرورة للحياة.",
  "كلماتك تلهمني لأكون شخصاً أفضل، شكراً.",
  "المستقبل يحمل الكثير من الأمل إذا عملنا بإخلاص.",
  "السلام يبدأ بالاحترام والتفاهم، هذا صحيح.",
  "الحب قوة تحويلية، نحتاج أن نتذكر هذا دائماً.",
  "موضوع رائع، يستحق أن يصل لأكبر عدد من الناس.",
  "أتفق معك في كل كلمة، الحب هو الطريق.",
  "السلام ليس حلماً بعيداً، بل هدف يمكن تحقيقه.",
  "المستقبل للذين يحبون ويحلمون ويعملون.",
  "كلمات صادقة تخرج من القلب، بارك الله فيك.",
  "الحب يملأ حياتنا بالمعنى والسعادة، شكراً على التذكير.",
];

// Short reply comments for nested replies
const shortReplies = [
  "أحسنت، أتفق معك تماماً.",
  "كلام جميل، شكراً لك.",
  "نعم، هذا صحيح فعلاً.",
  "أتفق معك في هذا.",
  "موضوع مهم، شكراً على الإضافة.",
  "كلماتك ملهمة، بارك الله فيك.",
  "صدقت، الحب هو الحل.",
  "السلام عليك، كلام من ذهب.",
  "أحببت هذا التعليق، شكراً.",
  "تماماً، هذا ما أعتقده أيضاً.",
  "أحسنت القول، معك في هذا.",
  "شكراً لك على هذا التوضيح.",
  "كلام منطقي ومؤثر.",
  "أتفق معك بشدة في هذا الرأي.",
  "نعم، المستقبل بأيدينا.",
  "السلام يبدأ من هنا.",
  "الحب هو الجواب دائماً.",
  "موضوع يستحق النقاش.",
  "شكراً على المشاركة القيمة.",
  "كلمات تبعث الأمل.",
];

const allComments = [...poeticComments, ...moreComments];

export async function seedComments(
  db: ReturnType<typeof drizzle>,
  postIds: string[],
  userIds: string[]
) {
  console.log("🌱 Seeding comments...");
  
  const commentCount = 500;
  const commentsData: CommentData[] = [];
  const createdCommentIds: string[] = [];
  
  // First, create top-level comments (70% of total)
  const topLevelCount = Math.floor(commentCount * 0.7);
  
  for (let i = 0; i < topLevelCount; i++) {
    const commentId = createId();
    const postId = postIds[Math.floor(Math.random() * postIds.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const text = allComments[Math.floor(Math.random() * allComments.length)];
    
    // Random votes (realistic distribution)
    let votes = 0;
    const rand = Math.random();
    if (rand < 0.6) {
      votes = Math.floor(Math.random() * 3); // 60% have 0-2 votes
    } else if (rand < 0.85) {
      votes = Math.floor(Math.random() * 10) + 3; // 25% have 3-12 votes
    } else if (rand < 0.97) {
      votes = Math.floor(Math.random() * 20) + 13; // 12% have 13-32 votes
    } else {
      votes = Math.floor(Math.random() * 50) + 33; // 3% have 33-82 votes
    }
    
    // Random dates (should be after post creation, but for simplicity we'll use recent dates)
    const hoursAgo = Math.floor(Math.random() * 24 * 180); // Within last 180 days
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    
    commentsData.push({
      id: commentId,
      postId,
      parentId: null, // Top-level comment
      userId,
      text,
      votes,
      reportCount: 0,
      flagged: false,
      hidden: false,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
    
    createdCommentIds.push(commentId);
  }
  
  // Now create nested comments (30% of total)
  const nestedCount = commentCount - topLevelCount;
  
  for (let i = 0; i < nestedCount; i++) {
    const commentId = createId();
    
    // Pick a random parent comment
    const parentCommentIndex = Math.floor(Math.random() * commentsData.length);
    const selectedParent = commentsData[parentCommentIndex];
    if (!selectedParent) continue;
    
    const { postId, id: parentId, createdAt: parentCreatedAtStr } = selectedParent;
    
    const userId = userIds[Math.floor(Math.random() * userIds.length)]!;
    
    // Use shorter replies for nested comments
    const useShortReply = Math.random() < 0.6;
    const text = useShortReply
      ? shortReplies[Math.floor(Math.random() * shortReplies.length)]
      : allComments[Math.floor(Math.random() * allComments.length)];
    
    // Nested comments typically have fewer votes
    let votes = 0;
    const rand = Math.random();
    if (rand < 0.7) {
      votes = Math.floor(Math.random() * 2); // 70% have 0-1 votes
    } else if (rand < 0.9) {
      votes = Math.floor(Math.random() * 5) + 2; // 20% have 2-6 votes
    } else {
      votes = Math.floor(Math.random() * 15) + 7; // 10% have 7-21 votes
    }
    
    // Nested comments should be created after parent comment
    const parentCreatedAt = new Date(parentCreatedAtStr);
    const hoursAfterParent = Math.floor(Math.random() * 24 * 7); // Within 7 days after parent
    const createdAt = new Date(parentCreatedAt);
    createdAt.setHours(createdAt.getHours() + hoursAfterParent);
    
    // Make sure it's not in the future
    if (createdAt > new Date()) {
      createdAt.setTime(new Date().getTime() - Math.random() * 24 * 60 * 60 * 1000);
    }
    
    commentsData.push({
      id: commentId,
      postId,
      parentId,
      userId,
      text,
      votes,
      reportCount: 0,
      flagged: false,
      hidden: false,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }
  
  await db.insert(comments).values(commentsData);
  
  console.log(`✅ Created ${commentCount} comments (${topLevelCount} top-level, ${nestedCount} nested replies)`);
  return commentsData;
}

