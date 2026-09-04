import risidio from '../assets/risidio.webp'
import accenture from '../assets/accenture.webp'
import type { TimelineEntry } from '../Components/common/Timeline'

export const experience: TimelineEntry[] = [
  {
    id: 0,
    organisation: 'N&S Consultants, Birmingham UK',
    role: 'Full Stack Developer and Automation Engineer',
    duration: 'October 2025 - Present',
    description:
      'Led development of an AI-powered platform for medico-legal expert search, reducing manual CV matching time by ~60-70%. Built a RAG-based system to retrieve and rank expert profiles, improving relevance and reducing manual filtering effort. Developed backend services using Python (FastAPI) with PostgreSQL and Redis, improving response times by ~30%. Implemented automated expert recommendation and quote generation, reducing processing time by ~40%. Evaluated model outputs to identify failure cases and improve retrieval quality through prompt and search optimisation. Designed and deployed the system end-to-end, including architecture, frontend (React), and monitoring with Prometheus.',
    metaLabel: 'Skills',
    meta: 'Python • FastAPI • RAG • LLMs • PostgreSQL • Redis • React • Prometheus • Prompt Optimisation • Model Evaluation • System Architecture • End-to-End Deployment',
    // No brand logo available for this employer — the timeline renders a
    // monogram medallion instead.
  },
  {
    id: 1,
    organisation: 'Risidio, London UK',
    role: 'AI Backend Service Engineer',
    duration: 'January 2025 - May 2025',
    description:
      'As an AI Engineer at Risidio, I was actively involved in developing AI Agents and creating a RAG utility microservice using LangChain, LLMs, and Weaviate (vector database) for tasks like text summarization and analysis. Additionally, I explored AI in the blockchain space, researching smart contracts, LLMs, and integrating AI for automated workflows within the blockchain ecosystem. On the frontend, I built responsive, reusable components using Figma, React, Redux Toolkit, TypeScript, SCSS, and Tailwind CSS, ensuring seamless user experiences and high performance. For backend and deployment, I managed data efficiently using PostgreSQL and Prisma ORM, streamlined workflows with Docker, and collaborated in agile teams using Git, actively participating in daily standups and scrum meetings.',
    metaLabel: 'Skills',
    meta: 'Python • React • TypeScript • LLMs • LangChain • Cursor • Retrieval Augmented Generation (RAG) • Vector Database • FastAPI • Redux • Git • Docker • NestJS • Figma • PostgreSQL • Agile Project Management',
    logo: risidio,
  },
  {
    id: 2,
    organisation: 'Accenture, India',
    role: 'Associate Software Engineer',
    duration: 'January 2021 - July 2022',
    description:
      'As an Associate Software Engineer I worked on backend solutions, focusing on change management and handling software releases. Worked on backend development tasks using Python, optimized database queries in MySQL, and collaborated with agile teams to improve performance and reliability through continuous testing. Also actively participated in sprint planning and sprint reviews.',
    metaLabel: 'Skills',
    meta: 'Python • MySQL • Git • Jira • Application Testing',
    logo: accenture,
  },
]
