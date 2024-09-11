import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are public (e.g., sign-in and sign-up pages)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
// for developing reasons, let all routes public 
export default clerkMiddleware((auth, request) => {
  /// **No need to protect any routes**
  // auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    
    '/(api|trpc)(.*)',

    
  ],
};
