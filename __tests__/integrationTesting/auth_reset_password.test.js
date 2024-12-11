const axios = require('axios');

describe('Password Reset Integration Tests', () => {
  const API_URL = 'http://localhost:3000';
  let testUserId;

  // Test 1: Create reset token and verify it's stored
  test('should create and store reset token', async () => {
    const testToken = {
      token: 'test_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    };

    // Create reset token
    const response = await axios.post(`${API_URL}/api/resettoken`, testToken);
    
    // Verify response
    expect(response.status).toBe(200);
    expect(response.data.token).toBe(testToken.token);
    expect(response.data.id).toBeDefined();

    // Verify token can be retrieved
    const verifyResponse = await axios.get(`${API_URL}/api/resettoken`, {
      params: { token: testToken.token }
    });
    
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.data[0].token).toBe(testToken.token);
  });

  // Test 2: Reset password functionality
  test('should update user password', async () => {
    // Create test user
    const userData = {
      username: 'test_user_' + Date.now(),
      password: 'oldpassword123',
      email: 'test@example.com'
    };

    // Create user
    const createUserResponse = await axios.post(`${API_URL}/api/users`, userData);
    testUserId = createUserResponse.data.userid;

    // Test password reset
    const newPassword = 'newpassword123';
    const resetResponse = await axios.put(`${API_URL}/api/password`, {
      userid: testUserId,
      password: newPassword
    });
    
    expect(resetResponse.status).toBe(200);
    expect(resetResponse.data.userid).toBeDefined();
  });
});