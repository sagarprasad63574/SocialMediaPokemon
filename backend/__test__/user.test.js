const userService = require('../service/userService');
const userDAO = require('../repository/userDAO');
const tokens = require('../util/tokens');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

jest.mock('../repository/userDAO');
jest.mock('bcrypt');
jest.mock('uuid');
jest.mock('../util/tokens');


describe('Register Test', () => {
    test('Empty data, should return false', async () => {
        const data = await userService.registerUser({});
        expect(data.response).toBeFalsy();
    });
    test('Incomplete data, should return false', async () => {
        const incomplete = {
            username: "testuser",
            password: "testpass"
        };
        const data = await userService.registerUser(incomplete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data but user already exists, should return false', async () => {
        const complete = {
            username: "testuser",
            password: "testpass",
            name: "test user",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce({...complete, user_id: "0"});
        const data = await userService.registerUser(complete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data and user is unique, should return true', async () => {
        const complete = {
            username: "testuser",
            password: "testpass",
            name: "test user",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce();
        uuid.v4.mockReturnValueOnce("1");
        bcrypt.hash.mockResolvedValueOnce("rewpqi");
        userDAO.postUser.mockResolvedValueOnce(true);
        const data = await userService.registerUser(complete);
        expect(data.response).toBeTruthy();
    });
    test('Complete data with admin role, should return true', async () => {
        const completeAdmin = {
            username: "testadmin",
            password: "adminpass",
            name: "admin user",
            email: "admin@example.com",
            role: "admin"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce();
        uuid.v4.mockReturnValueOnce("3");
        bcrypt.hash.mockResolvedValueOnce("aebron");
        userDAO.postUser.mockResolvedValueOnce(true);
        const data = await userService.registerUser(completeAdmin);
        expect(data.response).toBeTruthy();
    });
});

describe('Login Test', () => {
    test('Empty data, should return false', async () => {
        const data = await userService.loginUser({});
        expect(data.response).toBeFalsy();
    });
    test('Incomplete data, should return false', async () => {
        const incomplete = {
            username: "testuser"
        };
        const data = await userService.loginUser(incomplete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data but username is incorrect, should return false', async () => {
        const complete = {
            username: "testuserr",
            password: "password"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await userService.loginUser(complete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data but password is incorrect, should return false', async () => {
        const complete = {
            username: "testuser",
            password: "passwordo"
        };
        const user = {
            username: "testuser",
            password: "password",
            name: "Test User",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        bcrypt.compare.mockResolvedValueOnce(false);
        const data = await userService.loginUser(complete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data with correct parameters, should return true', async () => {
        const complete = {
            username: "testuser",
            password: "password"
        };
        const user = {
            username: "testuser",
            password: "password",
            name: "Test User",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        bcrypt.compare.mockResolvedValueOnce(true);
        tokens.createToken.mockReturnValueOnce("ljkfdsnbveoug43bgpone34klbwnuotr");
        const data = await userService.loginUser(complete);
        expect(data.response).toBeTruthy();
        expect(data.username).toStrictEqual(complete.username);
    });
});

describe('Profile Test', () => {
    test('Setting profile with incomplete data, should return false', async () => {
        const profile = {
            username: "testusr",
            biography: "testbio"
        };
        const data = await userService.editProfile(profile);
        expect(data.response).toBeFalsy();
    });
    test('Setting profile but user does not exist, should return false', async () => {
        const profile = {
            username: "testuser",
            biography: "testbio",
            name: "test user",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await userService.editProfile(profile);
        expect(data.response).toBeFalsy();
    });
    test('Setting profile and user exists, should return true', async () => {
        const profile = {
            username: "testuser",
            biography: "testbio",
            name: "test user",
            email: "test@example.com"
        };
        const user = {
            username: "testuser",
            password: "password",
            name: "Test User",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        userDAO.updateUser.mockResolvedValueOnce(true);
        const data = await userService.editProfile(profile);
        expect(data.response).toBeTruthy();
    });
});

describe('Getting Users', () => {
    test('Getting all users but empty, should return false', async () => {
        userDAO.getAllUsers.mockResolvedValueOnce([]);
        const data = await userService.getAllUsers();
        expect(data.response).toBeFalsy();
    });
    test('Getting all users but users present, should return true', async () => {
        const user0 = {
            username: "testuser0",
            password: "wtnhrpbqemwrhnabie",
            name: "Test User0",
            email: "test0@example.com",
            role: "user"
        };
        const user1 = {
            username: "testuser1",
            password: "nj4wrytbbzphtr",
            name: "Test User1",
            email: "test1@example.com",
            role: "user"
        };
        const users = [user0, user1];
        userDAO.getAllUsers.mockResolvedValueOnce(users);
        const data = await userService.getAllUsers();
        expect(data.response).toBeTruthy();
    });
    test('Getting user by username but user does not exist, should return false', async () => {
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce();
        const data = await userService.getUserByUsername("testuser");
        expect(data.response).toBeFalsy();
    });
    test('Getting user by username but user exists, should return true', async () => {
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        const data = await userService.getUserByUsername("testuser");
        expect(data.response).toBeTruthy();
    });
    test('Getting users by role but no users, should return false', async () => {
        userDAO.getUsersByRole.mockResolvedValueOnce([]);
        const data = await userService.getUsersByRole("user");
        expect(data.response).toBeFalsy();
    });
    test('Getting users by role but role is not present, should return false', async () => {
        const user = {
            username: "testuser",
            password: "testpass",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        const admin = {
            username: "testadmin",
            password: "3h5in0qtkreb",
            name: "Test Admin",
            email: "admin@example.com",
            role: "admin"
        };
        userDAO.getUsersByRole.mockResolvedValueOnce([]);
        const data = await userService.getUsersByRole("ebro");
        expect(data.response).toBeFalsy();
    });
    test('Getting users by role but role is present, should return true', async () => {
        const user = {
            username: "testuser",
            password: "testpass",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        const admin = {
            username: "testadmin",
            password: "3h5in0qtkreb",
            name: "Test Admin",
            email: "admin@example.com",
            role: "admin"
        };
        userDAO.getUsersByRole.mockResolvedValueOnce([user]);
        const data = await userService.getUsersByRole("user");
        expect(data.response).toBeTruthy();
    });
});

describe('Deleting Users', () => {
    test('Deleting user but no user id provided, should return false', async () => {
        const data = await userService.deleteUser();
        expect(data.response).toBeFalsy();
    });
    test('Deleting user but user does not exist, should return false', async () => {
        userDAO.deleteUser.mockResolvedValueOnce(null);
        const data = await userService.deleteUser("0");
        expect(data.response).toBeFalsy();
    });
    test('Deleting user and user exists, should return true', async () => {
        userDAO.deleteUser.mockResolvedValueOnce(true);
        const data = await userService.deleteUser("0");
        expect(data.response).toBeTruthy();
    });
});