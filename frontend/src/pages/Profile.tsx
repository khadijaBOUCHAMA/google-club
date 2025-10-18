import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Edit } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Manage Your Profile</h1>

        <Card className="p-8 mb-6 shadow-card">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-gradient-google text-white text-2xl">
                JD
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  defaultValue="john.doe@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Tell us about yourself..."
                defaultValue="Passionate about technology and innovation. Love attending tech events!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                placeholder="e.g., AI, Web Development, Cloud Computing"
                defaultValue="AI, Machine Learning, Web Development"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
