import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout
import Layout from './components/layout/Layout'

// Pages will be imported here
// import Dashboard from './pages/Dashboard'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Transactions from './pages/Transactions'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}

        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} /> */}
          <Route index element={<div className="p-8">Dashboard - Coming Soon</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
