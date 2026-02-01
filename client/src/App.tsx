import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import WelcomePage from './pages/WelcomePage'
import SetupPage from './pages/SetupPage'
import { OnboardingProvider } from './pages/OnboardingContext'
import categoryService from './services/categoryService'
import userProfileService from './services/userProfileService'
import type { Category } from './types'
import './App.css'

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'setup' | 'dashboard'>('welcome')
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      // Check onboarding status
      const status = await userProfileService.checkOnboardingStatus()
      setOnboardingCompleted(status.completed)
      
      if (status.completed) {
        setOnboardingStep('dashboard')
      }

      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingNavigate = (page: 'welcome' | 'setup' | 'dashboard') => {
    setOnboardingStep(page)
    if (page === 'dashboard') {
      setOnboardingCompleted(true)
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

  // Show onboarding flow if not completed
  if (!onboardingCompleted) {
    return (
      <OnboardingProvider navigate={handleOnboardingNavigate}>
        {onboardingStep === 'welcome' && <WelcomePage />}
        {onboardingStep === 'setup' && <SetupPage />}
      </OnboardingProvider>
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
