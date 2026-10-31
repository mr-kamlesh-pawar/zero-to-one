export interface StatItem {
  highlight: string;
  text: string;
}

export interface FeatureItem {
  icon: string;
  label: string;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  type: "lecture" | "simulator" | "quiz" | "case_study";
  duration: string;
  isUnlocked?: boolean;
}

export interface SyllabusSection {
  id: string;
  number: string;
  title: string;
  topicsCount: number;
  totalDuration: string;
  topics: SyllabusTopic[];
}

export interface CourseData {
  title: string;
  subtitle: string;
  price: {
    amount: number;
    currency: string;
    symbol: string;
    originalAmount: number;
    period: string;
    discountPercent: number;
  };
  udemy: {
    platform: string;
    rating: string;
    ratingsCount: string;
    url: string;
  };
  hero: {
    eyebrow: string;
    titleZero: string;
    titleTo: string;
    titleOne: string;
    tagline: string;
    description: string;
    stats: StatItem[];
    rating: {
      stars: string;
      value: string;
      detailLine1: string;
      detailLine2: string;
    };
    cta: {
      primary: {
        label: string;
        href: string;
      };
      secondary: {
        label: string;
        href: string;
      };
    };
  };
  author: {
    role: string;
    name: string;
    title: string;
    avatar: string;
    tags: string[];
    experience: string;
    students: string;
  };
  features: FeatureItem[];
  syllabus: {
    openedTopics: number;
    totalTopics: number;
    sections: SyllabusSection[];
  };
  footer: {
    copyrightYear: number;
    labHref: string;
    authorName: string;
  };
}

