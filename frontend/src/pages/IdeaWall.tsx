import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

const IdeaWall = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/ideas');
      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIdea = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title');
    const description = formData.get('description');
    const tags = formData.get('tags');

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to share your idea.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, tags }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to share idea.",
          variant: "destructive",
        });
        return;
      }

      await fetchIdeas();
      toast({
        title: "Idea Shared!",
        description: "Your idea has been posted successfully.",
      });
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: "Error",
        description: "Failed to share idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (event, ideaId) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const text = formData.get('comment')?.toString().trim();

    if (!text) {
      toast({
        title: "Comment Required",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment on ideas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to add comment.",
          variant: "destructive",
        });
        return;
      }

      await fetchIdeas();
      event.currentTarget.reset();
      toast({
        title: "Comment added",
        description: "Thanks for sharing your thoughts!",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (ideaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like ideas.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For now, just update local state. In a full implementation, you'd have a backend endpoint
      setIdeas(ideas.map(idea =>
        idea._id === ideaId
          ? { ...idea, likes: [...(idea.likes || []), { _id: 'temp' }] } // Simple increment
          : idea
      ));

      toast({
        title: "Liked!",
        description: "You liked this idea.",
      });
    } catch (error) {
      console.error('Error liking idea:', error);
      toast({
        title: "Error",
        description: "Failed to like idea.",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (ideaId) => {
    // For now, just show a toast. In a full implementation, you'd open a comment dialog
    toast({
      title: "Comments",
      description: "Comment feature coming soon!",
    });
  };

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
              <form onSubmit={handleSubmitIdea} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Give your idea a catchy title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe your idea in detail..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
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
            <Card key={idea._id} className="p-6 hover:shadow-google transition-smooth">
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
                    {idea.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      by {idea.author?.email || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(idea._id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {idea.likes?.length || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleComment(idea._id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {idea.comments?.length || 0}
                      </Button>
                    </div>
                  </div>

                  {idea.comments?.length ? (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Comments
                      </h4>
                      <div className="space-y-3">
                        {idea.comments.map((comment) => (
                          <div key={comment._id} className="rounded-md bg-muted p-3">
                            <p className="text-sm text-muted-foreground mb-1">
                              {comment.author?.email || 'User'} —
                              {comment.createdAt ? ` ${new Date(comment.createdAt).toLocaleString()}` : ''}
                            </p>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <form
                    className="mt-4 space-y-2"
                    onSubmit={(event) => handleAddComment(event, idea._id)}
                  >
                    <Textarea
                      name="comment"
                      placeholder="Share your thoughts..."
                      rows={3}
                      required
                      defaultValue=""
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm">
                        Add Comment
                      </Button>
                    </div>
                  </form>
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
