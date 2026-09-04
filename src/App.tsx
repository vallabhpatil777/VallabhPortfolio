import { lazy, Suspense } from 'react'
import Navbar from './Components/Navbar/Navbar'
import Intro from './Components/MiddlePart/Intro'
import Skills from './Components/MiddlePart/Skills'
import Experience from './Components/MiddlePart/Experience'
import Projects from './Components/MiddlePart/Projects'
import Education from './Components/MiddlePart/Education'
import Contact from './Components/MiddlePart/Contact'
import Footer from './Components/Footer/Footer'
import SnowfallComponent from './Components/SnowfallComponent'
import ErrorBoundary from './Components/common/ErrorBoundary'

// The assistant pulls in a markdown renderer and the chat client; none of that
// belongs on the critical path, so it is fetched as its own chunk.
const Chatbot = lazy(() => import('./Components/MiddlePart/Chatbot'))

function App() {
  return (
    <>
      <a
        href="#about"
        className="sr-only rounded-md bg-brand-500 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
      >
        Skip to content
      </a>

      <SnowfallComponent />
      <Navbar />

      <main id="main" className="w-full">
        <section id="about" className="w-full pt-[calc(var(--nav-h)+1rem)]">
          <Intro />
        </section>

        <section id="skills" className="w-full scroll-mt-[var(--nav-h)] py-16 sm:py-20">
          <Skills />
        </section>

        <section id="experience" className="w-full scroll-mt-[var(--nav-h)] py-16 sm:py-20">
          <Experience />
        </section>

        <section id="projects" className="w-full scroll-mt-[var(--nav-h)] py-16 sm:py-20">
          <Projects />
        </section>

        <section id="education" className="w-full scroll-mt-[var(--nav-h)] py-16 sm:py-20">
          <Education />
        </section>

        <section id="contact" className="w-full scroll-mt-[var(--nav-h)] py-16 sm:py-20">
          <Contact />
        </section>
      </main>

      <Footer />

      <ErrorBoundary label="Chatbot">
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default App
