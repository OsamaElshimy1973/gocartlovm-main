import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AccountDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tab, setTab] = useState<'profile' | 'security' | 'billing'>('profile');
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState((user?.user_metadata as any)?.full_name || '');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
  };

  const saveProfile = async () => {
    if (!user) return;
    try {
      let publicUrl: string | null = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `avatars/${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        publicUrl = data.publicUrl;
      }

      // Upsert into profiles table for consistency
      // Only include columns that are expected across deployments to avoid schema cache errors
      const profileRow: any = {
        id: user.id,
        full_name: name || (user.user_metadata as any)?.full_name || null,
      };
      if (publicUrl) profileRow.avatar_url = publicUrl;

      // Try upsert; if the database has row-level security (RLS) or different
      // schema, the upsert may fail for the client (anon key). Don't fail the
      // whole flow for that — continue to update the auth user metadata which
      // ensures the frontend reflects the change. Log the error for diagnostics.
      try {
        const res = await supabase.from('profiles').upsert(profileRow);
        const upsertError = (res as any).error;
        if (upsertError) {
          // Common RLS error: "new row violates row-level security policy" —
          // surface as warning but continue.
          console.warn('profiles upsert warning:', upsertError);
        }
      } catch (e) {
        console.warn('profiles upsert failed (non-fatal):', e);
      }

      // Update auth user metadata so header/user session reflects change. If
      // this fails, it's a true error we should show to the user.
      const { error: updateUserError } = await supabase.auth.updateUser({ data: { full_name: profileRow.full_name, avatar_url: profileRow.avatar_url } });
      if (updateUserError) throw updateUserError;

      toast({ title: 'Saved', description: 'Profile updated', variant: 'default' });
      // close dialog
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || String(err), variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid grid-cols-12 gap-4">
        <div className="col-span-4 bg-gradient-to-b from-white to-orange-50 rounded-l-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold">{t('account')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('manage_account_info') || 'Manage your account info.'}</p>

            <nav className="mt-6 flex flex-col gap-2">
              <button className={`text-left rounded-md px-3 py-2 ${tab === 'profile' ? 'bg-muted/50' : ''}`} onClick={() => setTab('profile')}>
                {t('profile') || 'Profile'}
              </button>
              <button className={`text-left rounded-md px-3 py-2 ${tab === 'security' ? 'bg-muted/50' : ''}`} onClick={() => setTab('security')}>
                {t('security') || 'Security'}
              </button>
              <button className={`text-left rounded-md px-3 py-2 ${tab === 'billing' ? 'bg-muted/50' : ''}`} onClick={() => setTab('billing')}>
                {t('billing') || 'Billing'}
              </button>
            </nav>
          </div>

          <div className="text-sm text-accent">{t('development_mode') || 'Development mode'}</div>
        </div>

  <div className="col-span-8 bg-background p-6 rounded-r-lg">
          {tab === 'profile' && (
            <div>
              <h4 className="text-lg font-semibold">{t('profile_details') || 'Profile details'}</h4>
              <div className="mt-4 grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-white">{user?.email?.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <label className="block mt-2 text-sm text-muted-foreground">{t('profile')}</label>
                  <input type="file" accept="image/*" onChange={onFileChange} className="mt-2" />
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">{t('full_name') || 'Full name'}</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
                  <div className="mt-4">
                    <label className="text-sm text-muted-foreground">Email addresses</label>
                    <div className="mt-2 text-sm">{user?.email} <span className="ml-2 text-xs px-2 py-1 bg-muted rounded">Primary</span></div>
                    <Button className="mt-3">+ {t('add_email') || 'Add email address'}</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h4 className="text-lg font-semibold">{t('security')}</h4>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{t('password_label') || 'Password'}</p>
                <div className="mt-2">
                  <Button variant="ghost">{t('set_password') || 'Set password'}</Button>
                </div>
              </div>
            </div>
          )}

          {tab === 'billing' && (
            <div>
              <h4 className="text-lg font-semibold">{t('billing')}</h4>
              <div className="mt-4 text-sm text-muted-foreground">{t('manage_billing') || 'Manage your subscription and payment methods.'}</div>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button variant="default" onClick={saveProfile} className="mr-2">Save</Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
