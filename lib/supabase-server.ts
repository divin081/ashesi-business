import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerComponentClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        async set(name: string, value: string, options: any) {
          const cookieStore = await cookies();
          cookieStore.set(name, value, options);
        },
        async remove(name: string, options: any) {
          const cookieStore = await cookies();
          cookieStore.set(name, '', options);
        },
      },
    }
  );
}; 