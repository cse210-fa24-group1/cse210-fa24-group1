const axios = require('axios');

describe('Password Reset Integration Tests', () => {
  const API_URL = 'https://budgettrackerbackend-g9gc.onrender.com';
  let testUserId;

  // Test 1: Reset password functionality
  test('should update user password', async () => {
    // Create test user
    const userData = {
      username: 'test_user_' + Date.now(),
      password: 'oldpassword123',
      email: 'test@example.com',
    };

    // Create user
    const createUserResponse = await axios.post(
      `${API_URL}/api/users`,
      userData
    );
    testUserId = createUserResponse.data.userid;

    // Test password reset
    const newPassword = 'newpassword123';
    const resetResponse = await axios.put(`${API_URL}/api/password`, {
      userid: testUserId,
      password: newPassword,
    });

    expect(resetResponse.status).toBe(200);
    expect(resetResponse.data.userid).toBeDefined();
  });
});
