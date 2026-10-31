package domain

import (
	"errors"
	"fmt"
	"math/rand"
)

const BINGO_CENTER = 12
const CHARACTER_MAX = 86
const BINGO_SIZE = 25

var ErrInvalidTeamSeparationPair = errors.New("invalid team separation pair")

func RandomBingoGenerator(include []uint, exclude []uint) []int {
	var check [CHARACTER_MAX]bool
	var excluded [CHARACTER_MAX]bool
	characterNumber := make([]int, 0, BINGO_SIZE)

	// excludeのフラグを立てる
	for _, num := range exclude {
		if num < CHARACTER_MAX {
			excluded[num] = true
		}
	}

	// include は必ずビンゴの候補に入れる。
	for _, num := range include {
		if num >= CHARACTER_MAX || check[num] {
			continue
		}
		characterNumber = append(characterNumber, int(num))
		check[num] = true
	}

	if len(characterNumber) > BINGO_SIZE {
		return characterNumber
	}

	available := 0
	for num := 0; num < CHARACTER_MAX; num++ {
		if !check[num] && !excluded[num] {
			available++
		}
	}
	// 選択可能キャラ数が25以下（エラー保護）
	if len(characterNumber)+available < BINGO_SIZE {
		return characterNumber
	}

	for len(characterNumber) < BINGO_SIZE {
		num := rand.Intn(CHARACTER_MAX)
		if check[num] || excluded[num] {
			continue
		}
		characterNumber = append(characterNumber, num)
		check[num] = true
	}
	rand.Shuffle(BINGO_SIZE, func(i, j int) {
		characterNumber[i], characterNumber[j] = characterNumber[j], characterNumber[i]
	})
	return characterNumber
}

// shufflePlayers は入力のコピーを作り、要素をランダムに並べ替えて返す。
func shufflePlayers(players []Player) []Player {
	playerReses := append([]Player(nil), players...)
	for i := len(players) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		playerReses[i], playerReses[j] = playerReses[j], playerReses[i]
	}
	return playerReses
}

// RandomTeamSeparator はプレイヤーをシャッフルして2チームに均等に振り分ける。
// 分離ペアに設定されたプレイヤーは必ず別チームにする。
func RandomTeamSeparator(
	players []Player,
	pairs []RoomPlayerSeparationPair,
) ([]Player, error) {
	// 分離ペアが設定されていない場合は、既存の振り分け方法を維持する。
	if len(pairs) == 0 {
		shuffledPlayers := shufflePlayers(players)
		for i := range shuffledPlayers {
			shuffledPlayers[i].Team = Team(i % 2)
		}
		return shuffledPlayers, nil
	}

	playersByID := make(map[uint]Player, len(players))
	for _, player := range players {
		if _, exists := playersByID[player.ID]; exists {
			return nil, fmt.Errorf("%w: duplicate player id %d", ErrInvalidTeamSeparationPair, player.ID)
		}
		playersByID[player.ID] = player
	}

	teamByPlayerID := make(map[uint]Team, len(players))
	teamCounts := [2]int{}
	for _, pair := range pairs {
		if pair.PlayerAID == pair.PlayerBID {
			return nil, fmt.Errorf(
				"%w: player %d cannot be paired with itself",
				ErrInvalidTeamSeparationPair,
				pair.PlayerAID,
			)
		}
		if _, exists := playersByID[pair.PlayerAID]; !exists {
			return nil, fmt.Errorf(
				"%w: player %d is not in the room",
				ErrInvalidTeamSeparationPair,
				pair.PlayerAID,
			)
		}
		if _, exists := playersByID[pair.PlayerBID]; !exists {
			return nil, fmt.Errorf(
				"%w: player %d is not in the room",
				ErrInvalidTeamSeparationPair,
				pair.PlayerBID,
			)
		}
		if _, exists := teamByPlayerID[pair.PlayerAID]; exists {
			return nil, fmt.Errorf(
				"%w: player %d belongs to multiple pairs",
				ErrInvalidTeamSeparationPair,
				pair.PlayerAID,
			)
		}
		if _, exists := teamByPlayerID[pair.PlayerBID]; exists {
			return nil, fmt.Errorf(
				"%w: player %d belongs to multiple pairs",
				ErrInvalidTeamSeparationPair,
				pair.PlayerBID,
			)
		}

		teamA, teamB := TeamA, TeamB
		if rand.Intn(2) == 1 {
			teamA, teamB = teamB, teamA
		}
		teamByPlayerID[pair.PlayerAID] = teamA
		teamByPlayerID[pair.PlayerBID] = teamB
		teamCounts[teamA]++
		teamCounts[teamB]++
	}

	unpairedPlayers := make([]Player, 0, len(players)-len(teamByPlayerID))
	for _, player := range players {
		if _, paired := teamByPlayerID[player.ID]; paired {
			continue
		}
		unpairedPlayers = append(unpairedPlayers, player)
	}
	shuffledUnpairedPlayers := shufflePlayers(unpairedPlayers)

	// 分離ペアに含まれないプレイヤーは人数の少ないチームに割り当てる。
	// 人数が同じ場合はTeam Aに割り当てる。
	for _, player := range shuffledUnpairedPlayers {
		team := TeamA
		switch {
		case teamCounts[TeamA] > teamCounts[TeamB]:
			team = TeamB
		}
		teamByPlayerID[player.ID] = team
		teamCounts[team]++
	}

	assignedPlayers := append([]Player(nil), players...)
	for i := range assignedPlayers {
		assignedPlayers[i].Team = teamByPlayerID[assignedPlayers[i].ID]
	}
	// 既存のレスポンス順もランダムに保つ。
	return shufflePlayers(assignedPlayers), nil
}
