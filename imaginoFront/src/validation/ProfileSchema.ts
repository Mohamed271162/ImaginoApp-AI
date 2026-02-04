import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { fetchApi, resShape } from '@/utils/fetchApi';
import { z } from 'zod';

const phoneRegex = new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/);

export const basicInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format').trim().optional(),
  age: z
    .number({
      message: 'Age must be a Number!',
    })
    .int('Age must be an integer')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than or equal to 120')
    .optional(),
  gender: z.string({ message: 'Gender must be string!' }).min(1, 'Gender is required'),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

export async function updateBasicInfoAction(values: BasicInfoFormValues) {
  const res = await fetchApi<resShape>(`user/update-basic-info`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `hamada ${await getServerCookies(ACCESS_TOKEN_COOKIE_KEY)}`,
    },
    body: JSON.stringify(values),
    credentials: 'include',
  });

  return {
    errMsg: res.errMsg,
    message: res.message,
    errors: res.errors,
    result: res.result,
    status: res.status,
  };
}
export async function uploadProfileImageAction(file: File): Promise<resShape> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetchApi<resShape>('user/upload-profile-image', {
    method: 'PATCH',
    body: formData,
    credentials: 'include',
  });

  return res;
}

export async function deleteProfileImageAction(): Promise<resShape> {
  const res = await fetchApi<resShape>('user/delete-profile-image', {
    method: 'DELETE',
    credentials: 'include',
  });

  return res;
}
