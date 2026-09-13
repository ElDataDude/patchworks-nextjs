import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "5 Ways Fractional AI Leadership Can Transform Your Business",
    paragraph:
      "Discover how a fractional head-of-AI can provide executive-level guidance at a fraction of the cost, helping your business achieve measurable ROI from AI investments.",
    image: "/images/editorial/article-leadership.webp",
    author: {
      name: "James Wilson",
      image: "/images/blog/author-01.png",
      designation: "AI Strategy Director",
    },
    tags: ["strategy"],
    publishDate: "2025",
  },
  {
    id: 2,
    title: "Implementing AI in Manufacturing: A Case Study",
    paragraph:
      "Learn how our manufacturing client achieved a 35% reduction in quality control costs and improved defect detection by 28% through strategic AI implementation.",
    image: "/images/editorial/article-manufacturing.webp",
    author: {
      name: "Sarah Chen",
      image: "/images/blog/author-02.png",
      designation: "Implementation Specialist",
    },
    tags: ["case-study"],
    publishDate: "2025",
  },
  {
    id: 3,
    title: "The ROI of AI: Measuring Success Beyond the Hype",
    paragraph:
      "Explore practical frameworks for measuring the true business impact of your AI investments, with real-world examples and metrics that matter to executives.",
    image: "/images/editorial/article-roi.webp",
    author: {
      name: "Michael Thompson",
      image: "/images/blog/author-03.png",
      designation: "ROI Analytics Lead",
    },
    tags: ["analytics"],
    publishDate: "2025",
  },
];
export default blogData;
