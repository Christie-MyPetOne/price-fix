import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  // Adicionada a nova rota da Landing Page com a regra 'next'
  { path: "/about", whenAutheticade: "next" },
  { path: "/login", whenAutheticade: "redirect" },
  { path: "/register", whenAutheticade: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("token");

  // if (!authToken && publicRoute) {
  //   return NextResponse.next();
  // }

  // if (!authToken && !publicRoute) {
  //   const redirectUrl = request.nextUrl.clone();

  //   redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

  //   return NextResponse.redirect(redirectUrl);
  // }

  // if (authToken && publicRoute && publicRoute.whenAutheticade === "redirect") {
  //   const redirectUrl = request.nextUrl.clone();

  //   redirectUrl.pathname = "/";

  //   return NextResponse.redirect(redirectUrl);
  // }

  // // Se a rota for pública e whenAutheticade for 'next', o código chegará aqui
  // // e permitirá o acesso para o usuário autenticado.
  // if (authToken && !publicRoute) {
  //   // Checar se o JWT esta EXPIRADO
  //   // Se sim, remover o cookie e redirecionar o user pro login
  //   // Aplicar uma estratégia de refresh tolken

  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|roots.tsx).*)",
  ],
};
