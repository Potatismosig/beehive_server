const { validate } = require('../../modules/validate');

describe("Testing validate", () => {
    it("should retun success", () => {
        const Data = [
            { username: "bagher", type: 'string', min: false, max: false, required: false },
            { password: '123', type: 'string', min: 3, max: 10, required: true }
        ];
        const result = validate(Data);
        expect(result).toEqual(["success", "success"]);
    });
});
