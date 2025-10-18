import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Video, FileText, ExternalLink, Download } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      id: 1,
      title: "Getting Started with Google Cloud",
      description:
        "Comprehensive guide to start your journey with Google Cloud Platform",
      type: "Documentation",
      icon: FileText,
      link: "#",
      category: "Cloud",
      color: "primary",
    },
    {
      id: 2,
      title: "Machine Learning Crash Course",
      description: "Free video course on ML fundamentals by Google",
      type: "Video Course",
      icon: Video,
      link: "#",
      category: "AI/ML",
      color: "secondary",
    },
    {
      id: 3,
      title: "Web Development Best Practices",
      description: "Essential guide for modern web development with examples",
      type: "Tutorial",
      icon: Book,
      link: "#",
      category: "Web Dev",
      color: "success",
    },
    {
      id: 4,
      title: "Android Development Fundamentals",
      description: "Build your first Android app with Kotlin",
      type: "Documentation",
      icon: FileText,
      link: "#",
      category: "Mobile",
      color: "accent",
    },
    {
      id: 5,
      title: "Google Cloud Architecture Framework",
      description: "Design and build scalable cloud solutions",
      type: "Guide",
      icon: Book,
      link: "#",
      category: "Cloud",
      color: "primary",
    },
    {
      id: 6,
      title: "TensorFlow 2.0 Complete Course",
      description: "Deep learning with TensorFlow - from basics to advanced",
      type: "Video Course",
      icon: Video,
      link: "#",
      category: "AI/ML",
      color: "secondary",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Google Club Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access curated learning materials, guides, and tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card
                key={resource.id}
                className="p-6 hover:shadow-google transition-smooth flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-google flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary">{resource.type}</Badge>
                </div>

                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">{resource.category}</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-hero inline-block">
            <h2 className="text-2xl font-bold mb-4">
              Can't Find What You Need?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Request specific resources or suggest additions to our library
            </p>
            <Button size="lg">Request Resource</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
