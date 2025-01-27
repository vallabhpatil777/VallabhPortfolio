import { useState, Suspense } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


import Navbar from "./Components/Navbar/Navbar"
import Intro from './Components/MiddlePart/Intro'
import Skills from './Components/MiddlePart/Skills'
import Experience from './Components/MiddlePart/Experience'
import Projects from './Components/MiddlePart/Projects'
import Education from './Components/MiddlePart/Education'
import Contact from './Components/MiddlePart/Contact'
import Footer from './Components/Footer/Footer'


function App() {

  return (
      <div>
        
         <Navbar/>
         <Navbar />
         <section id="about" className="pt-[80px]">
  <Intro />
</section>
<section id="skills" className="pt-[30px]">
  <Skills />
</section>
<section id="experience" className="pt-[80px]">
  <Experience />
</section>
<section id="projects"  className="pt-[20px]">
  <Projects />
</section>
<section id="education" className="pt-[80px]">
  <Education />
</section>
         <Contact/>
         <Footer/>
      </div>
      
  
  )
}

export default App
