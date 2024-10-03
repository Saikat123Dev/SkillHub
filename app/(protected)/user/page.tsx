// pages/users.tsx
"use client"
import { useEffect, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    birthday?: string;
    primarySkill?: string;
    secondarySkills?: string;
    country?: string;
    about?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    class10?: string;
    percentage_10?: string;
    class12?: string;
    percentage_12?: string;
    college?: string;
    currentYear?: string;
    dept?: string;
    domain?: string;
    profilePic?: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users'); // Adjust this path if needed
                if (!response.ok) {
                    const data = await response.json();
                    console.log(data)
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <h2>{user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Username: {user.username}</p>
                        <p>Country: {user.country}</p>
                        <p>Primary Skill: {user.primarySkill}</p>
                        <p>About: {user.about}</p>
                        <p>Location: {user.location}</p>
                        <p>LinkedIn: {user.linkedin}</p>
                        <p>GitHub: {user.github}</p>
                        <p>Twitter: {user.twitter}</p>
                        <p>Class 10: {user.class10} - {user.percentage_10}%</p>
                        <p>Class 12: {user.class12} - {user.percentage_12}%</p>
                        <p>College: {user.college}</p>
                        <p>Current Year: {user.currentYear}</p>
                        <p>Department: {user.dept}</p>
                        <p>Domain: {user.domain}</p>

                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersPage;
