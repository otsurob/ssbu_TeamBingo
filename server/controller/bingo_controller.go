package controller

import (
	"net/http"
	"server/domain"
	"server/usecase"
	"strconv"

	"github.com/labstack/echo/v4"
)

type IBingoController interface {
	GetTwoBingos(c echo.Context) error
	CreateBingos(c echo.Context) error
	UpdateCell(c echo.Context) error
	DeleteBingos(c echo.Context) error
}

type bingoController struct {
	tu usecase.IBingoUsecase
}

func NewBingoController(tu usecase.IBingoUsecase) IBingoController {
	return &bingoController{tu}
}

func (tc *bingoController) GetTwoBingos(c echo.Context) error {
	roomName := c.QueryParam("room")
	bingosRes, err := tc.tu.GetTwoBingos(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, bingosRes)
}

func (tc *bingoController) CreateBingos(c echo.Context) error {
	// Bindってどんなことしてる? bingo, cellsをそれぞれBindするには???
	bingo := domain.Bingo{}
	// cells := []domain.Cell{}
	if err := c.Bind(&bingo); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	// if err := c.Bind(&cells); err != nil {
	// 	return c.JSON(http.StatusBadRequest, err.Error())
	// }
	bingoResList, err := tc.tu.CreateBingos(bingo)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, bingoResList)
}

func (tc *bingoController) UpdateCell(c echo.Context) error {
	roomName := c.QueryParam("room")
	team := c.QueryParam("team")
	row := c.QueryParam("row")
	col := c.QueryParam("col")
	teamId, _ := strconv.Atoi(team)
	rowNum, _ := strconv.Atoi(row)
	colNum, _ := strconv.Atoi(col)

	cell := domain.Cell{}
	if err := c.Bind(&cell); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	cellRes, err := tc.tu.UpdateCell(cell, roomName, domain.Team(teamId), uint(rowNum), uint(colNum))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, cellRes)
}

func (tc *bingoController) DeleteBingos(c echo.Context) error {
	roomName := c.Param("room")

	err := tc.tu.DeleteBingos(roomName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}
