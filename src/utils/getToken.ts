export function getCookie(name: string): string | undefined {
  if (typeof window !== "undefined") {
    // Client-side: Use `document.cookie`
    const cookieArr = document.cookie.split(";");
    for (let cookie of cookieArr) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
  } else {
    // Server-side: Conditionally require `next/headers`
    const { cookies } = require("next/headers");
    const cookieStore = cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value;
  }
  return undefined; // Return undefined if cookie not found
}
