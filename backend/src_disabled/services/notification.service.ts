// Notification service - using in-memory notification for now
// Will be integrated with database later

export const createNotification = async (data: any) => {
  // Placeholder - will be implemented with database
  console.log('Creating notification:', data);
  return data;
};

export const sendNotification = async (userId: string, notification: any, io?: any) => {
  const newNotification = await createNotification({
    recipient: userId,
    ...notification,
  });

  // Emit via socket if available
  if (io) {
    io.sendNotification(userId, newNotification);
  }

  return newNotification;
};

export const sendBulkNotifications = async (
  userIds: string[],
  notification: any,
  io?: any
) => {
  const notifications = await Promise.all(
    userIds.map(userId =>
      createNotification({
        recipient: userId,
        ...notification,
      })
    )
  );

  // Emit via socket if available
  if (io) {
    userIds.forEach(userId => {
      io.sendNotification(userId, notifications.find((n: any) => n.recipient.toString() === userId));
    });
  }

  return notifications;
};

export const createNotification = async (data: {
  recipient: string;
  type: 'job_alert' | 'application_update' | 'interview_scheduled' | 'message' | 'system';
  title: string;
  message: string;
  data?: any;
}) => {
  const notification = await Notification.create(data);
  return notification;
};

export const sendNotification = async (userId: string, notification: any, io?: any) => {
  const newNotification = await createNotification({
    recipient: userId,
    ...notification,
  });

  // Emit via socket if available
  if (io) {
    io.sendNotification(userId, newNotification);
  }

  return newNotification;
};

export const sendBulkNotifications = async (
  userIds: string[],
  notification: any,
  io?: any
) => {
  const notifications = await Promise.all(
    userIds.map(userId =>
      createNotification({
        recipient: userId,
        ...notification,
      })
    )
  );

  // Emit via socket if available
  if (io) {
    userIds.forEach(userId => {
      io.sendNotification(userId, notifications.find(n => n.recipient.toString() === userId));
    });
  }

  return notifications;
};
