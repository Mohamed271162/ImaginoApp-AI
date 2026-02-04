import { ClientProfile } from '@/store/profileStore';
import { Mail, Phone, Shield, User as UserIcon } from 'lucide-react';
import { Activity } from 'react';
import { InfoField } from './ProfileFields';

type Props = {
  profile: ClientProfile;
  onEdit: () => void;
  loadingForgetPassword: boolean;
  onChangePassword: () => void;
};

export default function ProfileInfoView({
  loadingForgetPassword,
  profile,
  onEdit,
  onChangePassword,
}: Props) {
  const fullName = profile.fullName ?? '';

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
          Profile Information
        </h2>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition"
          style={{
            border: '1px solid var(--border)',
            background: 'color-mix(in srgb, var(--card) 100%, transparent)',
            color: 'var(--card-foreground)',
          }}
          aria-label="Edit profile"
        >
          <Shield className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="space-y-4">
        <InfoField label="Full Name" icon={UserIcon} value={fullName} />
        <InfoField label="Email" icon={Mail} value={profile.email} />
        <InfoField label="Phone Number" icon={Phone} value={profile?.phone || ''} />
        <InfoField
          label="Age"
          icon={UserIcon}
          value={profile.age != null ? String(profile.age) : '-'}
        />
        <InfoField label="Gender" icon={UserIcon} value={profile.gender ?? '-'} />

        <div className="pt-2">
          <p className="mb-2 text-xs font-medium text-[color:var(--muted-foreground)]">Security</p>
          <button
            disabled={loadingForgetPassword}
            type="button"
            onClick={onChangePassword}
            className="rounded-md cursor-pointer px-3 py-2 text-xs font-medium transition"
            style={{
              border: '1px solid var(--border)',
              background: 'color-mix(in srgb, var(--card) 100%, transparent)',
              color: 'var(--card-foreground)',
            }}
          >
            <Activity> {loadingForgetPassword ? `Loading...` : 'Change Password'}</Activity>
          </button>
        </div>
      </div>
    </>
  );
}
