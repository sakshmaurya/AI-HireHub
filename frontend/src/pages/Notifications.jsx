import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Bell, Check, Trash2 } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'application_update',
      title: 'Application Status Updated',
      message: 'Your application for Software Engineer at Google has been shortlisted',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'job_alert',
      title: 'New Job Alert',
      message: 'A new job matching your profile has been posted: Senior Developer at Meta',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: 'Your interview with Amazon is scheduled for tomorrow at 10:00 AM',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      type: 'system',
      title: 'Profile Completed',
      message: 'Your profile is now 100% complete. You can now apply to jobs.',
      time: '2 days ago',
      read: true,
    },
  ];

  const markAsRead = (id) => {
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    console.log('Mark all as read');
  };

  const deleteNotification = (id) => {
    console.log('Delete notification:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button onClick={markAllAsRead} variant="outline" className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-6 ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Bell className={`w-5 h-5 ${!notification.read ? 'text-blue-500' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-400 mt-2">{notification.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Notifications</h3>
            <p className="text-gray-400 mt-2">You're all caught up!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
