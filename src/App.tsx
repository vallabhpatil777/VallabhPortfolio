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
import Backdrop from './Components/common/Backdrop'
import CustomCursor from './Components/common/CustomCursor'
import ErrorBoundary from './Components/common/ErrorBoundary'

// The assistant pulls in a markdown renderer and the chat client; none of that
// belongs on the critical path, so it is fetched as its own chunk.
const Chatbot = lazy(() => import('./Components/MiddlePart/Chatbot'))

/** Hairline between sections, so the page reads as chapters rather than one scroll. */
function SectionDivider() {
  return (
    <div aria-hidden="true" className="container-page">
      <div className="divider-glow" />
    </div>
  )
}

function App() {
  return (
    <>
      <a
        href="#about"
        className="sr-only rounded-md bg-brand-500 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
      >
        Skip to content
      </a>

      {/* Two decorative layers, both behind the content: the aurora field at
          `-z-20` and the snow at `-z-10`. */}
      <Backdrop />
      <SnowfallComponent />

      {/* Replaces the system cursor on fine-pointer devices only; it renders
          nothing at all on touch or under reduced motion. */}
      <CustomCursor />

      <Navbar />

      <main id="main" className="w-full">
        <section id="about" className="w-full pt-[calc(var(--nav-h)+1rem)]">
          <Intro />
        </section>

        <SectionDivider />

        <section id="skills" className="w-full scroll-mt-[var(--nav-h)] py-20 sm:py-24">
          <Skills />
        </section>

        <SectionDivider />

        <section id="experience" className="w-full scroll-mt-[var(--nav-h)] py-20 sm:py-24">
          <Experience />
        </section>

        <SectionDivider />

        <section id="projects" className="w-full scroll-mt-[var(--nav-h)] py-20 sm:py-24">
          <Projects />
        </section>

        <SectionDivider />

        <section id="education" className="w-full scroll-mt-[var(--nav-h)] py-20 sm:py-24">
          <Education />
        </section>

        <SectionDivider />

        <section id="contact" className="w-full scroll-mt-[var(--nav-h)] py-20 sm:py-24">
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
