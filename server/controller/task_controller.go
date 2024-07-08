package controller

import (
	"math/rand"
	"net/http"
	"server/model"
	"server/usecase"
	"strconv"

	"github.com/labstack/echo/v4"
)

type ITaskController interface {
	GetAllTasks(c echo.Context) error
	CreateTask(c echo.Context) error
	UpdateTask(c echo.Context) error
	DeleteTask(c echo.Context) error
}

type taskController struct {
	tu usecase.ITaskUsecase
}

func NewTaskController(tu usecase.ITaskUsecase) ITaskController {
	return &taskController{tu}
}

func (tc *taskController) GetAllTasks(c echo.Context) error {
	room := c.QueryParam("room")
	tasksRes, err := tc.tu.GetAllTasks(room)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, tasksRes)
}

func (tc *taskController) CreateTask(c echo.Context) error {
	var check [90]bool
	var characterNumber []int
	for len(characterNumber) < 25 {
		num := rand.Intn(86)
		if !check[num] {
			characterNumber = append(characterNumber, num)
			check[num] = true
		}
	}

	var taskResList []model.BingoResponse

	task := model.Bingo{}
	if err := c.Bind(&task); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	for i, v := range characterNumber {
		task.Locate = uint(i)
		task.Character = uint(v)
		if i == 12 {
			task.Status = 1
		} else {
			task.Status = 0
		}
		taskRes, err := tc.tu.CreateTask(task)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err.Error())
		}
		// fmt.Println("called create!")
		taskResList = append(taskResList, taskRes)
	}

	return c.JSON(http.StatusCreated, taskResList)
}

func (tc *taskController) UpdateTask(c echo.Context) error {
	room := c.QueryParam("room")
	team := c.QueryParam("team")
	locate := c.QueryParam("locate")
	teamId, _ := strconv.Atoi(team)
	locateId, _ := strconv.Atoi(locate)

	task := model.Bingo{}
	if err := c.Bind(&task); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	taskRes, err := tc.tu.UpdateTask(task, room, uint(teamId), uint(locateId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, taskRes)
}

func (tc *taskController) DeleteTask(c echo.Context) error {
	room := c.Param("room")

	err := tc.tu.DeleteTask(room)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}
