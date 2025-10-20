import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [adminMessage, setAdminMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/admin/dashboard', {
                    headers: {
                        'Authorization': token,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setAdminMessage(data.message);
                } else {
                    setError(data.message || 'Failed to fetch admin data');
                    localStorage.removeItem('token');
                    navigate('/admin/login');
                }
            } catch (err) {
                setError('Network error or server is down');
                localStorage.removeItem('token');
                navigate('/admin/login');
            }
        };

        verifyAdmin();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/admin/login');
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
                    <CardDescription>Manage events, notifications, and resources.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {adminMessage && <p className="text-green-600 text-lg">{adminMessage}</p>}

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/admin/events">
                            <Button className="w-full h-24 text-lg">Manage Events</Button>
                        </Link>
                        <Link to="/admin/notifications">
                            <Button className="w-full h-24 text-lg">Manage Notifications</Button>
                        </Link>
                        <Link to="/admin/resources">
                            <Button className="w-full h-24 text-lg">Manage Resources</Button>
                        </Link>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                        <Button variant="destructive" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
