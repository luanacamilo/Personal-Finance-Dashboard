import { useState, useEffect } from 'react'
import TransactionsPage from './pages/TransactionsPage'
import categoryService from './services/categoryService'
import type { Category } from './types'
import './App.css'

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

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
          <h2>💰 Personal Finance Dashboard</h2>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>💰 Personal Finance Dashboard</h2>
        </div>
        <div className="nav-links">
          <a href="#" className="active">Transações</a>
          <a href="#">Orçamentos</a>
          <a href="#">Analytics</a>
        </div>
      </nav>

      <main className="main-content">
        <TransactionsPage categories={categories} />
      </main>
    </div>
  )
}

export default App
