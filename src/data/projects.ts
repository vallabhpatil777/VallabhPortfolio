import social from '../assets/social.webp'
import restro from '../assets/restro.webp'
import blog from '../assets/blog.webp'
import facemask from '../assets/facemask.webp'
import spam from '../assets/spam.webp'
import portfolio from '../assets/portfolio.webp'
import travelplan from '../assets/travelplan.webp'
import documentRag from '../assets/DocumentRag.webp'
import newstool from '../assets/newstool.webp'
import arch from '../assets/arch.webp'
import pharmacy from '../assets/pharmacy.webp'
import codeassist from '../assets/codeassist.webp'
import mockmate from '../assets/mockmate.webp'

export const CATEGORIES = ['All', 'Python', 'Java', 'React', 'AI / ML'] as const
export type Category = (typeof CATEGORIES)[number]
export type ProjectCategory = Exclude<Category, 'All'>

export type Project = {
  id: string
  /** Optional — projects with no screenshot render a titled gradient tile. */
  image?: string
  topic: string
  duration: string
  description: string
  /** A project can sit in more than one bucket (e.g. an AI/ML app with a React UI). */
  categories: ProjectCategory[]
  codeLink: string
  demoLink?: string
}

export const projects: Project[] = [
  {
    id: 'mockmate',
    image: mockmate,
    topic: 'MockMate - AI-Powered Mock Interview Platform',
    duration: '2025',
    description:
      'MockMate helps candidates prepare for job interviews by simulating AI-driven mock interviews and generating structured feedback. It provides authentication, instant feedback scoring, and interview history tracking. Built with Next.js, Firebase, TailwindCSS, and LLM-based AI feedback.',
    categories: ['AI / ML', 'React'],
    codeLink: 'https://github.com/vallabhpatil777/MockMate.git',
    demoLink: 'https://mock-mate-iota-taupe.vercel.app/',
  },
  {
    id: 'log-classification',
    image: arch,
    topic: 'Log Classification System Using Hybrid Classification',
    duration: '2025',
    description:
      'This project implements a hybrid log classification system, combining three complementary approaches to handle varying levels of complexity in log patterns. The classification methods ensure flexibility and effectiveness in processing predictable, complex, and poorly-labeled data patterns.',
    categories: ['AI / ML'],
    codeLink:
      'https://github.com/vallabhpatil777/Log_Classification_System_Using_Hybrid_Classification.git',
  },
  {
    id: 'code-assist',
    image: codeassist,
    topic: 'Code Generator Assistant - AI-Powered Multi-Agent Coding Assistant',
    duration: '2025',
    description:
      'Built an AI-powered coding assistant using LangGraph that works like a virtual development team. It transforms natural language prompts into complete, working projects - file by file - following real developer workflows. Features include Planner, Architect, and Coder Agents that analyze requests, generate structured plans, break them into engineering tasks, and implement code with iterative refinement. Tech stack includes LangGraph, LangChain tools, Groq LLMs, and Python.',
    categories: ['AI / ML', 'Python'],
    codeLink: 'https://github.com/vallabhpatil777/Code-Generator-Assistant-Using-LangGraph.git',
  },
  {
    id: 'pharmacy-voice-agent',
    image: pharmacy,
    topic: 'Pharmacy Assistant Voice Agent',
    duration: '2025',
    description:
      'This project is a voice-enabled AI assistant designed for pharmacies. It can interact with users via natural voice commands to book an order, fetch order details, provide medicine information, and offer insights on availability, usage, and cost. The system integrates speech-to-text, telephony, and AI-driven tool-calling to ensure a seamless pharmacy assistance experience.',
    categories: ['AI / ML', 'Python'],
    codeLink: 'https://github.com/vallabhpatil777/Pharmacy-Assistant-Voice-Agent.git',
  },
  {
    id: 'ontology-medical',
    topic: "Ontology-Driven Medical Data Analysis (Master's Dissertation)",
    duration: '2024',
    description:
      'Conducted ontology-driven analysis of medical data using NLP techniques and transfer learning with BERT and BioBERT LLMs. Utilised Named Entity Recognition (NER) to extract key medical entities from PubMed articles, and leveraged the OCD ontology for robust feature extraction and classification tasks. Built with Python, BERT/BioBERT, TensorFlow, Scikit-learn, NER and Owlready for ontology integration and data processing. Awarded Best MSc Dissertation (Specialist Degree) at Cardiff University.',
    categories: ['AI / ML', 'Python'],
    codeLink: 'https://github.com/vallabhpatil777',
  },
  {
    id: 'social-media',
    image: social,
    topic: 'Social Media Web Application',
    duration: '2024',
    description:
      'A web application built using React, Redux, Java, MySQL and Spring Boot, enabling users to share posts, interact, and connect seamlessly. The application offers functionalities such as creating, liking, and commenting on posts, as well as secure image and video uploads using Cloudinary. It features follow/unfollow capabilities and secure JWT-based authentication for user accounts.',
    categories: ['Java', 'React'],
    codeLink: 'https://github.com/vallabhpatil777/SocialMedia-App-Java-JavaScript-React',
  },
  {
    id: 'restaurant-booking',
    image: restro,
    topic: 'Restaurant Booking Web Application',
    duration: '2024',
    description:
      "A Django-based web application built using Python, SQLite, Bootstrap and Javascript that allows users to view the restaurant menu, book tables, and provide feedback. The app is fully functional, with an intuitive interface for seamless booking and interaction. It leverages Django's robust backend features, while the frontend is styled using Bootstrap for responsiveness and ease of use. Also deployed on AWS EC2.",
    categories: ['Python'],
    codeLink: 'https://github.com/vallabhpatil777/Restaurant-Booking-WebApplication-Django',
    demoLink: 'http://13.53.48.37:8000',
  },
  {
    id: 'bloghive',
    image: blog,
    topic: 'BlogHive Web Application',
    duration: '2024',
    description:
      'A Django-based blog web application built using Python, SQLite, Bootstrap and Javascript that enables users to create, edit, and delete blog posts, add comments, and manage their profiles. The app features blog post creation, deletion, add comments, user authentication (signup, login, logout) and profile editing functionality. Application is deployed on PythonAnywhere.',
    categories: ['Python'],
    codeLink: 'https://github.com/vallabhpatil777/Blog-WebApp-Django',
    demoLink: 'https://vallabhpatil777.pythonanywhere.com',
  },
  {
    id: 'news-research',
    image: newstool,
    topic: 'News Research Tool AI Agent',
    duration: '2025',
    description:
      'A web application built using Python, Langchain, Groq API, FAISS, and Streamlit, designed as an AI driven news research tool. It enables users to input article URLs, scrape the content, process the text and provide responses using Groq API and Large Language Models (LLMs). The backend handles web scraping, text processing, and vectorization using FAISS, while the Streamlit frontend provides a user-friendly interface for submitting URLs and asking questions.',
    categories: ['AI / ML', 'Python'],
    codeLink: 'https://github.com/vallabhpatil777/News_Research_Tool_AI_Agent',
  },
  {
    id: 'travel-planner',
    image: travelplan,
    topic: 'Travel Planner AI MultiAgent Application',
    duration: '2025',
    description:
      'A web application built using Python, React, FastAPI, LangChain, LangGraph, Hugging Face embeddings, and Groq API, designed as an AI travel planner that generates personalized itineraries. It features a multi-agent system leveraging LangChain and LangGraph for AI-driven decision-making and state management. The React, TypeScript, Redux Toolkit and Axios frontend interacts with a FastAPI backend that processes user input, retrieving travel recommendations based on city and interests.',
    categories: ['AI / ML', 'Python', 'React'],
    codeLink: 'https://github.com/vallabhpatil777/Travel_Planner_AI_MultiAgent',
  },
  {
    id: 'document-rag',
    image: documentRag,
    topic: 'Document RAG Application',
    duration: '2025',
    description:
      'A Document RAG (Retrieval-Augmented Generation) application developed using Python, Streamlit, LangChain, Hugging Face embeddings, and Chroma vector database for advanced document querying and summarization. The app integrates Deepseek-R1-70B, Llama-70B, and other LLM models via Groq Cloud API, enabling AI-driven responses with vector-based retrieval and query chaining. It features a session-based approach to efficiently manage document embeddings.',
    categories: ['AI / ML', 'Python'],
    codeLink: 'https://github.com/vallabhpatil777/Document_RAG_App',
  },
  {
    id: 'face-mask',
    image: facemask,
    topic: 'Face Mask Detection Web Application',
    duration: '2024',
    description:
      'A web application built using Flask, Python, OpenCV and Tensorflow that detects whether a person is wearing a face mask with a fine-tuned VGG16 model. The model was trained on 7,000 images with data augmentation techniques for improved accuracy and generalization. The app provides real-time predictions through a simple interface, with real time detection using a webcam.',
    categories: ['AI / ML', 'Python'],
    codeLink: 'https://github.com/vallabhpatil777/Facemask-detection-OpenCV',
  },
  {
    id: 'spam-detection',
    image: spam,
    topic: 'Spam Email Detection Web Application',
    duration: '2024',
    description:
      'A Machine Learning web application designed to classify emails and SMS messages as Spam or Not Spam using Natural Language Processing (NLP). Various ML models were evaluated, and Multinomial Naive Bayes with TF-IDF vectorization (98% precision) was selected for prediction due to its accuracy and efficiency. Built with Streamlit, it provides real-time predictions.',
    categories: ['AI / ML', 'Python'],
    codeLink: 'https://github.com/vallabhpatil777/Spam-email-predictor',
  },
  {
    id: 'portfolio',
    image: portfolio,
    topic: 'Personal Portfolio',
    duration: '2025',
    description:
      'A personal portfolio web application with an AI assistant developed using React, TypeScript, Three.js, Langchain and Tailwind CSS, featuring an interactive 3D avatar rendered using Three.js. The portfolio showcases my skills, education and experience, and includes a contact form. Built with a sleek, responsive UI using Tailwind CSS.',
    categories: ['React'],
    codeLink: 'https://github.com/vallabhpatil777/VallabhPortfolio',
  },
]
