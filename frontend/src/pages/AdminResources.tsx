import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Resource {
    _id: string;
    name: string;
    url: string;
    category: string;
}

const AdminResources: React.FC = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [form, setForm] = useState({ _id: '', name: '', url: '', category: 'documentation' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchResources();
    }, [navigate]);

    const fetchResources = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/resources', {
                headers: {
                    'Authorization': token,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setResources(data.resources);
            } else {
                setError(data.message || 'Failed to fetch resources');
            }
        } catch (err) {
            setError('Network error or server is down');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setForm({ ...form, category: value });
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
            ? `http://localhost:3000/api/admin/resources/${form._id}`
            : 'http://localhost:3000/api/admin/resources';
        const method = form._id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    name: form.name,
                    url: form.url,
                    category: form.category
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setForm({ _id: '', name: '', url: '', category: 'documentation' });
                fetchResources(); // Refresh resources list
            } else {
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleEdit = (resource: Resource) => {
        setForm({
            _id: resource._id,
            name: resource.name,
            url: resource.url,
            category: resource.category
        });
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing.');
            return;
        }

        if (!confirm('Are you sure you want to delete this resource?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/resources/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                fetchResources(); // Refresh resources list
            } else {
                setError(data.message || 'Failed to delete resource');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleCancel = () => {
        setForm({ _id: '', name: '', url: '', category: 'documentation' });
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Manage Resources</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-600 text-sm">{message}</p>}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Resource Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                name="url"
                                type="url"
                                value={form.url}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={form.category} onValueChange={handleSelectChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="documentation">Documentation</SelectItem>
                                    <SelectItem value="tool">Tool</SelectItem>
                                    <SelectItem value="tutorial">Tutorial</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">{form._id ? 'Update Resource' : 'Add Resource'}</Button>
                        {form._id && (
                            <Button variant="outline" onClick={handleCancel} type="button">
                                Cancel Edit
                            </Button>
                        )}
                    </form>

                    <Separator />

                    <h3 className="text-xl font-semibold">Existing Resources</h3>
                    {loading ? (
                        <p>Loading resources...</p>
                    ) : resources.length === 0 ? (
                        <p>No resources added yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {resources.map((resource) => (
                                <Card key={resource._id} className="p-4 flex justify-between items-center">
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{resource.name}</h4>
                                        <p className="text-xs font-semibold text-gray-500 mb-2">
                                            {resource.category.toUpperCase()}
                                        </p>
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline text-sm break-all"
                                        >
                                            {resource.url}
                                        </a>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Button variant="outline" onClick={() => handleEdit(resource)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => handleDelete(resource._id)}>Delete</Button>
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

export default AdminResources;