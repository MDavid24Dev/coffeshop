// C:\Users\Solutioncopy20\coffeshop\middleware.js
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export default async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Inicializar cliente Supabase SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }));
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set({ name, value, ...options }));
        },
      },
    }
  );

  // 2. Recuperar el usuario logueado de manera segura
  const { data: { user } } = await supabase.auth.getUser();
  
  // Extraer el rol del usuario desde sus metadatos (por defecto 'client')
  const userRole = user?.user_metadata?.role || 'client';
  const currentPath = request.nextUrl.pathname;

  // 3. Reglas Perimetrales de Acceso (Tiro fijo)

  // Bloqueo A: Módulo de Gestión de Productos (Solo Admin y Support)
  if (currentPath.startsWith('/productos') && userRole !== 'admin' && userRole !== 'support') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Bloqueo B: Si pones rutas administrativas a futuro (ej: /admin)
  if (currentPath.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

// Configurar qué rutas escuchará este Middleware de forma activa
export const config = {
  matcher: ['/productos/:path*', '/admin/:path*'],
};