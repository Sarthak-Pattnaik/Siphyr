import { useEffect, useState } from "react";
import type { User } from "../types";

interface Props {
    selectedUser: User | null;
    setSelectedUser: (user: User) => void;
}

export default function UserSelect({ selectedUser, setSelectedUser }: Props) {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then(res => res.json())
            .then(setUsers);
    }, []);

    return (
        <select
            value={selectedUser?.id || ""}
            onChange={(e) => {
                const selected = users.find(u => u.id === e.target.value);
                if (selected) setSelectedUser(selected);
            }}
            className="border p-2"
        >
            <option value="">Select User</option>
            {users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.username}
                </option>
            ))}
        </select>
    );
}
