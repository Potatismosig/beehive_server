const { validate } = require('../../modules/validate');

describe('Validate function tests', () => {
  test('should pass with valid input', () => {
    const val = [
      { name: 'John Doe', type: 'string', min: 3, max: 50, required: true },
      { age: 30, type: 'number', min: 18, max: 120, required: true },
    ];

    const req = {
      body: {
        name: 'John Doe',
        age: 30,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const validationResult = validate(val, req, res);

    expect(validationResult).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should fail with invalid input', () => {
    const val = [
      { name: 'J', type: 'string', min: 3, max: 50, required: true },
      { name: 200, type: 'number', min: 18, max: 120, required: true },
    ];

    const req = {
      body: {
        name: 'J', // Invalid name (length is less than 3)
        age: 200, // Invalid age (greater than 120)
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      success: jest.fn(),
    };

    const validationResult = validate(val, req, res);

    expect(validationResult).toBe(false); // Update this line
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
