import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ThumbsUp, MessageSquare, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const IdeaWall = () => {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: "AI-Powered Study Assistant",
      description:
        "Create an AI chatbot to help students with their coursework and assignments using Google's AI models.",
      author: "Sarah Chen",
      likes: 24,
      comments: 8,
      tags: ["AI", "Education"],
    },
    {
      id: 2,
      title: "Campus Event App",
      description:
        "Mobile app to discover and RSVP to all campus events in one place with calendar integration.",
      author: "Mike Johnson",
      likes: 18,
      comments: 5,
      tags: ["Mobile", "Events"],
    },
    {
      id: 3,
      title: "Sustainability Tracker",
      description:
        "Web app to track and gamify sustainable practices on campus, with team competitions.",
      author: "Emma Wilson",
      likes: 31,
      comments: 12,
      tags: ["Web", "Sustainability"],
    },
  ]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Idea Wall</h1>
            <p className="text-muted-foreground">
              Share and Explore New Ideas
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Share Your Idea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Idea</DialogTitle>
                <DialogDescription>
                  Tell us about your innovative project or concept
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idea-title">Title</Label>
                  <Input
                    id="idea-title"
                    placeholder="Give your idea a catchy title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea-description">Description</Label>
                  <Textarea
                    id="idea-description"
                    rows={4}
                    placeholder="Describe your idea in detail..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea-tags">Tags (comma separated)</Label>
                  <Input
                    id="idea-tags"
                    placeholder="e.g., AI, Web Development, Mobile"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Idea
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {ideas.map((idea) => (
            <Card key={idea.id} className="p-6 hover:shadow-google transition-smooth">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-google flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {idea.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {idea.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      by {idea.author}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {idea.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {idea.comments}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaWall;
