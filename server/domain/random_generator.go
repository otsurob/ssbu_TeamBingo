package domain

import (
	"math/rand"
)

const BINGO_CENTER = 12
const CHARACTER_MAX = 86
const BINGO_SIZE = 25

func RandomBingoGenerator() []int {
	var check [CHARACTER_MAX]bool
	var characterNumber []int
	for len(characterNumber) < BINGO_SIZE {
		num := rand.Intn(CHARACTER_MAX)
		if !check[num] {
			characterNumber = append(characterNumber, num)
			check[num] = true
		}
	}
	return characterNumber
}

func RandomTeamSepalator(players []Player) []Player {
	playerReses := append([]Player(nil), players...)
	for i := len(players) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		playerReses[i], playerReses[j] = playerReses[j], playerReses[i]
	}
	return playerReses
}
