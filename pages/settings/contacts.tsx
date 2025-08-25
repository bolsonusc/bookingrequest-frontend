import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Plus, Mail, Phone } from 'lucide-react';
import { getId } from '../dashboard/profile';


const Contacts = () => {

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    const token = sessionStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await res?.json();
      if (data?.error) {
        throw new Error(data.error);
      }

      // API returns { real_users, non_users, all } - we want all contacts
      const allContacts = data.all || [];

      // Transform API data to match UI format
      const transformedContacts = allContacts.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        initials: getInitials(contact.name),
        timestamp: getRelativeTime(contact.created_at || contact.updated_at),
        address: contact.address,
        notes: contact.notes
      }));

      setContacts(transformedContacts);
      setError(null);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return "1 week ago";
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleAddNew = () => {
    router.push('/settings/contacts/new');
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center'>
      <Head>
        <title>Contacts</title>
        <meta name="description" content="Account Status" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Manage Contacts</p>
      </header>
      <div className="min-h-screen  ">
        {/* Search Bar and Add New Button */}
        <div className="w-[70vw] mx-auto mt-6 flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border-1 border-solid border-[#444444] bg-[#1E1E1E] rounded-md text-white text-sm  focus:outline-none focus:ring-2  focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleAddNew}
            className=" flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>

        {/* Contacts List */}
        <div className="w-[70vw] mx-auto mt-6 space-y-4 mb-10">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
              <p className="text-red-400 mb-2">Failed to load contacts</p>
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={fetchContacts}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                {searchTerm ? "No contacts found matching your search" : "No contacts found"}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Add Your First Contact
                </button>
              )}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => router.push(`/settings/contacts/${contact.id}`)}
                className="bg-[#18191d] border-1 border-solid border-[#44444496] rounded-lg p-3 flex items-center gap-4 hover:bg-transparent transition-colors cursor-pointer"
              >
                {/* Avatar with Initials */}
                <div className="w-12 h-12 bg-[#22252a] rounded-full flex items-center justify-center text-white  text-l">
                  {contact.initials}
                </div>

                {/* Contact Info */}
                <div className="flex-1">
                  <h3 className="text-white  text-lg mb-1">{contact.name}</h3>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span className='text-white-200'>{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span className='text-white-200'>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-gray-400 text-sm">
                  {contact.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Contacts;