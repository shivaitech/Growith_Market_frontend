import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import NFT from './pages/NFT'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import RoadmapPage from './pages/Roadmap'
import TeamPage from './pages/Team'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="nft" element={<NFT />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetails />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="team" element={<TeamPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
