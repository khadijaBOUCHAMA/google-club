import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Lightbulb, Users, Check } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "event",
      icon: Calendar,
      title: "New Event: AI Workshop Tomorrow",
      description: "Don't forget! AI Workshop starts at 2 PM in Tech Hub",
      time: "2 hours ago",
      unread: true,
      color: "primary",
    },
    {
      id: 2,
      type: "idea",
      icon: Lightbulb,
      title: "Your idea received 10 new likes",
      description: "AI-Powered Study Assistant is getting popular!",
      time: "5 hours ago",
      unread: true,
      color: "accent",
    },
    {
      id: 3,
      type: "community",
      icon: Users,
      title: "5 new members joined Google Club",
      description: "Welcome our newest members to the community",
      time: "1 day ago",
      unread: false,
      color: "success",
    },
    {
      id: 4,
      type: "event",
      icon: Calendar,
      title: "Event Registration Confirmed",
      description: "You're registered for Hackathon 2025",
      time: "2 days ago",
      unread: false,
      color: "primary",
    },
    {
      id: 5,
      type: "idea",
      icon: Lightbulb,
      title: "New comment on your idea",
      description: "Emma Wilson commented on Campus Event App",
      time: "3 days ago",
      unread: false,
      color: "accent",
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
          <Button variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card
                key={notification.id}
                className={`p-4 transition-smooth hover:shadow-card ${
                  notification.unread ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${
                      notification.unread ? "bg-primary/10" : ""
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${getIconColor(notification.color)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold">
                        {notification.title}
                        {notification.unread && (
                          <Badge variant="default" className="ml-2 text-xs">
                            New
                          </Badge>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
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
