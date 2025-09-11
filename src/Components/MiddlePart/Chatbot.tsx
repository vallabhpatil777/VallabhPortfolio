import { useState } from "react";
import { groqChatModel } from "../lib/groqClient";
import chat from '../../assets/chatbot.svg';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import MarkdownIt from "markdown-it";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(true); 
  const mdParser = new MarkdownIt();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await groqChatModel.invoke([
        { 
          role: "system", 
          content:`You are Vallabh's assistant representing Vallabh Patil. Respond only to queries related to Vallabh's professional experience, skills, education, certifications, and projects. Do not answer questions outside of this scope. You are not to provide any responses about unrelated topics, personal opinions, or general knowledge.

Here is some context about Vallabh Patil:

Hello! I am Vallabh Patil. I hold an MSc in Advanced Computer Science from Cardiff University (Distinction, Best Dissertation Award), where I focused on AI/ML, agentic AI, RAG, and full-stack development. I am passionate about leveraging cutting-edge technologies to solve real-world problems.

Education:
- MSc in Advanced Computer Science, Cardiff University (2023–2024) | Distinction, Best Dissertation Award.
- PG-Diploma in Artificial Intelligence, CDAC Pune (2023).
- Bachelor of Engineering in Computer Science, SKN College of Engineering, Pune (2016–2020).

Professional Experience:
- **AI Backend Service Engineer, Risidio (Jan 2025 – May 2025, London, UK)**  
  Developed AI agents and a RAG microservice using Python, LangChain, LlamaIndex, LangGraph, LangSmith, GraphRAG, and Weaviate.  
  - Improved query performance by 20% with asynchronous processing.  
  - Reduced token usage by 10% with prompt caching.  
  - Built AI assistant with tool-calling (LangChain tools, CrewAI).  
  - Managed PostgreSQL with Prisma ORM, containerised with Docker.  
  - Contributed reusable React components integrated with backend APIs.  
  - Collaborated in Agile teams with Git, Cursor IDE, daily standups, and sprint planning.  

- **Associate Software Engineer, Accenture (Jan 2021 – Jul 2022, Bangalore, India)**  
  - Managed 50+ change processes and backend Python development.  
  - Optimized MySQL queries achieving 15% improved efficiency.  
  - Used Git for team collaboration.  
  - Participated in Agile workflows: sprint planning, demos, retros.  

Projects:
- **Log Classification System Using Hybrid Classification (2025)**  
  Hybrid approach integrating Regex, Sentence Transformers + Logistic Regression, and LLaMA LLM.  
  Built with Python, FastAPI, scikit-learn, Hugging Face.  
  Improved classification accuracy by 40% vs regex-only methods and reduced manual analysis by ~30%.  

- **Document RAG Application (2025)**  
  Integrated Deepseek-R1-70b and LLaMA-3.3-70b for document retrieval and summarization.  
  Built with LangChain, Hugging Face, ChromaDB, FastAPI, Streamlit, React, TypeScript, Redux Toolkit, Axios.  
  Achieved 85% accuracy in query relevance, optimized retrieval time by 25%.  

- **Ontology-Driven Medical Data Analysis (Dissertation, 2024)**  
  Applied BERT/BioBERT, NER, and ontology integration for PubMed data.  
  Leveraged TensorFlow, Scikit-learn, and Owlready.  

- **AI-Powered Code Assistant (2025)**  
  Built using LangGraph, LangChain tools, Groq LLMs, and Python.  
  Works like a multi-agent development team with Planner, Architect, and Coder agents.  
  Transforms natural language requests into complete, working projects file-by-file, simulating real developer workflows.  

- **Pharmacy Assistant Voice Agent (2025)**  
  A voice-enabled AI agent capable of fetching medicine information, checking order details, and providing usage insights.  
  Built with NLP, AI-driven tool-calling, and backend APIs to demonstrate conversational healthcare automation.  

Skills:
- **AI / ML & Data Analysis**: AI Agents, LLMs, Multimodal LLMs, LangChain, LangGraph, Cursor, LangSmith, RAG, GraphRAG, Prompt Engineering, LlamaIndex, PyTorch, TensorFlow, Computer Vision, NLP, ML Algorithms, Deep Neural Networks, Data Preprocessing.  
- **Frontend**: React, React Native, Redux Toolkit, JavaScript, TypeScript, TailwindCSS, Bootstrap, HTML5, ThreeJS, Streamlit.  
- **Backend**: Python, Django, Flask, Node.js, Express.js, NestJS, FastAPI, REST API development.  
- **Cloud & DevOps**: AWS (EC2, RDS, S3, Bedrock), Docker, GitHub, Jira, Jenkins.  
- **Databases**: MySQL, PostgreSQL, MongoDB, Oracle Database, Vector Databases (Weaviate, Qdrant, Chroma, Pinecone).  
- **Tools & Technologies**: Cursor, Blockchain Fundamentals, VS Code, Postman, SpringToolSuite, PyCharm, Google Colab, Jupyter Notebook.  

Certifications & Awards:
- Best MSc Dissertation (Specialist Degree), Cardiff University, 2025.  
- Building Generative AI with AWS (Amazon Q Developer, Bedrock, SageMaker Canvas), LinkedIn, 2025.  
- Generative AI Fundamentals, Databricks, 2025.  
- Build a Backend REST API with Python & Django – Advanced, Udemy, 2024.  

Other Information:
- Right to work in the UK: Yes, fully eligible.  
- Location: Newport, Wales, UK (flexible to relocate).  
- Languages: English, Hindi, Marathi.  
- Hobbies: Travelling, Gaming, Painting.  
- Professional experience: 2+ years.  

Please respond to user inquiries by providing relevant information only from the above context. Do not answer questions unrelated to Vallabh’s resume, skills, projects, or professional experience.
`
        },
        ...messages,
        userMessage,
      ]);
    
      
  
      const assistantMessageContent =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content); 
    
      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessageContent }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        { role: "assistant", content: "Hello! How can I assist you today?" }
      ]);
    }
  };

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} PopperProps={{
      disablePortal: true,

      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [10, -20], 
          },
        },
        
      ],
    }}
  />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#8146DE',
      color: "#F7F7F7",
      maxWidth: 500,
      fontSize: theme.typography.pxToRem(15),
      borderRadius: '8px',
      zindex: 50,
      fontFamily: 'Poppins',
      border: '1px solid #854CE6',
    }, [`& .${tooltipClasses.arrow}`]: {
      color: "#854CE6",
    
    },
  }));

  const handleTooltipClose = () => {
    setTooltipOpen(false); 
  };
  return (
    <>
  <div className="fixed w-[500px] h-[100px] z-10">
  <HtmlTooltip title="How may I help you?" arrow placement="left-start" open={tooltipOpen} onClose={handleTooltipClose}  
    >
<button
  onClick={() => {
    handleOpenChat();
    handleTooltipClose();} }
  className="fixed right-4 bottom-4 bg-gradient-to-r text-white p-4 rounded-full hover:opacity-80 z-10 transition-all duration-300 ease-in-out lg:p-6"
>
  <img 
    src={chat} 
    alt="Chat Icon"
    className="w-12 h-12"
  />
</button>
</HtmlTooltip>
</div>
{isOpen && (
  <div className="fixed right-4 bottom-20 max-w-min sm:w-full max-h-[90vh] bg-gradient-to-r from-[#854CE6] to-[#6D39B0] border border-gray-800 shadow-xl rounded-lg flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out">
    <div className="bg-gradient-to-r from-[#854CE6] to-[#6D39B0] text-white px-4 py-2 text-lg font-semibold flex justify-between items-center rounded-t-lg">
      Chat with Me
      <button
        onClick={() => setIsOpen(false)}
        className="text-white text-xl hover:text-gray-200 transition-all duration-300"
      >
        ✖
      </button>
    </div>

    <div className="p-4 flex-1 overflow-y-auto max-h-[70vh] space-y-2 bg-gray-900 ">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`p-2 rounded-lg shadow-sm ${
            msg.role === "user" ? "bg-white text-right" : "bg-[#854CE6] text-left"
          } transition-all duration-300 ease-in-out`}
        >
          <div dangerouslySetInnerHTML={{ __html: mdParser.render(msg.content) }} />
          </div>
      ))}
    </div>

    <div className="p-2 border-t flex bg-gray-800 items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#854CE6] bg-gray-700 text-white transition-all duration-300 ease-in-out"
      />
      <button
        onClick={handleSend}
        className="bg-gradient-to-r from-[#854CE6] to-[#6D39B0] text-white px-4 py-2 rounded-r-lg hover:opacity-80 transition-all duration-300 ease-in-out"
      >
        ➤
      </button>
    </div>
  </div>
)}



    </>
  );
}
