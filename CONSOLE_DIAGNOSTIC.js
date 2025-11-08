// Copy and paste this entire script into your browser console (F12 → Console tab)
// while on https://health-connect-mern.vercel.app

(async function() {
    console.clear();
    console.log('%c🔍 HEALTH-CONNECT DIAGNOSTIC', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('='.repeat(70));
    
    const BACKEND_URL = 'https://health-connect-mern-1.onrender.com';
    
    // 1. Check Token
    console.log('\n%c1. TOKEN CHECK', 'color: #764ba2; font-size: 16px; font-weight: bold;');
    console.log('-'.repeat(70));
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = new Date(payload.exp * 1000);
            const isExpired = new Date() > expiry;
            
            console.log('✅ Token Found!');
            console.log('User ID:', payload.id);
            console.log('Role:', payload.role);
            console.log('Issued:', new Date(payload.iat * 1000).toLocaleString());
            console.log('Expires:', expiry.toLocaleString());
            console.log('Status:', isExpired ? '❌ EXPIRED' : '✅ Valid');
            console.log('Token (first 100 chars):', token.substring(0, 100) + '...');
            
            if (isExpired) {
                console.log('%c⚠️ TOKEN EXPIRED! Logout and login again.', 'color: red; font-weight: bold;');
            }
        } catch (e) {
            console.log('⚠️ Token exists but is malformed!');
            console.log('Error:', e.message);
        }
    } else {
        console.log('❌ No token found in localStorage!');
        console.log('You need to login first.');
    }
    
    // 2. Test Backend Connection
    console.log('\n%c2. BACKEND CONNECTION TEST', 'color: #764ba2; font-size: 16px; font-weight: bold;');
    console.log('-'.repeat(70));
    try {
        const start = Date.now();
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token || ''}`
            }
        });
        const elapsed = Date.now() - start;
        const data = await response.json();
        
        console.log('Status:', response.status, response.statusText);
        console.log('Response Time:', elapsed + 'ms');
        
        if (response.ok) {
            console.log('✅ Authentication Successful!');
            console.log('User Data:', data);
        } else {
            console.log('❌ Authentication Failed!');
            console.log('Error:', data);
            
            if (response.status === 401) {
                console.log('%c⚠️ 401 Unauthorized - Token is invalid or expired', 'color: red; font-weight: bold;');
                console.log('Action: Run localStorage.clear() and login again');
            }
        }
    } catch (error) {
        console.log('❌ Backend request failed!');
        console.log('Error:', error.message);
        console.log('Possible causes:');
        console.log('  1. Server is sleeping (Render free tier)');
        console.log('  2. Network error');
        console.log('  3. CORS error');
    }
    
    // 3. Check Authorization Header in Axios
    console.log('\n%c3. AXIOS INTERCEPTOR CHECK', 'color: #764ba2; font-size: 16px; font-weight: bold;');
    console.log('-'.repeat(70));
    try {
        // Simulate what axios interceptor does
        const mockConfig = {
            headers: {}
        };
        const token = localStorage.getItem('token');
        if (token) {
            mockConfig.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Axios would add Authorization header');
            console.log('Header:', mockConfig.headers.Authorization.substring(0, 100) + '...');
        } else {
            console.log('❌ No token to add to headers!');
        }
    } catch (e) {
        console.log('❌ Error simulating axios interceptor:', e.message);
    }
    
    // 4. Storage Info
    console.log('\n%c4. STORAGE INFO', 'color: #764ba2; font-size: 16px; font-weight: bold;');
    console.log('-'.repeat(70));
    console.log('localStorage items:', localStorage.length);
    console.log('All localStorage keys:', Object.keys(localStorage));
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value.substring(0, 50) + (value.length > 50 ? '...' : ''));
    }
    
    // 5. Current Page Info
    console.log('\n%c5. CURRENT PAGE INFO', 'color: #764ba2; font-size: 16px; font-weight: bold;');
    console.log('-'.repeat(70));
    console.log('URL:', window.location.href);
    console.log('Domain:', window.location.hostname);
    console.log('Protocol:', window.location.protocol);
    
    // 6. Recommendations
    console.log('\n%c6. RECOMMENDATIONS', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('-'.repeat(70));
    
    if (!token) {
        console.log('❌ NO TOKEN - Please login first');
    } else {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = new Date() > new Date(payload.exp * 1000);
            
            if (isExpired) {
                console.log('%c❌ TOKEN EXPIRED', 'color: red; font-weight: bold;');
                console.log('\nFix:');
                console.log('  1. Run: localStorage.clear()');
                console.log('  2. Refresh page');
                console.log('  3. Login again');
            } else {
                console.log('✅ Token is valid. If you\'re still getting 401 errors:');
                console.log('\nTroubleshooting:');
                console.log('  1. Check Network tab → Click failed request → Headers');
                console.log('  2. Verify "Authorization: Bearer ..." header is present');
                console.log('  3. Try: localStorage.clear() + refresh + login');
                console.log('  4. Check backend Render logs for errors');
            }
        } catch (e) {
            console.log('%c❌ TOKEN MALFORMED', 'color: red; font-weight: bold;');
            console.log('\nFix:');
            console.log('  1. Run: localStorage.clear()');
            console.log('  2. Refresh page');
            console.log('  3. Login again');
        }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('%c✅ DIAGNOSTIC COMPLETE', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('='.repeat(70));
})();
