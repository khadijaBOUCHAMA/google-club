import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "AI Workshop: Introduction to Machine Learning",
      date: "2025-11-15",
      time: "14:00 - 17:00",
      location: "Tech Hub, Room 301",
      attendees: 45,
      maxAttendees: 50,
      category: "Workshop",
      color: "primary",
    },
    {
      id: 2,
      title: "Hackathon 2025: Build the Future",
      date: "2025-11-22",
      time: "09:00 - 21:00",
      location: "Innovation Center",
      attendees: 120,
      maxAttendees: 150,
      category: "Hackathon",
      color: "secondary",
    },
    {
      id: 3,
      title: "Google Cloud Platform Deep Dive",
      date: "2025-11-28",
      time: "15:00 - 18:00",
      location: "Virtual Event",
      attendees: 200,
      maxAttendees: 300,
      category: "Tech Talk",
      color: "accent",
    },
    {
      id: 4,
      title: "Networking Meetup: Connect & Collaborate",
      date: "2025-12-05",
      time: "18:00 - 20:00",
      location: "Campus Café",
      attendees: 30,
      maxAttendees: 40,
      category: "Networking",
      color: "success",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Google Club Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our exciting events, workshops, and networking opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-6 hover:shadow-google transition-smooth"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge variant={event.color === "primary" ? "default" : "secondary"}>
                  {event.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees}/{event.maxAttendees}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">{event.title}</h3>

              <div className="space-y-2 mb-6 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Register Now</Button>
                <Button variant="outline">Details</Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-hero inline-block">
            <h2 className="text-2xl font-bold mb-4">
              Want to Host an Event?
            </h2>
            <p className="text-muted-foreground mb-6">
              Share your knowledge and organize events for the community
            </p>
            <Button size="lg">Propose an Event</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Events;