export const courseData: CourseData = {
  title: "Zero to One",
  subtitle: "Digital Electronics · Gates to FPGAs",
  price: {
    amount: 499,
    currency: "INR",
    symbol: "₹",
    originalAmount: 2499,
    period: "month",
    discountPercent: 80,
  },
  udemy: {
    platform: "Udemy",
    rating: "4.8",
    ratingsCount: "60+ Ratings",
    url: "https://www.udemy.com/course/hands-on-digital-electronics-laying-the-path-to-vlsi/",
  },
  hero: {
    eyebrow: "Interactive Lab by Dr. Sagar Joshi",
    titleZero: "Zero",
    titleTo: "to",
    titleOne: "One",
    tagline: "Digital System Design, from Gates to FPGAs",
    description:
      "Master Boolean algebra, Karnaugh maps, FSMs, flip-flops, counters & IC families — through interactive simulators and solved examples that build a rock-solid path to FPGAs and VLSI.",
    stats: [
      { highlight: "15+", text: "Yrs Experience" },
      { highlight: "Gold", text: "Medalist M.E." },
      { highlight: "1", text: "Authored Book" },
      { highlight: "Ph.D.", text: "Researcher" },
    ],
    rating: {
      stars: "★★★★★",
      value: "4.8",
      detailLine1: "60+ Student Ratings",
      detailLine2: "on Udemy",
    },
    cta: {
      primary: {
        label: "Enter Lab",
        href: "/subscription",
      },
      secondary: {
        label: "View on Udemy ↗",
        href: "https://www.udemy.com/course/hands-on-digital-electronics-laying-the-path-to-vlsi/",
      },
    },
  },
  author: {
    role: "Course Author & Publisher",
    name: "Dr. Sagar Joshi",
    title: "Digital Circuits Expert · Researcher · International Publication Reviewer",
    avatar: "/images/author.jpg",
    tags: ["Ph.D.", "Gold Medalist M.E.", "VLSI", "FPGA", "Digital Electronics"],
    experience: "15+ Years Academic & Industry",
    students: "1,200+ Engineers Trained",
  },
  features: [
    { icon: "🗺", label: "K-Map Solver" },
    { icon: "⚙", label: "FSM Simulator" },
    { icon: "🔬", label: "Gate Circuits" },
    { icon: "📋", label: "Quizzes" },
    { icon: "🔢", label: "Counter Design" },
    { icon: "🎓", label: "Exam Examples" },
  ],
  syllabus: {
    openedTopics: 9,
    totalTopics: 32,
    sections: [
      {
        id: "sec-1",
        number: "I",
        title: "Combinational",
        topicsCount: 8,
        totalDuration: "3h 45m",
        topics: [
          { id: "1-1", title: "Standard forms & K-maps", type: "simulator", duration: "32m", isUnlocked: true },
          { id: "1-2", title: "Design examples", type: "lecture", duration: "25m", isUnlocked: true },
          { id: "1-3", title: "Adder used as subtractor", type: "simulator", duration: "28m", isUnlocked: true },
          { id: "1-4", title: "Multiplexers", type: "lecture", duration: "35m", isUnlocked: true },
          { id: "1-5", title: "Demultiplexers & decoders", type: "simulator", duration: "30m", isUnlocked: true },
          { id: "1-6", title: "ALU & case studies", type: "case_study", duration: "40m", isUnlocked: true },
          { id: "1-7", title: "Solved examples", type: "lecture", duration: "20m", isUnlocked: true },
          { id: "1-8", title: "Quick quiz", type: "quiz", duration: "15m", isUnlocked: true },
        ],
      },
      {
        id: "sec-2",
        number: "II",
        title: "Sequential",
        topicsCount: 10,
        totalDuration: "4h 15m",
        topics: [
          { id: "2-1", title: "1-bit memory: latches", type: "lecture", duration: "22m", isUnlocked: true },
          { id: "2-2", title: "Flip-flops", type: "simulator", duration: "34m", isUnlocked: false },
          { id: "2-3", title: "Flip-flop conversion", type: "lecture", duration: "28m", isUnlocked: false },
          { id: "2-4", title: "Registers & shift registers", type: "simulator", duration: "32m", isUnlocked: false },
          { id: "2-5", title: "Ripple & mod-N counters", type: "simulator", duration: "35m", isUnlocked: false },
          { id: "2-6", title: "Synchronous counter design", type: "simulator", duration: "40m", isUnlocked: false },
          { id: "2-7", title: "Sequence generator", type: "case_study", duration: "25m", isUnlocked: false },
          { id: "2-8", title: "Case studies", type: "case_study", duration: "30m", isUnlocked: false },
          { id: "2-9", title: "Solved examples", type: "lecture", duration: "25m", isUnlocked: false },
          { id: "2-10", title: "Quick quiz", type: "quiz", duration: "15m", isUnlocked: false },
        ],
      },
      {
        id: "sec-3",
        number: "III",
        title: "State machines",
        topicsCount: 7,
        totalDuration: "3h 20m",
        topics: [
          { id: "3-1", title: "Moore & Mealy machines", type: "simulator", duration: "38m", isUnlocked: false },
          { id: "3-2", title: "Sequence detector & ASM", type: "simulator", duration: "32m", isUnlocked: false },
          { id: "3-3", title: "State reduction", type: "lecture", duration: "26m", isUnlocked: false },
          { id: "3-4", title: "Case studies: ATM, vending, traffic", type: "case_study", duration: "45m", isUnlocked: false },
          { id: "3-5", title: "Solved examples", type: "lecture", duration: "24m", isUnlocked: false },
          { id: "3-6", title: "Quick quiz", type: "quiz", duration: "15m", isUnlocked: false },
          { id: "3-7", title: "ASM to Verilog RTL flow", type: "simulator", duration: "20m", isUnlocked: false },
        ],
      },
      {
        id: "sec-4",
        number: "IV",
        title: "Families & PLDs",
        topicsCount: 7,
        totalDuration: "3h 10m",
        topics: [
          { id: "4-1", title: "IC performance parameters", type: "lecture", duration: "25m", isUnlocked: false },
          { id: "4-2", title: "TTL NAND gate", type: "simulator", duration: "28m", isUnlocked: false },
          { id: "4-3", title: "CMOS gates & CMOS vs TTL", type: "lecture", duration: "30m", isUnlocked: false },
          { id: "4-4", title: "PROM, PAL & PLA", type: "lecture", duration: "32m", isUnlocked: false },
          { id: "4-5", title: "CPLD & FPGA", type: "simulator", duration: "40m", isUnlocked: false },
          { id: "4-6", title: "Solved examples", type: "lecture", duration: "22m", isUnlocked: false },
          { id: "4-7", title: "Quick quiz", type: "quiz", duration: "15m", isUnlocked: false },
        ],
      },
    ],
  },
  footer: {
    copyrightYear: 2026,
    labHref: "/subscription",
    authorName: "Dr. Sagar Joshi",
  },
};

export default courseData;
