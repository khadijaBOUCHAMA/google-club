import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Lightbulb, Users, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // Fallback to mock data if API fails
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data
      setNotifications(mockNotifications);
      toast({
        title: "Error",
        description: "Failed to load notifications, showing demo data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mockNotifications = [
    {
      _id: 1,
      type: "event",
      title: "New Event: AI Workshop Tomorrow",
      message: "Don't forget! AI Workshop starts at 2 PM in Tech Hub",
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      _id: 2,
      type: "idea",
      title: "Your idea received 10 new likes",
      message: "AI-Powered Study Assistant is getting popular!",
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      _id: 3,
      type: "admin",
      title: "5 new members joined Google Club",
      message: "Welcome our newest members to the community",
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      _id: 4,
      type: "event",
      title: "Event Registration Confirmed",
      message: "You're registered for Hackathon 2025",
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      _id: 5,
      type: "idea",
      title: "New comment on your idea",
      message: "Emma Wilson commented on Campus Event App",
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case "primary":
        return "text-primary";
      case "accent":
        return "text-accent";
      case "success":
        return "text-success";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              View All Your Activity Updates
            </p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              const token = localStorage.getItem('token');
              if (!token) return;

              try {
                await fetch('http://localhost:3000/api/notifications/read-all', {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });
                // Refresh notifications
                fetchNotifications();
                toast({
                  title: "Success",
                  description: "All notifications marked as read",
                });
              } catch (error) {
                console.error('Error marking all read:', error);
                toast({
                  title: "Error",
                  description: "Failed to mark notifications as read",
                  variant: "destructive",
                });
              }
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        <div className="space-y-3">
          {(notifications.length > 0 ? notifications : mockNotifications).map((notification) => {
            const getIcon = (type) => {
              switch (type) {
                case 'event':
                  return Calendar;
                case 'idea':
                  return Lightbulb;
                case 'admin':
                  return Users;
                default:
                  return Bell;
              }
            };

            const getColor = (type) => {
              switch (type) {
                case 'event':
                  return 'primary';
                case 'idea':
                  return 'accent';
                case 'admin':
                  return 'success';
                default:
                  return 'foreground';
              }
            };

            const Icon = getIcon(notification.type);
            const color = getColor(notification.type);
            const isUnread = !notification.read;
            const timeAgo = new Date(notification.createdAt).toLocaleString();

            return (
              <Card
                key={notification._id}
                className={`p-4 transition-smooth hover:shadow-card ${isUnread ? "border-l-4 border-l-primary" : ""
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${isUnread ? "bg-primary/10" : ""
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${getIconColor(color)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold">
                        {notification.title}
                        {isUnread && (
                          <Badge variant="default" className="ml-2 text-xs">
                            New
                          </Badge>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
