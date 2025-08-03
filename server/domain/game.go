package domain

type Room struct {
	ID       uint
	RoomId   string
	RoomName string
	Password string
	BingoA   Bingo
	BingoB   Bingo
}
