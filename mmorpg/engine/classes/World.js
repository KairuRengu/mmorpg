var World = function() {
	var players = ["123"]

	// Getters and setters
	var getPlayers = function() {
		return players;
	};


	// Define which variables and methods can be accessed
	return {
		players:players
	}
};


exports.World = World;