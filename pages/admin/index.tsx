
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../../src/hooks/useAuth';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (!error) setUsers(data);
    };
    fetchUsers();
  }, [supabase]); // Supabase client is stable, no need to include in deps

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Username</th>
              <th className="px-6 py-3 border-b">Type</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 border-b">{user.username}</td>
                <td className="px-6 py-4 border-b">{user.user_type}</td>
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
