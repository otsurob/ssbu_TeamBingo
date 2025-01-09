package domain

import (
	"math/rand"
)

const BINGO_CENTER = 12
const CHARACTER_MAX = 86
const BINGO_SIZE = 25

func RandomGenerator() []int {
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
