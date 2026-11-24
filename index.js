// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     });

//     res.end(`
//         <h1>Welcome to CODERWANDA Ltd</h1>
//         <p>Web Application is running successfully!</p>
//     `);
// });

// server.listen(3000, '0.0.0.0', () => {
//     console.log('Server running on port 3000');
// });


const http = require('http');
const querystring = require('querystring');

// In-memory database for demonstration (resets if container restarts)
const users = [
    { name: 'Admin User', email: 'admin@coderwanda.rw', password: 'password123' }
];

// Shared CSS styling for all pages
const commonStyles = `
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: #f0f4f8; display: flex; justify-content: center; align-items: center; min-height: 100vh; color: #333; padding: 20px; }
        .container { background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); width: 100%; max-width: 450px; }
        h1 { color: #0056b3; font-size: 24px; text-align: center; margin-bottom: 8px; }
        h2 { color: #555; font-size: 18px; font-weight: normal; text-align: center; margin-bottom: 20px; }
        p { line-height: 1.6; margin-bottom: 15px; text-align: center; color: #555; }
        label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; color: #444; }
        input[type="text"], input[type="email"], input[type="password"] {
            width: 100%; padding: 12px; margin-bottom: 18px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;
        }
        input:focus { border-color: #0056b3; outline: none; }
        .btn {
            display: inline-block; width: 100%; padding: 12px; background-color: #0056b3; color: white;
            border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;
            text-align: center; text-decoration: none; transition: background-color 0.3s; margin-bottom: 10px;
        }
        .btn:hover { background-color: #004494; }
        .btn-secondary { background-color: #28a745; }
        .btn-secondary:hover { background-color: #218838; }
        .btn-outline { background-color: transparent; border: 2px solid #0056b3; color: #0056b3; }
        .btn-outline:hover { background-color: #0056b3; color: white; }
        .alert { padding: 12px; border-radius: 6px; margin-bottom: 20px; text-align: center; font-size: 14px; }
        .alert-error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .alert-success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .info-card { background: #f8f9fa; border-left: 4px solid #0056b3; padding: 15px; margin-bottom: 15px; border-radius: 4px; text-align: left; }
        .info-card h3 { font-size: 16px; color: #0056b3; margin-bottom: 5px; }
        .info-card p { text-align: left; margin: 0; font-size: 14px; }
        .links { text-align: center; margin-top: 15px; font-size: 14px; }
        .links a { color: #0056b3; text-decoration: none; font-weight: 600; }
        .links a:hover { text-decoration: underline; }
        .badge { display: inline-block; background: #e2e8f0; color: #1e293b; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
    </style>
`;

// Helper to wrap HTML content
function renderPage(title, content) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - CODERWANDA Ltd</title>
        ${commonStyles}
    </head>
    <body>
        <div class="container">
            ${content}
        </div>
    </body>
    </html>
    `;
}

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // 1. KUBERNETES HEALTH CHECK ENDPOINT
    if (url === '/health' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'UP', service: 'coderwanda-web-app', timestamp: new Date() }));
    }

    // 2. HOME / WELCOME PAGE
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(renderPage('Welcome', `
            <div style="text-align:center;"><span class="badge">v1.0 • DevOps Pipeline Active</span></div>
            <h1>Welcome to CODERWANDA Ltd</h1>
            <h2>Web Application Portal</h2>
            <p>Access company resources, project updates, and internal portals securely through your browser.</p>
            <a href="/login" class="btn">User Login</a>
            <a href="/register" class="btn btn-outline">Create New Account</a>
        `));
    }

    // 3. LOGIN PAGE (GET)
    if (url === '/login' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(renderPage('Login', `
            <h1>CODERWANDA Ltd</h1>
            <h2>User Login</h2>
            <form action="/login" method="POST">
                <label for="email">Email Address:</label>
                <input type="email" id="email" name="email" placeholder="admin@coderwanda.rw" required>
                
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter password" required>
                
                <button type="submit" class="btn">Login</button>
            </form>
            <div class="links">
                Don't have an account? <a href="/register">Register here</a><br><br>
                <a href="/">← Back to Home</a>
            </div>
        `));
    }

    // 4. HANDLE LOGIN SUBMISSION (POST)
    if (url === '/login' && method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { email, password } = querystring.parse(body);
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                return res.end(renderPage('Dashboard', `
                    <h1>CODERWANDA Ltd</h1>
                    <h2>Welcome, ${user.name}!</h2>
                    <div class="alert alert-success">Authentication successful.</div>
                    
                    <div class="info-card">
                        <h3>Company Information & Status</h3>
                        <p><strong>Environment:</strong> Kubernetes Production Cluster</p>
                        <p><strong>CI/CD Pipeline:</strong> Jenkins + GitHub Automated</p>
                        <p><strong>Container Host:</strong> ${require('os').hostname()}</p>
                    </div>

                    <div class="info-card">
                        <h3>Internal Announcements</h3>
                        <p>Sprint 1 deployment completed successfully. All services are operational.</p>
                    </div>

                    <a href="/" class="btn btn-outline" style="margin-top: 10px;">Logout</a>
                `));
            } else {
                res.writeHead(401, { 'Content-Type': 'text/html' });
                return res.end(renderPage('Login Failed', `
                    <h1>CODERWANDA Ltd</h1>
                    <h2>User Login</h2>
                    <div class="alert alert-error">Invalid email or password. Try <b>admin@coderwanda.rw</b> / <b>password123</b></div>
                    <a href="/login" class="btn">Try Again</a>
                `));
            }
        });
        return;
    }

    // 5. REGISTRATION PAGE (GET)
    if (url === '/register' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(renderPage('Register', `
            <h1>CODERWANDA Ltd</h1>
            <h2>Create Account</h2>
            <form action="/register" method="POST">
                <label for="name">Full Name:</label>
                <input type="text" id="name" name="name" placeholder="e.g. Jean Bosco" required>

                <label for="email">Email Address:</label>
                <input type="email" id="email" name="email" placeholder="name@coderwanda.rw" required>
                
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Create a password" required>
                
                <button type="submit" class="btn btn-secondary">Register</button>
            </form>
            <div class="links">
                Already have an account? <a href="/login">Login here</a><br><br>
                <a href="/">← Back to Home</a>
            </div>
        `));
    }

    // 6. HANDLE REGISTRATION SUBMISSION (POST)
    if (url === '/register' && method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { name, email, password } = querystring.parse(body);
            const exists = users.some(u => u.email === email);

            if (exists) {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                return res.end(renderPage('Registration Error', `
                    <h1>CODERWANDA Ltd</h1>
                    <div class="alert alert-error">An account with that email already exists.</div>
                    <a href="/register" class="btn">Back to Registration</a>
                `));
            }

            users.push({ name, email, password });
            res.writeHead(201, { 'Content-Type': 'text/html' });
            return res.end(renderPage('Registration Successful', `
                <h1>CODERWANDA Ltd</h1>
                <div class="alert alert-success">Account created for <b>${name}</b>!</div>
                <p>You can now log in using your registered credentials.</p>
                <a href="/login" class="btn">Proceed to Login</a>
            `));
        });
        return;
    }

    // 7. 404 NOT FOUND
    res.writeHead(404, { 'Content-Type': 'text/html' });
