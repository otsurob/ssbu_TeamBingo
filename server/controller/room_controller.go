package controller

import (
	"net/http"
	"server/domain"
	"server/usecase"

	"github.com/labstack/echo/v4"
)

type IRoomController interface {
	GetAllRooms(c echo.Context) error
	GetRoom(c echo.Context) error
	CreateRoom(c echo.Context) error
	DeleteRoom(c echo.Context) error
	CheckRoomPassword(c echo.Context) error
	GetPlayer(c echo.Context) error
	GetPlayers(c echo.Context) error
	CreatePlayer(c echo.Context) error
	UpdatePlayerTeam(c echo.Context) error
	DividePlayerTeam(c echo.Context) error
	DeletePlayer(c echo.Context) error
	DeleteOnePlayer(c echo.Context) error
}

type roomController struct {
	ru usecase.IRoomUsecase
}

func NewRoomController(ru usecase.IRoomUsecase) IRoomController {
	return &roomController{ru}
}

func (rc *roomController) GetAllRooms(c echo.Context) error {
	roomRes, err := rc.ru.GetAllRooms()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, roomRes)
}

func (rc *roomController) GetRoom(c echo.Context) error {
	roomName := c.QueryParam("room")
	roomRes, err := rc.ru.GetRoom(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, roomRes)
}

func (rc *roomController) CreateRoom(c echo.Context) error {
	room := domain.Room{}
	if err := c.Bind(&room); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	roomRes, err := rc.ru.CreateRoom(room)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, roomRes)
}

func (rc *roomController) DeleteRoom(c echo.Context) error {
	roomName := c.Param("room")

	err := rc.ru.DeleteRoom(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}

func (rc *roomController) CheckRoomPassword(c echo.Context) error {
	roomName := c.QueryParam("room")
	password := c.QueryParam("password")
	roomPasswordRes, err := rc.ru.CheckRoomPassword(roomName, password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, roomPasswordRes)
}

func (rc *roomController) GetPlayer(c echo.Context) error {
	roomName := c.QueryParam("room")
	name := c.QueryParam("name")
	playerRes, err := rc.ru.GetPlayer(roomName, name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, playerRes)
}

func (rc *roomController) GetPlayers(c echo.Context) error {
	roomName := c.QueryParam("room")
	// 前の変更　チームいらんくね？
	// team := c.QueryParam("team")
	// teamNumber, _ := strconv.Atoi(team)
	playersReses, err := rc.ru.GetPlayers(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, playersReses)
}

func (rc *roomController) CreatePlayer(c echo.Context) error {
	roomName := c.QueryParam("room")
	player := domain.Player{}
	if err := c.Bind(&player); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	playerRes, err := rc.ru.CreatePlayer(player, roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, playerRes)
}

func (rc *roomController) UpdatePlayerTeam(c echo.Context) error {
	roomName := c.QueryParam("room")
	name := c.QueryParam("name")
	player := domain.Player{}
	if err := c.Bind(&player); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	playerRes, err := rc.ru.UpdatePlayerTeam(player, name, roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, playerRes)
}

func (rc *roomController) DividePlayerTeam(c echo.Context) error {
	roomName := c.QueryParam("room")
	//updateなのに&Bindしなくていいの？
	// cell := domain.Cell{}
	// if err := c.Bind(&cell); err != nil {
	// 	return c.JSON(http.StatusBadRequest, err.Error())
	// }
	playerReses, err := rc.ru.DividePlayerTeam(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, playerReses)
}

func (rc *roomController) DeletePlayer(c echo.Context) error {
	roomName := c.Param("room")

	err := rc.ru.DeletePlayer(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}

func (rc *roomController) DeleteOnePlayer(c echo.Context) error {
	roomName := c.QueryParam("room")
	name := c.QueryParam("name")

	err := rc.ru.DeleteOnePlayer(roomName, name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}
