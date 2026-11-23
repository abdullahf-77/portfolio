import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Journey from './components/Journey';
import Experience from './components/Experience';
import Work from './components/Work';
import Events from './components/Events';
import Skills from './components/Skills';
import Education from './components/Education';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import { useScrollSound } from './lib/useScrollSound';

export default function App() {
  useScrollSound();
  return (
    <>
      <a href="#journey" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Experience />
        <Work />
        <Events />
        <Skills />
        <Education />
        <Certificates />
        <Contact />
      </main>
    </>
  );
}
