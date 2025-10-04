"use client"
import Table from '@/components/Table';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {

  const [activeTable, setActiveTable] = useState<'team' | 'member' | 'judge'>('team');
  const router = useRouter();

  const handleTabClick = (tab: 'team' | 'member' | 'judge') => {
    setActiveTable(tab);
  };

  async function logout() {
    // setLoading(true)

    try {
      const res = await fetch(`/api/login`, { method: "PUT" });

      if (!res.ok) {
        // If backend/route fails, still force logout on client
        const faild = await res.json()
        console.log(JSON.parse(faild.error))
        console.log(`Logout failed: ${JSON.parse(faild.error).message}`);
      }

      // Either way, clear client state and send user to login
      window.location.href = "/admin/login";
    } catch (err) {
      console.log(`Logout error: ${err}`);
      // still redirect to login (so user isn't stuck)
      window.location.href = "/admin/login";
    } finally {
      // setLoading(true)
    }
  }
  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      {/* Logout button at top right */}
      <div className="absolute top-4 right-4 gap-5">
        <button
          // onClick={() => window.location.href = '/admin/register'}
          onClick={() => router.push('/admin/register')}
          className="mx-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
        >
          Register
        </button>
        <button
          onClick={logout}
          className="mx-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          className={`cursor-pointer px-4 py-2 rounded ${activeTable === 'team' ? 'bg-blue-500' : 'bg-gray-600'}`}
          onClick={() => handleTabClick('team')}
        >
          Team
        </button>
        <button
          className={`cursor-pointer px-4 py-2 rounded ${activeTable === 'member' ? 'bg-blue-500' : 'bg-gray-600'}`}
          onClick={() => handleTabClick('member')}
        >
          Member
        </button>
        <button
          className={`cursor-pointer px-4 py-2 rounded ${activeTable === 'judge' ? 'bg-blue-500' : 'bg-gray-600'}`}
          onClick={() => handleTabClick('judge')}
        >
          Judge
        </button>
      </div>

      <Table type={activeTable} />
    </div>
  );
}

export default page
