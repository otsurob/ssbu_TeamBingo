package domain

import (
	"math/rand"
)

const BINGO_CENTER = 12
const CHARACTER_MAX = 86
const BINGO_SIZE = 25

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

func RandomTeamSepalator(players []Player) []Player {
	playerReses := append([]Player(nil), players...)
	for i := len(players) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		playerReses[i], playerReses[j] = playerReses[j], playerReses[i]
	}
	return playerReses
}
