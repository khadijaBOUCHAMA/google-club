import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Resource {
    id: string;
    name: string;
    url: string;
    category: string;
}

const AdminResources: React.FC = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [form, setForm] = useState({ id: '', name: '', url: '', category: 'documentation' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
        // In a real app, fetch existing resources here
    }, [navigate]);

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

        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('Authentication token missing.');
            navigate('/admin/login');
            return;
        }

        const url = form.id ? `http://localhost:3000/api/admin/resources/${form.id}` : 'http://localhost:3000/api/admin/resources';
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
                setForm({ id: '', name: '', url: '', category: 'documentation' }); // Clear form
                // In a real app, refresh resources list
            } else {
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Network error or server is down');
        }
    };

    const handleEdit = (resource: Resource) => {
        setForm(resource);
    };

    const handleDelete = async (id: string) => {
        // In a real app, implement DELETE request
        setMessage(`Resource ${id} deleted (frontend simulation)`);
        // In a real app, refresh resources list
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
                        <Button type="submit">{form.id ? 'Update Resource' : 'Add Resource'}</Button>
                        {form.id && (
                            <Button variant="outline" onClick={() => setForm({ id: '', name: '', url: '', category: 'documentation' })}>
                                Cancel Edit
                            </Button>
                        )}
                    </form>

                    <Separator />

                    <h3 className="text-xl font-semibold">Existing Resources</h3>
                    {resources.length === 0 ? (
                        <p>No resources added yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {resources.map((resource) => (
                                <Card key={resource.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">{resource.name}</h4>
                                        <p className="text-sm text-gray-500">Category: {resource.category}</p>
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                                            {resource.url}
                                        </a>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => handleEdit(resource)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => handleDelete(resource.id)}>Delete</Button>
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
