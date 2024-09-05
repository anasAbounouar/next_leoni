import Cors from 'cors';

// Initialize the CORS middleware with necessary options
const cors = Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*', // Allow all origins or specify your own
});

// Helper function to run middleware
export function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// Middleware function to handle CORS
export async function corsMiddleware(req, res) {
    await runMiddleware(req, res, cors);

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}
