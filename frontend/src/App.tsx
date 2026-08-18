import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { RequireAuth, RequireRole } from '@/components/RouteGuards'
import { Assistant } from '@/pages/Assistant'
import { KnowledgeBase } from '@/pages/KnowledgeBase'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { TicketDetail } from '@/pages/TicketDetail'
import { Tickets } from '@/pages/Tickets'
import { Users } from '@/pages/Users'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Assistant />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route element={<RequireRole roles={['Admin']} />}>
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
