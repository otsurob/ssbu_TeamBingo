package controller

import (
	"net/http"
	"server/model"
	"server/usecase"
	"strconv"

	"github.com/labstack/echo/v4"
)

type IPlayerController interface {
	GetTeamPlayers(c echo.Context) error
	CreatePlayer(c echo.Context) error
	// UpdatePlayer(c echo.Context) error
	DeletePlayer(c echo.Context) error
}

type playerController struct {
	tu usecase.IPlayerUsecase
}

func NewPlayerController(tu usecase.IPlayerUsecase) IPlayerController {
	return &playerController{tu}
}

func (pc *playerController) GetTeamPlayers(c echo.Context) error {
	room := c.QueryParam("room")
	team := c.QueryParam("team")
	teamNumber, _ := strconv.Atoi(team)
	playersRes, err := pc.tu.GetTeamPlayers(room, uint(teamNumber))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, playersRes)
}

func (pc *playerController) CreatePlayer(c echo.Context) error {

	// var playerResList []model.PlayerResponse

	player := model.Player{}
	if err := c.Bind(&player); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	playerRes, err := pc.tu.CreatePlayer(player)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	// for i, v := range characterNumber {
	// 	player.Locate = uint(i)
	// 	player.Character = uint(v)
	// 	if i == 12 {
	// 		player.Status = 1
	// 	} else {
	// 		player.Status = 0
	// 	}
	// 	playerRes, err := pc.tu.CreatePlayer(player)
	// 	if err != nil {
	// 		return c.JSON(http.StatusInternalServerError, err.Error())
	// 	}
	// 	// fmt.Println("called create!")
	// 	playerResList = append(playerResList, playerRes)
	// }

	return c.JSON(http.StatusCreated, playerRes)
}

// func (pc *playerController) UpdatePlayer(c echo.Context) error {
// 	room := c.QueryParam("room")
// 	team := c.QueryParam("team")
// 	locate := c.QueryParam("locate")
// 	teamId, _ := strconv.Atoi(team)
// 	locateId, _ := strconv.Atoi(locate)

// 	player := model.Player{}
// 	if err := c.Bind(&player); err != nil {
// 		return c.JSON(http.StatusBadRequest, err.Error())
// 	}
// 	playerRes, err := pc.tu.UpdatePlayer(player, room, uint(teamId), uint(locateId))
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, err.Error())
// 	}
// 	return c.JSON(http.StatusOK, playerRes)
// }

func (pc *playerController) DeletePlayer(c echo.Context) error {
	room := c.Param("room")

	err := pc.tu.DeletePlayer(room)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}
