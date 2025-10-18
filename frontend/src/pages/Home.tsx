import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Rocket, Users, Lightbulb, Calendar } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome to Google Club
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Unite and Empower Our Club Members
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Link to="/auth">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline" className="text-lg">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-google transition-smooth">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Events</h3>
              <p className="text-muted-foreground">
                Join exciting workshops, hackathons, and tech talks
              </p>
            </Card>
            <Card className="p-6 hover:shadow-google transition-smooth">
              <Lightbulb className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Idea Wall</h3>
              <p className="text-muted-foreground">
                Share your innovative ideas with the community
              </p>
            </Card>
            <Card className="p-6 hover:shadow-google transition-smooth">
              <Users className="h-12 w-12 text-success mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Connect with like-minded tech enthusiasts
              </p>
            </Card>
            <Card className="p-6 hover:shadow-google transition-smooth">
              <Rocket className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resources</h3>
              <p className="text-muted-foreground">
                Access learning materials and project guides
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-google">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Join?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Become part of our vibrant community and unlock endless opportunities
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg">
              Create an Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
