import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, BarChart3, Users, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardTitle } from '../components/ui/Card'

const features = [
  {
    icon: Compass,
    title: 'Personalized Assessments',
    description: 'Discover your strengths, interests, and career aptitudes through scientifically designed assessments.',
  },
  {
    icon: BarChart3,
    title: 'AI-Powered Recommendations',
    description: 'Get tailored career recommendations based on your unique profile and market demand.',
  },
  {
    icon: Users,
    title: 'Expert Learning Paths',
    description: 'Follow curated learning paths designed by industry experts to reach your career goals.',
  },
  {
    icon: Zap,
    title: 'Track Your Progress',
    description: 'Monitor your growth, celebrate milestones, and stay motivated on your career journey.',
  },
]

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect Career Path
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Chanakya&apos;s Compass guides you through personalized career assessments, learning
            paths, and expert recommendations to achieve your professional goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Get Started
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent>
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Icon size={28} className="text-blue-600" />
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who have found their ideal career path with Chanakya&apos;s
              Compass.
            </p>
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Create Free Account
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} Chanakya&apos;s Compass. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/admin-login" className="hover:text-gray-700 transition-colors">
              Admin
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Landing
