const { getUsername } = require('../../modules/getUsername');
const jwt = require('jsonwebtoken');
const { Request, Response } = require('jest-express/lib');
const secret = process.env.SECRET;

// Mock the 'jsonwebtoken' module
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('getUsername', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the username when a valid token is provided', () => {
    // Set up mock data and functions
    const mockToken = 'validToken';
    const mockSecret = secret;
    const mockUsername = 'testUser';
    const mockReq = new Request();
    mockReq.cookies = { Token: mockToken };
    const mockRes = new Response();

    jwt.verify.mockReturnValue({ username: mockUsername });

    // Call the getUsername function
    const username = getUsername(mockReq, mockRes);

    // Check if jwt.verify has been called with the correct arguments
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret);

    // Check if the function returns the expected username
    expect(username).toBe(mockUsername);
  });

  test('should send a 401 response when the token is not found', () => {
    // Set up mock data and functions
    const mockReq = new Request();
    mockReq.cookies = {};
    const mockRes = new Response();

    // Call the getUsername function
    getUsername(mockReq, mockRes);

    // Check if the response status is set to 401
    expect(mockRes.status).toHaveBeenCalledWith(401);

    // Check if the response has the expected message
    expect(mockRes.json).toHaveBeenCalledWith('Token not found');
  });
});
