import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

export const NAME = "Lokesh Singh 👋";
export const DESCRIPTION =
  "I’m an AI Design Engineer crafting thoughtful user experiences by combining design expertise with the power of AI tools.";

export const NAV_LINKS = [
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Projects",
    href: "/projects",
  },
];

export const PROJECTS = [
  {
    title: "Xenith",
    src: "/projects/growwithxenith.com.png",
    href: "https://growwithxenith.com",
    description:
      "Xenith is an AI-powered growth platform for X that helps creators and founders show up consistently. It analyzes niche trends and creator content, learns your voice, and turns those insights into original post drafts and replies. Users can review and edit content, compare predicted engagement, schedule posts, and join relevant conversations from one workflow.",
    tech: [
      {
        name: "Next.js",
        icon: "/icons/next-js.svg",
        width: 70,
      },
      {
        name: "Supabase",
        icon: "/icons/supabase.svg",
        width: 90,
      },
      {
        name: "PostgreSQL",
        icon: "/icons/postgresql.svg",
        width: 98,
      },
    ],
  },
  {
    title: "Indie Hackers City",
    src: "/projects/indiehackers.city.png",
    href: "https://indiehackers.city",
    description:
      "Indie Hackers City helps independent founders discover and connect with builders in the city. Explore what other makers are working on, share your own profile and projects.",
    tech: [
      {
        name: "Next.js",
        icon: "/icons/next-js.svg",
        width: 70,
      },
      {
        name: "Supabase",
        icon: "/icons/supabase.svg",
        width: 90,
      },
      {
        name: "Three.js",
        icon: "/icons/three.js.svg",
        width: 80,
      },
      {
        name: "PostgreSQL",
        icon: "/icons/postgresql.svg",
        width: 98,
      },
    ],
  },
  {
    title: "Urlbit",
    src: "/projects/urlbit.space.png",
    href: "https://urlbit.space/",
    description:
      "URLBit is a fast, secure, and user-friendly URL shortener designed to help users create, manage, and track shortened links effortlessly. Built with a focus on performance and simplicity, it provides analytics for every shortened link — including total clicks and timestamps",
    tech: [
      {
        name: "Next.js",
        icon: "/icons/next-js.svg",
        width: 70,
      },
      {
        name: "Golang",
        icon: "/icons/golang-1.svg",
        width: 72,
      },
      {
        name: "PostgreSQL",
        icon: "/icons/postgresql.svg",
        width: 98,
      },
    ],
  },
  {
    title: "1BeatClub",
    src: "/projects/1beatclub.in.png",
    href: "https://1beatclub.in",
    description:
      "1BeatClub is a social music platform where friends create shared clubs for parties, road trips, workouts, and everyday hangouts. Members add tracks, vote for their favorites, and shape the playlist together in real time. Invite links and QR codes make it easy to bring everyone into the club.",
    tech: [
      {
        name: "Next.js",
        icon: "/icons/next-js.svg",
        width: 70,
      },
      {
        name: "Node.js",
        icon: "/icons/nodejs-icon.svg",
        width: 72,
      },
      {
        name: "PostgreSQL",
        icon: "/icons/postgresql.svg",
        width: 98,
      },
    ],
  },
];

type Experience = {
  companyName: string;
  companyLogoPath: string;
  logoContainerClassName?: string;
  designation: string;
  jobType: string;
  jobLocation: string;
  period: string;
  expPoints: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    companyName: "PharmaEdge",
    companyLogoPath: "/experience/pharmaedge.png",
    logoContainerClassName: "bg-neutral-800",
    designation: "Design Engineer",
    jobType: "Full Time",
    jobLocation: "Hybrid",
    period: "Mar 2026 – Current",
    expPoints: [
      "Working to design and create modern looking and exceptional User Experience pharma softwares",
    ],
  },
  {
    companyName: "HCL Tech",
    companyLogoPath: "/experience/hcltech.png",
    logoContainerClassName: "bg-white",
    designation: "Full Stack Engineer",
    jobType: "Full Time",
    jobLocation: "Noida, India",
    period: "Jan 2021 - 2026",
    expPoints: [
      " Improved client applications’ SEO performance by 25% and organic traffic by 18% through Next.js server side rendering and Core Web Vitals optimizations.",
      "Added data caching with TanStack Query to improve response times for repeated requests.",
      " Delivered features across frontend and backend services, collaborating with cross-functional teams to meet diverse client requirements in Agile sprints",
      " Developed RESTful APIs using Node.js (Express.js) with PostgreSQL and Prisma ORM.",
    ],
  },
];

export const ABOUT_IMAGES = [
  "/about/about1.webp",
  "/about/about2.webp",
  "/about/about3.webp",
  "/about/about4.webp",
  "/about/about5.webp",
  "/about/about6.webp",
  "/about/about7.webp",
  "/about/about8.webp",
  "/about/about9.webp",
  "/about/about10.webp",
];

