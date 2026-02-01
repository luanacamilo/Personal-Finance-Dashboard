const API_BASE_URL = 'http://localhost:5000/api';

export interface UserProfile {
  id: number;
  main_salary: number;
  other_income: number;
  periodicity: 'monthly' | 'biweekly';
  savings_goal: number;
  investment_goal: number;
  emergency_fund_goal: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfileInput {
  main_salary: number;
  other_income?: number;
  periodicity: 'monthly' | 'biweekly';
  savings_goal?: number;
  investment_goal?: number;
  emergency_fund_goal?: number;
}

const userProfileService = {
  async getProfile(): Promise<UserProfile | null> {
    const response = await fetch(`${API_BASE_URL}/user/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async saveProfile(data: UserProfileInput): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save profile');
    return response.json();
  },

  async checkOnboardingStatus(): Promise<{ completed: boolean }> {
    const response = await fetch(`${API_BASE_URL}/user/onboarding-status`);
    if (!response.ok) throw new Error('Failed to check onboarding status');
    return response.json();
  },
};

export default userProfileService;
