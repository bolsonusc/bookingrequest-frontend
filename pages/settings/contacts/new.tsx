import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, FileText } from 'lucide-react';

const AddNewContact = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSaveContact = async () => {
    if (!validateForm()) return;

    const token = sessionStorage.getItem('token');
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res?.json();
      if (data?.error) {
        throw new Error(data.error);
      }
      
      // Success - navigate back to contacts list
      router.push('/settings/contacts');
    } catch (error: any) {
      console.error('Error creating contact:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className='bg-[#0B0C0E] text-white min-h-screen'>
      <Head>
        <title>Add New Contact</title>
        <meta name="description" content="Add New Contact" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="w-[90vw] pb-5 pt-10 mx-auto border-b border-gray-700 flex flex-row items-center gap-4">
        <button className='cursor-pointer' onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className='font-normal text-lg leading-7 text-white'>Add New Contact</h1>
          <p className="text-sm text-gray-400">Create a new contact in your network</p>
        </div>
      </header>

      <div className="w-[90vw] mx-auto mt-8 max-w-4xl">
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Name Field */}
          <div className="bg-gray-800/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium text-white">Name</h3>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter contact name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="bg-gray-800/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium text-white">Email</h3>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter email address"
            />
          </div>

          {/* Phone Field */}
          <div className="bg-gray-800/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium text-white">Phone Number</h3>
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter phone number"
            />
          </div>

          {/* Address Field */}
          <div className="bg-gray-800/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium text-white">Address</h3>
            </div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter address"
            />
          </div>

          {/* Notes Field */}
          <div className="bg-gray-800/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium text-white">Notes</h3>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Add any additional information"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 pb-10">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContact}
              disabled={loading || !formData.name.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Contact'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewContact;