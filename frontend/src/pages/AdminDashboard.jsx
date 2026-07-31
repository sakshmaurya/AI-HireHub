import { Card } from '../components/ui/card';
import { Users, Building2, Briefcase, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '12,453', icon: Users, change: '+12%' },
    { title: 'Total Companies', value: '1,234', icon: Building2, change: '+8%' },
    { title: 'Active Jobs', value: '5,678', icon: Briefcase, change: '+15%' },
    { title: 'Pending Reviews', value: '234', icon: AlertTriangle, change: '-5%' },
  ];

  const recentActivities = [
    { id: 1, type: 'company_verification', message: 'New company verification request', time: '2 min ago' },
    { id: 2, type: 'job_posting', message: 'New job posted by Tech Corp', time: '5 min ago' },
    { id: 3, type: 'user_report', message: 'User reported for violation', time: '10 min ago' },
    { id: 4, type: 'company_verification', message: 'Company verified successfully', time: '15 min ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-500">{stat.change}</p>
                </div>
                <stat.icon className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="w-6 h-6 mb-2" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Building2 className="w-6 h-6 mb-2" />
                <span>Verify Companies</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Briefcase className="w-6 h-6 mb-2" />
                <span>Moderate Jobs</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <AlertTriangle className="w-6 h-6 mb-2" />
                <span>View Reports</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
