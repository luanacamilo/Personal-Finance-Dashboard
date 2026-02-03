import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import userProfileService from '../../services/userProfileService';
import { useNavigate } from '../OnboardingContext';
import './SetupPage.css';

export default function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    main_salary: '',
    other_income: '',
    periodicity: 'monthly' as 'monthly' | 'biweekly',
    savings_goal: '',
    investment_goal: '',
    emergency_fund_goal: ''
  });

  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d.]/g, '');
    
    if (!numericValue) return '';
    
    const number = parseFloat(numericValue);
    
    if (isNaN(number)) return '';
    
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const handleCurrencyChange = (field: string, value: string) => {

    const cleanValue = value.replace(/[^\d.]/g, '');
    setFormData({ ...formData, [field]: cleanValue });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.main_salary || parseFloat(formData.main_salary) <= 0) {
        notifications.show({
          title: 'Validation Error',
          message: 'Please enter your main salary',
          color: '#2c3e50',
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Saving profile with data:', {
        main_salary: parseFloat(formData.main_salary),
        other_income: formData.other_income ? parseFloat(formData.other_income) : 0,
        periodicity: formData.periodicity,
        savings_goal: formData.savings_goal ? parseFloat(formData.savings_goal) : 0,
        investment_goal: formData.investment_goal ? parseFloat(formData.investment_goal) : 0,
        emergency_fund_goal: formData.emergency_fund_goal ? parseFloat(formData.emergency_fund_goal) : 0,
      });

      const response = await userProfileService.saveProfile({
        main_salary: parseFloat(formData.main_salary),
        other_income: formData.other_income ? parseFloat(formData.other_income) : 0,
        periodicity: formData.periodicity,
        savings_goal: formData.savings_goal ? parseFloat(formData.savings_goal) : 0,
        investment_goal: formData.investment_goal ? parseFloat(formData.investment_goal) : 0,
        emergency_fund_goal: formData.emergency_fund_goal ? parseFloat(formData.emergency_fund_goal) : 0,
      });

      console.log('Profile saved successfully:', response);

      notifications.show({
        title: 'Success',
        message: 'Profile created successfully!',
        color: '#2c3e50',
      });

      navigate('dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save profile',
        color: 'red',
      });
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-container">
        {step === 1 ? (
          <>
            <div className="setup-icon">
              <svg width="100" height="100" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" fill="#d4edda" />
                <path d="M70 100 L90 120 L130 80" stroke="#27ae60" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="50" y="130" width="100" height="40" rx="8" fill="#27ae60" opacity="0.8"/>
                <rect x="60" y="135" width="80" height="30" rx="5" fill="white"/>
              </svg>
            </div>

            <h1>Let's Start!</h1>
            <p className="setup-description">Tell us about your income to personalize your experience</p>

            <div className="form-group">
              <label>Main Salary ($) *</label>
              <input
                type="text"
                value={formatCurrency(formData.main_salary)}
                onChange={(e) => handleCurrencyChange('main_salary', e.target.value)}
                placeholder="e.g., 5,000.00"
              />
            </div>

            <div className="form-group">
              <label>Other Income ($)</label>
              <input
                type="text"
                value={formatCurrency(formData.other_income)}
                onChange={(e) => handleCurrencyChange('other_income', e.target.value)}
                placeholder="e.g., 500.00"
              />
            </div>

            <div className="form-group">
              <label>Periodicity *</label>
              <div className="radio-group-setup">
                <label className={formData.periodicity === 'monthly' ? 'active' : ''}>
                  <input
                    type="radio"
                    value="monthly"
                    checked={formData.periodicity === 'monthly'}
                    onChange={(e) => setFormData({ ...formData, periodicity: e.target.value as 'monthly' })}
                  />
                  <span>Monthly</span>
                </label>
                <label className={formData.periodicity === 'biweekly' ? 'active' : ''}>
                  <input
                    type="radio"
                    value="biweekly"
                    checked={formData.periodicity === 'biweekly'}
                    onChange={(e) => setFormData({ ...formData, periodicity: e.target.value as 'biweekly' })}
                  />
                  <span>Biweekly</span>
                </label>
              </div>
            </div>

            <button className="btn-continue" onClick={handleNext}>
              Continue
            </button>
          </>
        ) : (
          <>
            <div className="setup-icon">
              <svg width="100" height="100" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" fill="#d1ecf1" />
                <path d="M100 50 L100 150 M50 100 L150 100" stroke="#17a2b8" strokeWidth="12" strokeLinecap="round"/>
                <circle cx="100" cy="70" r="15" fill="#17a2b8"/>
                <circle cx="70" cy="100" r="15" fill="#17a2b8"/>
                <circle cx="130" cy="100" r="15" fill="#17a2b8"/>
              </svg>
            </div>

            <h1>Set Your Goals</h1>
            <p className="setup-description">Define your financial objectives (optional)</p>

            <div className="form-group">
              <label>Savings Goal ($)</label>
              <input
                type="text"
                value={formatCurrency(formData.savings_goal)}
                onChange={(e) => handleCurrencyChange('savings_goal', e.target.value)}
                placeholder="e.g., 10,000.00"
              />
            </div>

            <div className="form-group">
              <label>Investment Goal ($)</label>
              <input
                type="text"
                value={formatCurrency(formData.investment_goal)}
                onChange={(e) => handleCurrencyChange('investment_goal', e.target.value)}
                placeholder="e.g., 5,000.00"
              />
            </div>

            <div className="form-group">
              <label>Emergency Fund Goal ($)</label>
              <input
                type="text"
                value={formatCurrency(formData.emergency_fund_goal)}
                onChange={(e) => handleCurrencyChange('emergency_fund_goal', e.target.value)}
                placeholder="e.g., 15,000.00"
              />
            </div>

            <div className="button-group">
              <button className="btn-back" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-continue" onClick={handleNext}>
                Finish
              </button>
            </div>
          </>
        )}

        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}
