import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are public (for development, all routes are public)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// For development reasons, let all routes be public
export default clerkMiddleware((auth, request) => {
  // Check if the route is public
  if (!isPublicRoute(request) || process.env.NODE_ENV !== 'development') {
    // Protect the route if it's not public or not in  production
    auth().protect();
  }

 


});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
