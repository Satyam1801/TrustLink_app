/**
 * TrustLink Automated API Test Suite
 * Run: node test_suite.js
 * Tests: Auth, Links, Feedback, Admin endpoints
 */

const BASE = 'http://localhost:5000';
let cookie = '';
let testUserId = '';
let testLinkId = '';
let pass = 0;
let fail = 0;

// ── Helpers ────────────────────────────────────────────────────────────────
async function req(method, path, body, useCookie = true) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (useCookie && cookie) opts.headers['Cookie'] = cookie;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const sc = res.headers.get('set-cookie');
  if (sc) cookie = sc.split(';')[0];
  return { status: res.status, data: await res.json() };
}

function check(label, condition, info = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${label}${info ? ' — ' + info : ''}`);
    fail++;
  }
}

// ── Test Suites ─────────────────────────────────────────────────────────────
async function testHealth() {
  console.log('\n📡 [1] Health Check');
  const { status, data } = await req('GET', '/health', null, false);
  check('Server responds 200', status === 200, `got ${status}`);
  check('Status is OK', data.status === 'OK', JSON.stringify(data));
}

async function testRegister() {
  console.log('\n👤 [2] Register');
  const username = `testuser_${Date.now()}`;

  // Valid registration
  const { status, data } = await req('POST', '/api/auth/register', {
    username,
    email: `${username}@test.com`,
    password: 'test1234',
  }, false);
  check('Register returns 201', status === 201, `got ${status}`);
  check('success: true', data.success === true, JSON.stringify(data));
  check('user object returned', !!data.user?.id);
  testUserId = data.user?.id;

  // Duplicate registration
  const { status: s2, data: d2 } = await req('POST', '/api/auth/register', {
    username,
    email: `${username}@test.com`,
    password: 'test1234',
  }, false);
  check('Duplicate rejected 400', s2 === 400, `got ${s2}`);
  check('Duplicate error message', d2.success === false);
}

async function testLogin() {
  console.log('\n🔐 [3] Login');

  // We need to login with the account created in register test
  // Re-register a fresh one first to be safe
  const username = `logintest_${Date.now()}`;
  await req('POST', '/api/auth/register', {
    username, email: `${username}@test.com`, password: 'pass5678'
  }, false);
  cookie = ''; // clear cookie from register

  const { status, data } = await req('POST', '/api/auth/login', {
    email: `${username}@test.com`, password: 'pass5678'
  }, false);
  check('Login returns 200', status === 200, `got ${status}`);
  check('success: true', data.success === true, JSON.stringify(data));
  check('Cookie set after login', !!cookie, `cookie: "${cookie}"`);

  // Wrong password
  const { status: s2 } = await req('POST', '/api/auth/login', {
    email: `${username}@test.com`, password: 'wrongpass'
  }, false);
  check('Wrong password rejected 401', s2 === 401, `got ${s2}`);
}

async function testLinks() {
  console.log('\n🔗 [4] Links CRUD');

  // GET (authenticated)
  const { status: gs, data: gd } = await req('GET', '/api/links');
  check('GET /api/links returns 200', gs === 200, `got ${gs}`);
  check('GET links.success true', gd.success === true, JSON.stringify(gd));
  check('GET links is array', Array.isArray(gd.links));

  // POST add
  const { status: as, data: ad } = await req('POST', '/api/links/add', {
    title: 'Test Portfolio',
    url: 'https://example.com',
    password: null,
    expiresAt: null,
  });
  check('POST /api/links/add returns 201', as === 201, `got ${as}`);
  check('Add link success', ad.success === true, JSON.stringify(ad));
  check('Link has id', !!ad.link?.id);
  testLinkId = ad.link?.id;

  // PUT update
  if (testLinkId) {
    const { status: us, data: ud } = await req('PUT', `/api/links/${testLinkId}`, {
      title: 'Updated Portfolio',
      url: 'https://updated-example.com',
      password: 'secret',
      expiresAt: null,
    });
    check('PUT /api/links/:id returns 200', us === 200, `got ${us}`);
    check('Update success', ud.success === true, JSON.stringify(ud));
    check('Title updated', ud.link?.title === 'Updated Portfolio');
  }

  // DELETE
  if (testLinkId) {
    const { status: ds, data: dd } = await req('DELETE', `/api/links/${testLinkId}`);
    check('DELETE /api/links/:id returns 200', ds === 200, `got ${ds}`);
    check('Delete success', dd.success === true, JSON.stringify(dd));
  }
}

async function testFeedback() {
  console.log('\n💬 [5] Feedback');
  const { status, data } = await req('POST', '/api/feedback', {
    message: 'Automated test feedback - great app!',
    rating: 5,
  });
  check('POST /api/feedback returns 201', status === 201, `got ${status}`);
  check('Feedback success', data.success === true, JSON.stringify(data));
}

async function testAdmin() {
  console.log('\n🛡 [6] Admin');
  const { status, data } = await req('GET', '/api/admin/users');
  check('GET /api/admin/users returns 403 for normal user', status === 403, `got ${status}`);
  check('Admin returns access denied', data.success === false && data.message.includes('Admin privileges required'), JSON.stringify(data));
}

async function testUnauthenticated() {
  console.log('\n🚫 [7] Unauthenticated Protection');
  const savedCookie = cookie;
  cookie = ''; // clear cookie to simulate logged-out user

  const { status: ls } = await req('GET', '/api/links', null, false);
  check('GET /api/links with no auth → 401', ls === 401, `got ${ls}`);

  const { status: as } = await req('GET', '/api/admin/users', null, false);
  check('GET /api/admin/users with no auth → 401', as === 401, `got ${as}`);

  cookie = savedCookie; // restore
}

async function testLogout() {
  console.log('\n🚪 [8] Logout');
  const { status, data } = await req('POST', '/api/auth/logout');
  check('POST /api/auth/logout returns 200', status === 200, `got ${status}`);
  check('Logout success', data.success === true, JSON.stringify(data));
}

// ── Runner ──────────────────────────────────────────────────────────────────
(async () => {
  console.log('═════════════════════════════════════════════');
  console.log('  TrustLink API — Automated Test Suite');
  console.log('═════════════════════════════════════════════');

  try {
    await testHealth();
    await testRegister();
    await testLogin();
    await testLinks();
    await testFeedback();
    await testAdmin();
    await testUnauthenticated();
    await testLogout();
  } catch (err) {
    console.error('\n💥 Test runner crashed:', err.message);
    fail++;
  }

  console.log('\n═════════════════════════════════════════════');
  console.log(`  Results: ✅ ${pass} passed  ❌ ${fail} failed`);
  console.log('═════════════════════════════════════════════\n');
  process.exit(fail > 0 ? 1 : 0);
})();
