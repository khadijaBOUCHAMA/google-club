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
    id: string;
    message: string;
    type: string; // e.g., 'info', 'warning', 'error'
}

const AdminNotifications: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [form, setForm] = useState({ id: '', message: '', type: 'info' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
        }
        // In a real app, fetch existing notifications here
    }, [navigate]);

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

        const url = form.id ? `http://localhost:3000/api/admin/notifications/${form.id}` : 'http://localhost:3000/api/admin/notifications';
        const method = form.id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setForm({ id: '', message: '', type: 'info' }); // Clear form
                // In a real app, refresh notifications list
            } else {
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleEdit = (notification: Notification) => {
        setForm(notification);
    };

    const handleDelete = async (id: string) => {
        // In a real app, implement DELETE request
        setMessage(`Notification ${id} deleted (frontend simulation)`);
        // In a real app, refresh notifications list
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
                        <Button type="submit">{form.id ? 'Update Notification' : 'Add Notification'}</Button>
                        {form.id && (
                            <Button variant="outline" onClick={() => setForm({ id: '', message: '', type: 'info' })}>
                                Cancel Edit
                            </Button>
                        )}
                    </form>

                    <Separator />

                    <h3 className="text-xl font-semibold">Existing Notifications</h3>
                    {notifications.length === 0 ? (
                        <p>No notifications added yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {notifications.map((notification) => (
                                <Card key={notification.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">{notification.message}</h4>
                                        <p className="text-sm text-gray-500">Type: {notification.type}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => handleEdit(notification)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => handleDelete(notification.id)}>Delete</Button>
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
