const mongodb = require('../../modules/databaseQuery');
const { getUserPosts } = require('../../controllers/postController/getUserPostsController');
const { getUsername } = require('../../modules/getUsername');
const { Request, Response } = require('jest-express/lib');
const mockCollection = {
    find: jest.fn().mockReturnValue([{ title: 'Post 1' }, { title: 'Post 2' }])
};
jest.mock('../../modules/databaseQuery', () => jest.fn());
jest.mock('../../modules/getUsername', () => ({
    getUsername: jest.fn().mockReturnValue('testUser')
}));
jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('getUserPosts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mongodb.mockReturnValue(mockCollection);
    });

    test('should return the user posts when a valid user is provided', async () => {
        // Set up mock data and functions
        const mockReq = new Request();
        const mockRes = new Response();

        // Call the getUserPosts function
        await getUserPosts(mockReq, mockRes);

        // Check if the databaseQuery module has been called with the correct arguments
        expect(mongodb).toHaveBeenCalledWith(process.env.URL, 'BeeHive', 'posts');

        // Check if the getUsername function has been called
        expect(getUsername).toHaveBeenCalled();

        // Check if the collection find function has been called with the correct arguments
        expect(mockCollection.find).toHaveBeenCalledWith({ username: 'testUser' }, true);

        // Check if the response status is set to 200
        expect(mockRes.status).toHaveBeenCalledWith(200);

        // Check if the response json function returns the expected data
        expect(mockRes.json).toHaveBeenCalledWith([{ title: 'Post 1' }, { title: 'Post 2' }]);
    });

    test('should send a 500 response when an error occurs', async () => {
        // Set up mock data and functions
        const mockReq = new Request();
        const mockRes = new Response();
        mockCollection.find.mockRejectedValue('Database error');

        // Call the getUserPosts function
        await getUserPosts(mockReq, mockRes);

        // Check if the response status is set to 500
        expect(mockRes.status).toHaveBeenCalledWith(500);

        // Check if the response json function returns the expected error message
        expect(mockRes.json).toHaveBeenCalledWith('Internal error');
    });
});
