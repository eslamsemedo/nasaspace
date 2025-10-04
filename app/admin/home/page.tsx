"use client"
import Table from '@/components/Table';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
  const [activeTable, setActiveTable] = useState<'team' | 'member' | 'judge'>('team');
  const router = useRouter();

  const handleTabClick = (tab: 'team' | 'member' | 'judge') => setActiveTable(tab);

  async function logout() {
    try {
      const res = await fetch(`/api/login`, { method: "PUT" });
      if (!res.ok) {
        const faild = await res.json();
        console.log(JSON.parse(faild.error));
        console.log(`Logout failed: ${JSON.parse(faild.error).message}`);
      }
    } catch (err) {
      console.log(`Logout error: ${err}`);
    } finally {
      window.location.href = "/admin/login";
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* HEADER: buttons flow normally on mobile, become absolute on md+ */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-2 md:pt-8 relative">
        <div className="flex flex-col items-stretch gap-2
                        md:absolute md:top-4 md:right-4 md:flex-row md:items-center md:gap-3">
          <button
            onClick={() => router.push('/admin/register')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow w-full md:w-auto"
          >
            Register
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow w-full md:w-auto"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto w-full max-w-5xl px-4 pb-10">
        {/* Add padding-top so content doesn’t hide under absolute buttons on md+ */}
        <div className="md:pt-14" />

        <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
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
    </div>
  );
}

export default Page;