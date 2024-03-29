const teamService = require('../service/teamService');
const teamDAO = require('../repository/teamDAO');
const uuid = require('uuid');

jest.mock('../repository/teamDAO');
jest.mock('uuid');

describe('Team Test', () => {
    test('Empty data, should return false', async () => {
        const data = await teamService.addTeam(0,{});
        expect(data.response).toBeFalsy();
    });
    test('Team name too small, should return false', async () => {
        const data = await teamService.addTeam(0,{team_name:"name"});
        expect(data.response).toBeFalsy();
    });
    test('Test add team', async () => {
        const team = {
            "team_id": "1",
            "team_name": "team",
            "win": 0,
            "loss": 0,
            "points": 0,
            "pokemons": [],
            "battlelog": []
        };
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([{...0, user_id: "1"}]);
        uuid.v4.mockReturnValueOnce("1");
        teamDAO.createTeam.mockResolvedValueOnce(team);
        const data = await teamService.addTeam(1,{team_name:"testeam"});
        expect(data.response).toBeTruthy();
    });
});