import { useState, useEffect } from 'react'
import { User, UserRole } from '@bluecarbon/shared'

// Mock auth hook - replace with actual Firebase auth
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedRole = (localStorage.getItem('mock_role') as UserRole) || 'ADMIN'
      setUser({
        id: '1',
        name: storedRole === 'ADMIN' ? 'Admin User' : 'Company User',
        email: storedRole === 'ADMIN' ? 'admin@example.com' : 'company@example.com',
        phone: '+91-9876543210',
        role: storedRole,
        organization: storedRole === 'ADMIN' ? 'NCCR' : 'BlueCarbon Foundation',
        region: 'Maharashtra',
        language: 'en',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const login = async (phone: string, _otp: string) => {
    // Mock login
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    const storedRole = (localStorage.getItem('mock_role') as UserRole) || 'ADMIN'
    setUser({
      id: '1',
      name: storedRole === 'ADMIN' ? 'Admin User' : 'Company User',
      email: storedRole === 'ADMIN' ? 'admin@example.com' : 'company@example.com',
      phone,
      role: storedRole,
      organization: storedRole === 'ADMIN' ? 'NCCR' : 'BlueCarbon Foundation',
      region: 'Maharashtra',
      language: 'en',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    setIsLoading(false)
  }

  const switchRole = (role: UserRole) => {
    localStorage.setItem('mock_role', role)
    if (user) {
      setUser({ 
        ...user, 
        role, 
        name: role === 'ADMIN' ? 'Admin User' : 'Company User',
        email: role === 'ADMIN' ? 'admin@example.com' : 'company@example.com',
        organization: role === 'ADMIN' ? 'NCCR' : 'BlueCarbon Foundation' 
      })
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mock_role')
  }

  return {
    user,
    isLoading,
    login,
    logout,
    switchRole
  }
}
