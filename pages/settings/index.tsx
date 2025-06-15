import { useEffect, useState } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';

export default function Settings() {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: formData.displayName || user.display_name || '',
        username: formData.username || user.username || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}/username`, {
        method: 'PATCH',
        body: JSON.stringify({
          username: formData.username,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const { error: updateError } = await res.json();

      const dNameRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}/display-name`, {
        method: 'PATCH',
        body: JSON.stringify({
          display_name: formData.displayName,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const { error: updateNameError } = await dNameRes.json();
      
      if (updateError || updateNameError){
        if(updateError?.includes('duplicate key')){
          setError('That username is unavailable, please choose another.');
          return;
        } 
        throw updateError || updateNameError;
      } else {
        alert('Profile updated successfully');
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
      <p><Link href={`/dashboard/${user?.role}`}>Go to dashboard</Link></p>
      <p><Link href={`/auth/2fa-security`}>Add / Edit 2fa security</Link></p>
    </div>
  );
}