import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { Assistant } from '@/pages/Assistant'
import { KnowledgeBase } from '@/pages/KnowledgeBase'
import { Tickets } from '@/pages/Tickets'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Assistant />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
      </Route>
    </Routes>
  )
}

export default App
