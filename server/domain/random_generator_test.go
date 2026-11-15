package domain

import (
	"errors"
	"testing"
)

func testPlayers(ids ...uint) []Player {
	players := make([]Player, len(ids))
	for i, id := range ids {
		players[i] = Player{ID: id, Name: string(rune('A' + i))}
	}
	return players
}

func countTeams(players []Player) [2]int {
	counts := [2]int{}
	for _, player := range players {
		counts[player.Team]++
	}
	return counts
}

func TestRandomTeamSeparatorWithoutPairsKeepsTeamsBalanced(t *testing.T) {
	players := testPlayers(1, 2, 3, 4, 5)

	assigned, err := RandomTeamSeparator(players, nil)
	if err != nil {
		t.Fatalf("RandomTeamSeparator returned an error: %v", err)
	}

	counts := countTeams(assigned)
	if counts[TeamA] != 3 || counts[TeamB] != 2 {
		t.Fatalf("unexpected team counts: Team A=%d, Team B=%d", counts[TeamA], counts[TeamB])
	}
	for _, player := range players {
		if player.Team != TeamA {
			t.Fatalf("input player was modified: %+v", player)
		}
	}
}

func TestRandomTeamSeparatorAssignsSeparationPairsToDifferentTeams(t *testing.T) {
	players := testPlayers(1, 2, 3, 4, 5)
	pairs := []RoomPlayerSeparationPair{
		{PlayerAID: 1, PlayerBID: 2},
		{PlayerAID: 3, PlayerBID: 4},
	}

	assigned, err := RandomTeamSeparator(players, pairs)
	if err != nil {
		t.Fatalf("RandomTeamSeparator returned an error: %v", err)
	}

	teamByID := make(map[uint]Team, len(assigned))
	for _, player := range assigned {
		teamByID[player.ID] = player.Team
	}
	for _, pair := range pairs {
		if teamByID[pair.PlayerAID] == teamByID[pair.PlayerBID] {
			t.Fatalf("players in a separation pair were assigned to the same team: %+v", pair)
		}
	}

	counts := countTeams(assigned)
	if counts[TeamA] != 3 || counts[TeamB] != 2 {
		t.Fatalf("unexpected team counts: Team A=%d, Team B=%d", counts[TeamA], counts[TeamB])
	}
}

func TestRandomTeamSeparatorRejectsPlayersInMultiplePairs(t *testing.T) {
	players := testPlayers(1, 2, 3)
	pairs := []RoomPlayerSeparationPair{
		{PlayerAID: 1, PlayerBID: 2},
		{PlayerAID: 2, PlayerBID: 3},
	}

	_, err := RandomTeamSeparator(players, pairs)
	if !errors.Is(err, ErrInvalidTeamSeparationPair) {
		t.Fatalf("expected ErrInvalidTeamSeparationPair, got %v", err)
	}
}

func TestRandomTeamSeparatorRejectsPlayerOutsideRoom(t *testing.T) {
	players := testPlayers(1, 2)
	pairs := []RoomPlayerSeparationPair{{PlayerAID: 1, PlayerBID: 3}}

	_, err := RandomTeamSeparator(players, pairs)
	if !errors.Is(err, ErrInvalidTeamSeparationPair) {
		t.Fatalf("expected ErrInvalidTeamSeparationPair, got %v", err)
	}
}
