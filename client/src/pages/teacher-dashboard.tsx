import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherDashboard() {
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.displayName}!</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <span className="text-2xl">📝</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 due this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Missions</CardTitle>
              <span className="text-2xl">🏆</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <span className="text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>📚 Create New Assignment</CardTitle>
              <CardDescription>
                Set up new assignments for your students with deadlines and chapters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4">Create Assignment</Button>
              <p className="text-sm text-gray-600">
                Link assignments to specific treasure hunt chapters and set deadlines for point management.
              </p>
            </CardContent>
          </Card>

          {/* Manage Students */}
          <Card>
            <CardHeader>
              <CardTitle>👨‍🎓 Student Progress</CardTitle>
              <CardDescription>
                Monitor student performance and provide support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4">View Progress</Button>
              <p className="text-sm text-gray-600">
                Track student completion rates, scores, and identify students who need help.
              </p>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>🏅 Student Leaderboard</CardTitle>
              <CardDescription>
                View top performing students and encourage competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4">View Leaderboard</Button>
              <p className="text-sm text-gray-600">
                See rankings based on points earned from completed missions and assignments.
              </p>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Class Analytics</CardTitle>
              <CardDescription>
                Get insights into class performance and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4">View Analytics</Button>
              <p className="text-sm text-gray-600">
                Analyze learning patterns, completion rates, and identify areas for improvement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📈 Recent Activity</CardTitle>
            <CardDescription>Latest student submissions and completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">✅</span>
                  <div>
                    <p className="font-medium">Ravi Kumar completed Water Purification Mission</p>
                    <p className="text-sm text-gray-600">Earned 500 XP • 2 hours ago</p>
                  </div>
                </div>
                <span className="text-green-600 font-bold">95%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📝</span>
                  <div>
                    <p className="font-medium">Priya Sharma submitted Assignment #3</p>
                    <p className="text-sm text-gray-600">Energy Conservation • 4 hours ago</p>
                  </div>
                </div>
                <span className="text-blue-600 font-bold">On Time</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-600">⏰</span>
                  <div>
                    <p className="font-medium">Assignment #2 deadline approaching</p>
                    <p className="text-sm text-gray-600">Solar Energy • Due in 2 days</p>
                  </div>
                </div>
                <span className="text-yellow-600 font-bold">8 pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}