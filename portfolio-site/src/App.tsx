import { Route, Routes } from 'react-router-dom'

import { SiteLayout } from './components/site-layout'
import { ScrollToTop } from './components/scroll-to-top'
import { HomePage } from './pages/home-page'
import { NotFoundPage } from './pages/not-found-page'
import { ProjectPage } from './pages/project-page'
import { StudioPage } from './pages/studio-page'

function App() {
  return (
    <SiteLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteLayout>
  )
}

export default App
