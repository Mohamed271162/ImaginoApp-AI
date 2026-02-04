'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, User as UserIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateBasicInfoAction } from '@/services/ProfileActions.service';
import { ClientProfile } from '@/store/profileStore';
import { handleApiResponse } from '@/utils/RequestHelpers';
import { basicInfoSchema, type BasicInfoFormValues } from '@/validation/ProfileSchema';
import { EditableField, SelectField } from './ProfileFields';

type Props = {
  profile: ClientProfile;
  onCancel: () => void;
  onUpdated: (updated: {
    fullName: string;
    phone?: string | null;
    age?: number | null;
    gender?: string | null;
  }) => void;
};

export default function ProfileInfoEditForm({ profile, onCancel, onUpdated }: Props) {
  const nameParts = (profile.fullName ?? '').trim().split(' ');
  const firstNameDefault = nameParts[0] ?? '';
  const lastNameDefault = nameParts.slice(1).join(' ');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: firstNameDefault,
      lastName: lastNameDefault,
      phone: profile.phone ?? '',
      age: profile.age ?? undefined,
      gender: profile.gender ?? 'male',
    },
  });

  const onSubmit = async (values: BasicInfoFormValues) => {
    try {
      const response = await updateBasicInfoAction(values);

      if (response.status === 400 && response.errors && Object.keys(response.errors).length > 0) {
        Object.entries(response.errors).forEach(([field, message]) => {
          if (!message) return;
          if (field in values) {
            setError(field as keyof BasicInfoFormValues, {
              type: 'server',
              message: String(message),
            });
          }
        });
        return;
      }

      const ok = handleApiResponse(response, {
        successMessage: 'Profile updated successfully!',
      });

      if (!ok) return;

      const fullName = `${values.firstName} ${values.lastName}`.trim();

      onUpdated({
        fullName,
        phone: values.phone ?? null,
        age: values.age ?? null,
        gender: values.gender ?? null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong! Please try again.';
      toast.error(message);
      console.error('Update basic info error:', err);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
          Edit Profile
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <EditableField
              label="First Name"
              icon={UserIcon}
              value={field.value}
              onChange={field.onChange}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <EditableField
              label="Last Name"
              icon={UserIcon}
              value={field.value}
              onChange={field.onChange}
              error={errors.lastName?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <EditableField
              label="Phone Number"
              icon={Phone}
              value={field.value ?? ''}
              onChange={field.onChange}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <EditableField
              label="Age"
              icon={UserIcon}
              type="number"
              value={field.value != null ? String(field.value) : ''}
              onChange={(val) => {
                const parsed = Number(val);
                field.onChange(Number.isNaN(parsed) ? undefined : parsed);
              }}
              error={errors.age?.message}
            />
          )}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Gender"
              icon={UserIcon}
              value={field.value}
              onChange={field.onChange}
              error={errors.gender?.message}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
          )}
        />

        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-xs font-medium transition"
            style={{
              border: '1px solid var(--border)',
              background: 'color-mix(in srgb, var(--card) 100%, transparent)',
              color: 'var(--card-foreground)',
            }}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-md px-3 py-1.5 text-xs font-medium transition"
            style={{
              background: 'var(--main-color)',
              color: 'rgb(0 0 0)',
            }}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  );
}
