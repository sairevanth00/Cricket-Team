const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");


const dbPath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//API 1

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT * 
    FROM 
        cricket_team
    `;
  const player = await db.all(getPlayerQuery);
  response.send(
    player.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

//API 2

app.get("/players/player_id", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT * 
    FROM 
        cricket_team 
    WHERE 
        player_id = ${player_id}
    `;
  const player = await db.get(getPlayerQuery);
  response.send(convertDbObjectToResponseObject(player))
  );
});

//API 3

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
    INSERT INTO 
        cricket_team (player_name, jersey_number, role) 
    VALUES 
        ('${playerName}',${jerseyNumber},'${role}');
    `;
  const player = await db.run(postPlayerQuery);
  response.send("Player Added To Team");
});

//API 4
app.put("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const {playerId} = request.params;
  const updatePlayerQuery = `
    UPDATE 
    cricket_team 
    SET 
        player_Name ='${playerName}',
        jersey_Number = ${jerseyNumber},
        role = '${role}');
    WHERE 
    player_id = ${playerId}
    `;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE 
    FROM cricket_team
    WHERE player_id = ${playerId}
    `;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