export const BLOGS = [
  {
    title: "Getting Started with Tailwind CSS",
    description:
      "Learn the basics of Tailwind CSS and how to quickly build responsive, modern UIs.",
    link: "https://blog.sazzadur.site/building-a-responsive-layout",
    published_at: "Monday, Sep 1, 2025",
  },
  {
    title: "Understanding React Hooks",
    description:
      "A deep dive into useState, useEffect, and other powerful React hooks for managing state and side effects.",
    link: "https://blog.sazzadur.site/building-a-responsive-layout",
    published_at: "Thursday, Aug 28, 2025",
  },
  {
    title: "Mastering Next.js for Full-Stack Apps",
    description:
      "Build production-ready applications with server-side rendering, API routes, and static site generation in Next.js.",
    link: "https://blog.sazzadur.site/building-a-responsive-layout",
    published_at: "Wednesday, Aug 20, 2025",
  },
  {
    title: "Introduction to Prisma ORM",
    description:
      "Simplify database access and queries with Prisma's type-safe ORM for modern Node.js applications.",
    link: "https://blog.sazzadur.site/building-a-responsive-layout",
    published_at: "Friday, Aug 15, 2025",
  },
  {
    title: "10 Tips for Writing Clean JavaScript",
    description:
      "Best practices and techniques for writing maintainable, readable, and efficient JavaScript code.",
    link: "https://blog.sazzadur.site/building-a-responsive-layout",
    published_at: "Sunday, Aug 10, 2025",
  },
];

export const ACHIVEMENTSTIMELINE = [
  {
    year: "2025",
    achivements: [
      {
        title: "Promoted to Senior Software Engineer",
        description:
          "Led a team of 5 engineers and delivered a high-scale microservices project on time.",
      },
      {
        title: "Open Source Contribution",
        description:
          "Contributed to Next.js core features, which got merged into production release.",
      },
    ],
  },
  {
    year: "2024",
    achivements: [
      {
        title: "Built AI-Powered SaaS Tool",
        description:
          "Launched a SaaS product that converts YouTube videos into SEO blogs, gained 2K users in 3 months.",
      },
      {
        title: "Hackathon Winner",
        description:
          "Won 1st place at a national-level hackathon by building a real-time collaboration app.",
      },
      {
        title: "Conference Speaker",
        description:
          "Spoke at JSConf about scaling React applications for millions of users.",
      },
    ],
  },
  {
    year: "2023",
    achivements: [
      {
        title: "Joined HCL Technologies",
        description:
          "Started working as a frontend engineer focusing on React and Next.js projects.",
      },
      {
        title: "Launched Open Source Library",
        description:
          "Created a React hooks library that gained 500+ GitHub stars within 2 months.",
      },
    ],
  },
];

export const TESTIMONIALS = [
  {
    content:
      "Working with Lokesh was a great experience. He delivered a clean, scalable frontend architecture and made the UI feel seamless and intuitive.",
    name: "Ananya Sharma",
    designation: "Product Manager, FinTech Startup",
    avatarPath: "/testimonial/ananya.jpg",
  },
  {
    content:
      "Lokesh’s attention to detail in React and Next.js projects really impressed us. He optimized performance and improved our web app’s user experience drastically.",
    name: "Sophie Williams",
    designation: "CTO, Creative Agency",
    avatarPath: "/testimonial/sophie.jpg",
  },
  {
    content:
      "He has a strong problem-solving mindset and quickly adapts to new technologies. Our backend APIs and frontend integration were smoother than ever.",
    name: "Rahul Mehta",
    designation: "Software Architect, SaaS Company",
    avatarPath: "/testimonial/rahul.jpg",
  },
  {
    content:
      "Lokesh not only wrote efficient code but also guided our team in implementing best practices. His collaborative approach made the project a success.",
    name: "Arjun Patel",
    designation: "Team Lead, E-commerce Platform",
    avatarPath: "/testimonial/arjun.jpg",
  },
  {
    content:
      "A reliable engineer with a knack for delivering on time. The web application he built for us was robust, fast, and scalable.",
    name: "David Johnson",
    designation: "Founder, Startup Inc.",
    avatarPath: "/testimonial/david.jpg",
  },
];

export const SOCIALS = [
  {
    name: "X",
    href: "https://x.com/ShipItLokesh",
    icon: IconBrandX,
  },
  {
    name: "Github",
    href: "https://github.com/LokeshXs",
    icon: IconBrandGithub,
  },
  {
    name: "Linked in",
    href: "https://www.linkedin.com/in/lokeshsingh1129/",
    icon: IconBrandLinkedin,
  },
];

export const GITHUB_USERNAME = "LokeshXs";

export const GITHUB_SHOWCASE_REPOS = [
  "url-shortener",
  "Minimal-Portfolio-Template",
  "1BeatClub-V2.0",
  "FilmStash",
];
