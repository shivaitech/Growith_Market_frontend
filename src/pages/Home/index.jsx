import Banner from './sections/Banner'
import About from './sections/About'
import Speciality from './sections/Speciality'
import Portfolio from './sections/Portfolio'
import Project from './sections/Project'
import Roadmap from './sections/Roadmap'
import Team from './sections/Team'
import Testimonials from './sections/Testimonials'
import FAQ from './sections/FAQ'
import Create from './sections/Create'

export default function Home() {
  return (
    <>
      <Banner />
      <About />
      <Speciality />
      <Portfolio />
      <Project />
      {/* <Roadmap /> */}
      <Team />
      <Testimonials />
      <FAQ />
      <Create />
    </>
  )
}
