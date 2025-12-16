import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

// Public pages
import Home from '@/pages/Home'
import Blog from '@/pages/Blog'
import Store from '@/pages/Store'
import Work from '@/pages/Work'
import About from '@/pages/About'
import Login from '@/pages/Login'
import BlogPost from '@/pages/BlogPost'
import Admin from '@/pages/Admin'
import AdminPosts from '@/pages/admin/AdminPosts'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminProjects from '@/pages/admin/AdminProjects'
import AdminMedia from '@/pages/admin/AdminMedia'
import AdminSubscribers from '@/pages/admin/AdminSubscribers'
import AdminAnalytics from '@/pages/admin/AdminAnalytics'
import AdminSettings from '@/pages/admin/AdminSettings'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/store" element={<Store />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="posts" element={<AdminPosts />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
