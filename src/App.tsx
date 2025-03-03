import Navbar from "./Components/Navbar/Navbar"
import Intro from './Components/MiddlePart/Intro'
import Skills from './Components/MiddlePart/Skills'
import Experience from './Components/MiddlePart/Experience'
import Projects from './Components/MiddlePart/Projects'
import Education from './Components/MiddlePart/Education'
import Contact from './Components/MiddlePart/Contact'
import Footer from './Components/Footer/Footer'
import Chatbot from './Components/MiddlePart/Chatbot'

function App() {
  return (
    <div className="overflow-x-hidden min-h-screen">
      <Navbar />
      <Chatbot />
    
      <section id="about" className="w-full pt-[60px] bg-[#090917]">
        <Intro />
      </section>
      <section id="skills" className="w-full  pt-[30px] bg-[#090917]">
        <Skills />
      </section>
      <section id="experience" className="w-full  pt-[80px] bg-[#090917]">
        <Experience />
      </section>
      <section id="projects" className="w-full pt-[20px] bg-[#090917]">
        <Projects />
      </section>
      <section id="education" className="w-full  pt-[80px] bg-[#090917]">
        <Education />
      </section>
      <section id="contact" className="w-full ">
        <Contact />
      </section>
      <section id="footer" className="w-full ">
      <Footer />
      </section>
      
    </div>
  );
}

export default App;
