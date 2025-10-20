import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Edit, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/auth');
      return;
    }

    setIsLoggedIn(true);
    setUserEmail(email || '');
    setUserRole(role || '');

    // Initialize with some default data
    setFirstName('');
    setLastName('');
    setBio('');
    setInterests('');
  }, [navigate]);

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  if (!isLoggedIn) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Your Profile</h1>
          <Button onClick={handleLogout} variant="destructive" className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="p-6 mb-6 shadow-card border-2 border-primary/20">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gradient-google text-white text-2xl">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Logged In User</h2>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Email:</span> {userEmail}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Role:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${userRole === 'admin'
                      ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                      : 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                    }`}>
                    {userRole === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Profile Card */}
        <Card className="p-8 mb-6 shadow-card">
          <h2 className="text-2xl font-bold mb-6">Edit Profile Information</h2>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Read-only)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={userEmail}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                placeholder="e.g., AI, Web Development, Cloud Computing"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
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

        {/* Account Settings Card */}
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
