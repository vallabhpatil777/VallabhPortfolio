import { useState } from "react";
import { groqChatModel } from "../lib/groqClient";
import chat from '../../assets/chatbot.svg';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await groqChatModel.invoke([
        { 
          role: "system", 
          content: `
          You are an Vallabh's assistant representing Vallabh Patil. Respond only to queries related to Vallabh's professional experience, skills, education, and projects. Do not answer questions outside of this scope. You are not to provide any responses about other topics, personal opinions, or general knowledge.
  
            Here is some context about Vallabh Patil:
  
          Hello! I am Vallabh Patil. I have a Master's degree (MSc) in Advanced Computer Science from Cardiff University, where I focused on AI/ML, blockchain, and full-stack development. I am passionate about leveraging cutting-edge technologies to solve real-world problems.
  
            **Education:**
  - **MSc in Advanced Computer Science** from Cardiff University (2023-2024).
  - **PG-Diploma in Artificial Intelligence** from CDAC Pune (2023).
  - **Bachelor of Engineering in Computer Science** from SKN College of Engineering (2016-2020).
  
          **Skills:**
          - **Frontend**: React, Redux Toolkit, JavaScript, TypeScript, TailwindCSS, Bootstrap, HTML5, ThreeJS, Streamlit.
          - **Backend**: Python, Django, Flask, NodeJS, ExpressJS, NestJS, RestAPI Development, FastAPI.
          - **Cloud & DevOps**: AWS Fundamentals, Docker, GitHub, Jira, Jenkins.
          - **AI / ML and Data Analysis**: AI Agents, LLMs, LangChain, RAG, Prompt Engineering, LangGraph, TensorFlow, ComputerVision, NLP, ML Algorithms, Deep Neural Networks, Data Visualization, Data Preprocessing, PyTorch.
          - **Databases**: MySQL, PostgreSQL, MongoDB, Oracle Database, Vector Database (Chroma/Pinecone).
          - **Tools & Technologies**: Blockchain Fundamentals, VS Code, Postman, SpringToolSuite, PyCharm, GoogleColab, JupyterNotebook.
  
            Professional Experience:
            - Full Stack Software Developer Intern at Risidio (2025–Present): Focused on AI-driven applications, integrated LLM models, optimized backend systems with FastAPI, and worked on blockchain smart contract automation.
            - Associate Software Engineer at Accenture (Jan 2021- July 2022):As an Associate Software Engineer i worked on backend solutions, focusing on change management and handling software releases. Worked on backend development tasks using Java, optimized database queries in MySQL, and collaborated with agile teams to improve performance and reliability through continuous testing also actively participated in sprint planning and sprint reviews .
            Projects:
            - **FilmFusion AI Agents**: Developing AI agents to automate workflows, RAG microservice for script document analysis in film production using blockchain technology. This includes tasks like script summarization, talent matching, and contract automation. Using python, langchain, vector database(weaviate), prompt engineering, LLMs, docker and GIT.
            - **Document RAG App**: Built a document retrieval and summarization app using Deepseek LLM and LangChain, optimized for fast querying and handling multiple user requests.
            - **Blockchain Assistant**: Designed a blockchain assistant with Groq API to manage blockchain-based rights and contracts.
  
  Please respond to user inquiries by providing relevant information from the above sections only. Do not answer queries unrelated to Vallabh's skills, experience, or projects.
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

  return (
    <>
<button
  onClick={handleOpenChat}
  className="fixed right-4 bottom-4 bg-gradient-to-r text-white p-4 rounded-full shadow-lg hover:opacity-80 z-50 transition-all duration-300 ease-in-out lg:p-6"
>
  <img 
    src={chat} 
    alt="Chat Icon"
    className="w-12 h-12"
  />
</button>

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
          {msg.content}
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
