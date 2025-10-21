import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId, eventTitle, eventDate) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "You have been registered for the event. Check your email for confirmation.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to register for event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    }
  };

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
                <Button
                  className="flex-1"
                  onClick={() => handleRegister(event._id, event.title, event.date)}
                >
                  Register Now
                </Button>
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
