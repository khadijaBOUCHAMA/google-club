import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
}

const AdminEvents: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [form, setForm] = useState({ _id: '', title: '', description: '', date: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchEvents();
    }, [navigate]);

    const fetchEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/events', {
                headers: {
                    'Authorization': token,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setEvents(data.events);
            } else {
                setError(data.message || 'Failed to fetch events');
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
            ? `http://localhost:3000/api/admin/events/${form._id}`
            : 'http://localhost:3000/api/admin/events';
        const method = form._id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    date: form.date
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setForm({ _id: '', title: '', description: '', date: '' });
                fetchEvents(); // Refresh events list
            } else {
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleEdit = (event: Event) => {
        setForm({
            _id: event._id,
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0] // Convert ISO date to date input format
        });
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing.');
            return;
        }

        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                fetchEvents(); // Refresh events list
            } else {
                setError(data.message || 'Failed to delete event');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleCancel = () => {
        setForm({ _id: '', title: '', description: '', date: '' });
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Manage Events</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-600 text-sm">{message}</p>}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button type="submit">{form._id ? 'Update Event' : 'Add Event'}</Button>
                        {form._id && (
                            <Button variant="outline" onClick={handleCancel} type="button">
                                Cancel Edit
                            </Button>
                        )}
                    </form>

                    <Separator />

                    <h3 className="text-xl font-semibold">Existing Events</h3>
                    {loading ? (
                        <p>Loading events...</p>
                    ) : events.length === 0 ? (
                        <p>No events added yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {events.map((event) => (
                                <Card key={event._id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">{event.title}</h4>
                                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                                        <p className="text-sm mt-2">{event.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => handleEdit(event)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => handleDelete(event._id)}>Delete</Button>
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

export default AdminEvents;