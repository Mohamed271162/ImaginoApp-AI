import { toast } from 'sonner';
import type { resShape } from './fetchApi';

function getMessageFromResponse(res?: resShape): string {
  if (!res) return 'Something went wrong!';

  if (res.errMsg) return res.errMsg;
  if (res.message) return res.message;

  if (res.errors && Object.keys(res.errors).length > 0) {
    const firstError = Object.values(res.errors)[0];
    if (firstError) return String(firstError);
  }

  return 'Something went wrong!';
}

export function handleApiResponse(
  response: resShape,
  options?: {
    successMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): boolean {
  const isSuccess = response.status >= 200 && response.status < 300;

  if (isSuccess) {
    if (options?.showSuccessToast !== false) {
      toast.success(response.errMsg || response.message || options?.successMessage || 'Success');
    }
    return true;
  }

  const errorMessage = getMessageFromResponse(response);

  if (options?.showErrorToast !== false) {
    toast.error(errorMessage);
  }

  return false;
}
