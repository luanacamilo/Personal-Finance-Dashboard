import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import categoryService from './services/categoryService'
import type { Category } from './types'
import './App.css'

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="main-content">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'transactions' && <TransactionsPage categories={categories} />}
        {currentPage === 'wallet' && (
          <div className="page-placeholder">
            <h2>Wallet</h2>
            <p>Under development...</p>
          </div>
        )}
        {currentPage === 'analytics' && (
          <div className="page-placeholder">
            <h2>Revenue Analytics</h2>
            <p>Under development...</p>
          </div>
        )}
        <Footer />
      </main>
    </div>
  )
}

export default App
