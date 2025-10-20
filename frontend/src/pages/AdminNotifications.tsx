import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Notification {
    _id: string;
    message: string;
    type: string;
}

const AdminNotifications: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [form, setForm] = useState({ _id: '', message: '', type: 'info' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchNotifications();
    }, [navigate]);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/notifications', {
                headers: {
                    'Authorization': token,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setNotifications(data.notifications);
            } else {
                setError(data.message || 'Failed to fetch notifications');
            }
        } catch (err) {
            setError('Network error or server is down');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setForm({ ...form, type: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing.');
            navigate('/admin/login');
            return;
        }

        const url = form._id
            ? `http://localhost:3000/api/admin/notifications/${form._id}`
            : 'http://localhost:3000/api/admin/notifications';
        const method = form._id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    message: form.message,
                    type: form.type
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setForm({ _id: '', message: '', type: 'info' });
                fetchNotifications(); // Refresh notifications list
            } else {
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleEdit = (notification: Notification) => {
        setForm({
            _id: notification._id,
            message: notification.message,
            type: notification.type
        });
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing.');
            return;
        }

        if (!confirm('Are you sure you want to delete this notification?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                fetchNotifications(); // Refresh notifications list
            } else {
                setError(data.message || 'Failed to delete notification');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleCancel = () => {
        setForm({ _id: '', message: '', type: 'info' });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'error': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'success': return 'bg-green-100 text-green-800';
            case 'info': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Manage Notifications</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-600 text-sm">{message}</p>}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="message">Notification Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={form.type} onValueChange={handleSelectChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">{form._id ? 'Update Notification' : 'Add Notification'}</Button>
                        {form._id && (
                            <Button variant="outline" onClick={handleCancel} type="button">
                                Cancel Edit
                            </Button>
                        )}
                    </form>

                    <Separator />

                    <h3 className="text-xl font-semibold">Existing Notifications</h3>
                    {loading ? (
                        <p>Loading notifications...</p>
                    ) : notifications.length === 0 ? (
                        <p>No notifications added yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {notifications.map((notification) => (
                                <Card key={notification._id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">{notification.message}</h4>
                                        <p className={`text-xs font-semibold px-2 py-1 rounded w-fit mt-2 ${getTypeColor(notification.type)}`}>
                                            {notification.type.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => handleEdit(notification)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => handleDelete(notification._id)}>Delete</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminNotifications;