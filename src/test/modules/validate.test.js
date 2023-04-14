const { validate } = require('../../modules/validate');
const Joi = require('joi');

// Mock the res object to capture responses

const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

// Helper function to create a request object
const createRequestMock = (body) => ({ body });

describe('Validator tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should return "success" when all validation rules pass', () => {
        const validationSchema = [
            { type: 'string', min: 1, max: 5, required: true, fieldName: 'name' },
        ];
        const req = createRequestMock({ name: 'John' });

        const result = validate(validationSchema, req, resMock);
        expect(result).toEqual(['success']);
    });

    test('should return error message when required field is missing', () => {
        const validationSchema = [
            { type: 'string', min: 1, max: 5, required: true, fieldName: 'name' },
        ];
        const req = createRequestMock({});

        const result = validate(validationSchema, req, resMock);
        expect(result).toContain('"fieldName" is required');
        expect(resMock.status).toHaveBeenCalledWith(400);
        expect(resMock.json).toHaveBeenCalledWith('"fieldName" is required');
    });

    test('should return error message when value is below minimum', () => {
        const validationSchema = [
            { type: 'number', min: 5, fieldName: 'age' },
        ];
        const req = createRequestMock({ age: 3 });

        const result = validate(validationSchema, req, resMock);
        expect(result).toContain('"age" must be larger than or equal to 5');
        expect(resMock.status).toHaveBeenCalledWith(400);
        expect(resMock.json).toHaveBeenCalledWith('"age" must be larger than or equal to 5');
    });

    test('should return error message when value is above maximum', () => {
        const validationSchema = [
            { type: 'string', max: 5, fieldName: 'name' },
        ];
        const req = createRequestMock({ name: 'Longer name' });

        const result = validate(validationSchema, req, resMock);
        expect(result).toContain('"name" length must be less than or equal to 5 characters long');
        expect(resMock.status).toHaveBeenCalledWith(400);
        expect(resMock.json).toHaveBeenCalledWith('"name" length must be less than or equal to 5 characters long');
    });

    test('should return error message for invalid extra properties', () => {
        const validationSchema = [
            { type: 'string', min: 1, max: 5, fieldName: 'name' },
        ];
        const req = createRequestMock({ name: 'John', invalidProp: 'Invalid' });

        const result = validate(validationSchema, req, resMock);
        expect(result).toContain('Invalid properties: invalidProp');
        expect(resMock.status).toHaveBeenCalledWith(400);
        expect(resMock.json).toHaveBeenCalledWith('Invalid properties: invalidProp');
    });

    test('should not validate fields not in request body', () => {
      const validationSchema = [
          { type: 'string', min: 1, max: 5, fieldName: 'name' },
          { type: 'number', min: 1, max: 5, fieldName: 'age' },
      ];
      const req = createRequestMock({ name: 'John' });
  
      const result = validate(validationSchema, req, resMock);
      expect(result).toEqual(['success']);
      expect(resMock.status).not.toHaveBeenCalled();
      expect(resMock.json).not.toHaveBeenCalled();
    });
})
