import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SupabaseDebug: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    setSession(data?.session || null);
    if (error) setLastResult({ error });
  };

  const loadUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    setUser(data?.user || null);
    if (error) setLastResult({ error });
  };

  const testRead = async () => {
    const { data, error } = await supabase.from('products').select('*').limit(3);
    setLastResult({ data, error });
  };

  const testInsert = async () => {
    // Insert a small debug row. Adjust required fields if you have NOT NULL constraints.
    const payload = { slug: 'debug-' + Date.now(), price: 1, store_id: 'debug-store' };
    const { data, error } = await supabase.from('products').insert([payload]).select();
    setLastResult({ data, error });
  };

  const showLocalStorage = () => {
    const keys = Object.keys(localStorage).filter(k => k.toLowerCase().includes('supabase') || k.toLowerCase().includes('sb'));
    const obj: Record<string, string> = {};
    keys.forEach(k => { obj[k] = localStorage.getItem(k) as string; });
    setLastResult({ localStorage: obj });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug</h1>

      <div className="mb-4">
        <button className="btn mr-2 px-3 py-1 bg-slate-700 text-white rounded" onClick={refreshSession}>Get Session</button>
        <button className="btn mr-2 px-3 py-1 bg-slate-700 text-white rounded" onClick={loadUser}>Get User</button>
        <button className="btn mr-2 px-3 py-1 bg-slate-700 text-white rounded" onClick={showLocalStorage}>Show localStorage</button>
      </div>

      <div className="mb-4">
        <button className="btn mr-2 px-3 py-1 bg-green-600 text-white rounded" onClick={testRead}>Test Read (products)</button>
        <button className="btn mr-2 px-3 py-1 bg-red-600 text-white rounded" onClick={testInsert}>Test Insert (products)</button>
      </div>

      <section className="bg-muted p-4 rounded">
        <h2 className="font-semibold mb-2">Results</h2>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 400, overflow: 'auto' }}>{JSON.stringify({ session, user, lastResult }, null, 2)}</pre>
      </section>
    </div>
  );
};

export default SupabaseDebug;
