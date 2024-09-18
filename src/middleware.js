import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are public (for development, all routes are public)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// Middleware to handle authentication
export default clerkMiddleware((auth, request) => {
  
  // Check if the route is public or if we are in a test environment
  if (!isPublicRoute(request) && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    // Protect the route if it's not public and not in development or test environments
    auth().protect();
  }
  return;
});

// Middleware configuration
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
