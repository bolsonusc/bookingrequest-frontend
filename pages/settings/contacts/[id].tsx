import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit, User, Mail, Phone, MapPin, FileText, Calendar, Receipt } from 'lucide-react';

const ContactDetail = () => {
  const router = useRouter();
  const { id: contactId } = router.query;
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const fetchContactDetail = async (id: string) => {
    const token = sessionStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await res?.json();
      if (data?.error) {
        throw new Error(data.error);
      }
      
      setContact(data);
      setEditForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        notes: data.notes || ''
      });
      setError(null);
    } catch (error: any) {
      console.error('Error fetching contact:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async () => {
    const token = sessionStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm)
      });
      const data = await res?.json();
      if (data?.error) {
        throw new Error(data.error);
      }
      
      setContact(data);
      setIsEditing(false);
      setError(null);
    } catch (error: any) {
      console.error('Error updating contact:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = () => {
    console.log('Create booking for contact:', contact?.id);
    // TODO: Navigate to booking creation page
  };

  const handleCreateInvoice = () => {
    console.log('Create invoice for contact:', contact?.id);
    // TODO: Navigate to invoice creation page
  };

  useEffect(() => {
    if (contactId && typeof contactId === 'string') {
      fetchContactDetail(contactId);
    }
  }, [contactId]);

  if (!contactId) {
    return (
      <div className='bg-[#0B0C0E] text-white min-h-screen flex items-center justify-center'>
        <div className="text-center">
          <p className="text-red-400 mb-4">Contact ID not found</p>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#0B0C0E] text-white min-h-screen'>
      <Head>
        <title>Contact Details</title>
        <meta name="description" content="Contact Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="w-[90vw] pb-5 pt-10 mx-auto border-b border-gray-700 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <button className='cursor-pointer' onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className='font-normal text-lg leading-7 text-white'>Contact Details</h1>
            <p className="text-sm text-gray-400">View contact information</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Edit size={16} />
          Edit
        </button>
      </header>

      <div className="w-[90vw] mx-auto mt-8 max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-2">Failed to load contact details</p>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button 
              onClick={() => contactId && typeof contactId === 'string' && fetchContactDetail(contactId)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : contact ? (
          <div className="space-y-6">
            {/* Name Field */}
            <div className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium text-white">Name</h3>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter name"
                />
              ) : (
                <p className="text-gray-200 text-lg">{contact.name || 'No name provided'}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium text-white">Email</h3>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter email"
                />
              ) : (
                <p className="text-gray-200 text-lg">{contact.email || 'No email provided'}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium text-white">Phone Number</h3>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-gray-200 text-lg">{contact.phone || 'No phone provided'}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium text-white">Address</h3>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter address"
                />
              ) : (
                <p className="text-gray-200 text-lg">{contact.address || 'No address provided'}</p>
              )}
            </div>

            {/* Notes Field */}
            <div className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium text-white">Notes</h3>
              </div>
              {isEditing ? (
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  rows={4}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Enter notes"
                />
              ) : (
                <p className="text-gray-200 text-lg whitespace-pre-wrap">
                  {contact.notes || 'No notes provided'}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-4 pt-6">
                <button
                  onClick={updateContact}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: contact.name || '',
                      email: contact.email || '',
                      phone: contact.phone || '',
                      address: contact.address || '',
                      notes: contact.notes || ''
                    });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-6">
                <button
                  onClick={handleCreateBooking}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
                >
                  <Calendar size={20} />
                  Create Booking
                </button>
                <button
                  onClick={handleCreateInvoice}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
                >
                  <Receipt size={20} />
                  Create Invoice
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContactDetail;