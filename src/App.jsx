import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import NFT from './pages/NFT'
import TokenDetail from './pages/TokenDetail'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import RoadmapPage from './pages/Roadmap'
import TeamPage from './pages/Team'
import Onboarding from './pages/Onboarding'
import OnboardingSuccess from './pages/OnboardingSuccess'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PrivacyPolicy from './pages/Legal/PrivacyPolicy'
import TermsOfUse from './pages/Legal/TermsOfUse'
import RiskDisclosure from './pages/Legal/RiskDisclosure'
import CookiePolicy from './pages/Legal/CookiePolicy'
import KycAml from './pages/Legal/KycAml'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Standalone routes (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/success" element={<OnboardingSuccess />} />
        
        {/* Main app routes (with layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="nft" element={<NFT />} />
          <Route path="token/:slug" element={<TokenDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetails />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="legal/privacy" element={<PrivacyPolicy />} />
          <Route path="legal/terms" element={<TermsOfUse />} />
          <Route path="legal/risk" element={<RiskDisclosure />} />
          <Route path="legal/cookies" element={<CookiePolicy />} />
          <Route path="legal/kyc-aml" element={<KycAml />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
