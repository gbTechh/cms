import { useCsrfToken } from "./useCsrfToken";

export function CsrfInput() {
  const csrfToken = useCsrfToken();
  return <input type="hidden" name="csrf" value={csrfToken} />;
}
