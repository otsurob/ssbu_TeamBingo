package controller

import (
	"net/http"
	"server/domain"
	"server/usecase"
	"strconv"

	"github.com/labstack/echo/v4"
)

type IRoomController interface {
	GetAllRooms(c echo.Context) error
	CreateRoom(c echo.Context) error
	DeleteRoom(c echo.Context) error
	GetTeamPlayers(c echo.Context) error
	CreatePlayer(c echo.Context) error
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
	roomName := c.QueryParam("name")

	err := rc.ru.DeleteRoom(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}

func (rc *roomController) GetTeamPlayers(c echo.Context) error {
	room := c.QueryParam("room")
	team := c.QueryParam("team")
	teamNumber, _ := strconv.Atoi(team)
	playersRes, err := rc.ru.GetTeamPlayers(room, uint(teamNumber))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, playersRes)
}

func (rc *roomController) CreatePlayer(c echo.Context) error {

	player := domain.Player{}
	if err := c.Bind(&player); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	playerRes, err := rc.ru.CreatePlayer(player)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, playerRes)
}

func (rc *roomController) DeletePlayer(c echo.Context) error {
	room := c.Param("room")

	err := rc.ru.DeletePlayer(room)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}

func (rc *roomController) DeleteOnePlayer(c echo.Context) error {
	room := c.QueryParam("room")
	name := c.QueryParam("name")
	team := c.QueryParam("team")
	teamNumber, _ := strconv.Atoi(team)

	err := rc.ru.DeleteOnePlayer(room, name, uint(teamNumber))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}
