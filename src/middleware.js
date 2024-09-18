import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are public (for development, all routes are public)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// Middleware to handle authentication
export default clerkMiddleware((auth, request) => {
  if (process.env.NODE_ENV === "development" || process.env.CYPRESS) {
    // Skip Clerk authentication in test or development environments
    console.log('Skipping Clerk Authentication in Cypress/Development');
    return;
  }

  if (!isPublicRoute(request)) {
    auth().protect();
  }
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
