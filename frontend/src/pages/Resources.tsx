import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Video, FileText, ExternalLink, Download, Upload } from "lucide-react";

interface Resource {
  _id: string;
  name: string;
  url?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  category: string;
  uploadedBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/admin/resources');
      const data = await response.json();

      if (response.ok) {
        setResources(data.resources);
      } else {
        setError('Failed to load resources');
        // Fallback to mock data
        setResources([
          {
            _id: '1',
            name: "Getting Started with Google Cloud",
            description: "Comprehensive guide to start your journey with Google Cloud Platform",
            type: "Documentation",
            icon: FileText,
            url: "#",
            category: "Cloud",
            color: "primary",
          },
          {
            _id: '2',
            name: "Machine Learning Crash Course",
            description: "Free video course on ML fundamentals by Google",
            type: "Video Course",
            icon: Video,
            url: "#",
            category: "AI/ML",
            color: "secondary",
          },
          {
            _id: '3',
            name: "Web Development Best Practices",
            description: "Essential guide for modern web development with examples",
            type: "Tutorial",
            icon: Book,
            url: "#",
            category: "Web Dev",
            color: "success",
          },
          {
            _id: '4',
            name: "Android Development Fundamentals",
            description: "Build your first Android app with Kotlin",
            type: "Documentation",
            icon: FileText,
            url: "#",
            category: "Mobile",
            color: "accent",
          },
          {
            _id: '5',
            name: "Google Cloud Architecture Framework",
            description: "Design and build scalable cloud solutions",
            type: "Guide",
            icon: Book,
            url: "#",
            category: "Cloud",
            color: "primary",
          },
          {
            _id: '6',
            name: "TensorFlow 2.0 Complete Course",
            description: "Deep learning with TensorFlow - from basics to advanced",
            type: "Video Course",
            icon: Video,
            url: "#",
            category: "AI/ML",
            color: "secondary",
          },
        ] as any);
      }
    } catch (err) {
      setError('Network error');
      // Fallback to mock data
      setResources([
        {
          _id: '1',
          name: "Getting Started with Google Cloud",
          description: "Comprehensive guide to start your journey with Google Cloud Platform",
          type: "Documentation",
          icon: FileText,
          url: "#",
          category: "Cloud",
          color: "primary",
        },
        {
          _id: '2',
          name: "Machine Learning Crash Course",
          description: "Free video course on ML fundamentals by Google",
          type: "Video Course",
          icon: Video,
          url: "#",
          category: "AI/ML",
          color: "secondary",
        },
        {
          _id: '3',
          name: "Web Development Best Practices",
          description: "Essential guide for modern web development with examples",
          type: "Tutorial",
          icon: Book,
          url: "#",
          category: "Web Dev",
          color: "success",
        },
        {
          _id: '4',
          name: "Android Development Fundamentals",
          description: "Build your first Android app with Kotlin",
          type: "Documentation",
          icon: FileText,
          url: "#",
          category: "Mobile",
          color: "accent",
        },
        {
          _id: '5',
          name: "Google Cloud Architecture Framework",
          description: "Design and build scalable cloud solutions",
          type: "Guide",
          icon: Book,
          url: "#",
          category: "Cloud",
          color: "primary",
        },
        {
          _id: '6',
          name: "TensorFlow 2.0 Complete Course",
          description: "Deep learning with TensorFlow - from basics to advanced",
          type: "Video Course",
          icon: Video,
          url: "#",
          category: "AI/ML",
          color: "secondary",
        },
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    if (!resource.filePath) return;

    try {
      const response = await fetch(`http://localhost:3000/uploads/${resource.filePath.split('/').pop()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resource.fileName || resource.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download file');
      }
    } catch (err) {
      console.error('Network error during download');
    }
  };

  const handleView = (resource: Resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else if (resource.filePath) {
      // For files, try to open in new tab if it's viewable
      const viewableTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'image/gif'];
      if (resource.mimeType && viewableTypes.includes(resource.mimeType)) {
        window.open(`http://localhost:3000/uploads/${resource.filePath.split('/').pop()}`, '_blank');
      } else {
        handleDownload(resource);
      }
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getIconForResource = (resource: Resource) => {
    if (resource.fileName) {
      return Upload;
    }
    return FileText;
  };

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

        {loading ? (
          <div className="text-center">Loading resources...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource: any) => {
              const Icon = resource.icon || getIconForResource(resource);
              return (
                <Card
                  key={resource._id}
                  className="p-6 hover:shadow-google transition-smooth flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-google flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary">{resource.category || resource.type}</Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{resource.name}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {resource.description || 'No description available'}
                  </p>

                  {resource.fileName && (
                    <div className="text-sm text-gray-600 mb-2">
                      File: {resource.fileName}
                      {resource.fileSize && (
                        <span className="ml-2">({formatFileSize(resource.fileSize)})</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{resource.category || 'Other'}</Badge>
                    <div className="flex gap-2">
                      {resource.filePath ? (
                        <Button size="sm" onClick={() => handleDownload(resource)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleView(resource)}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

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
