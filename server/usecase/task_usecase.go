package usecase

import (
	"server/model"
	"server/repository"
	"server/validator"
)

type ITaskUsecase interface {
	GetAllTasks(room string) ([]model.BingoResponse, error)
	CreateTask(task model.Bingo) (model.BingoResponse, error)
	UpdateTask(task model.Bingo, room string, team uint, locate uint) (model.BingoResponse, error)
	DeleteTask(room string) error
}

type taskUsecase struct {
	tr repository.ITaskRepository
	tv validator.ITaskValidator
}

func NewTaskUsecase(tr repository.ITaskRepository, tv validator.ITaskValidator) ITaskUsecase {
	return &taskUsecase{tr, tv}
}

func (tu *taskUsecase) GetAllTasks(room string) ([]model.BingoResponse, error) {
	tasks := []model.Bingo{}
	if err := tu.tr.GetAllTasks(&tasks, room); err != nil {
		return nil, err
	}
	//クライアントへのレスポンス用
	resTasks := []model.BingoResponse{}
	for _, v := range tasks {
		t := model.BingoResponse(v)
		// t := model.TaskResponse{
		// 	ID:        v.ID,
		// 	Room:      v.Room,
		// 	Team:      v.Team,
		// 	Locate:    v.Locate,
		// 	Status:    v.Status,
		// 	Character: v.Character,
		// }
		resTasks = append(resTasks, t)
	}
	return resTasks, nil
}

func (tu *taskUsecase) CreateTask(task model.Bingo) (model.BingoResponse, error) {
	//バリデーションのチェック
	if err := tu.tv.TaskValidate(task); err != nil {
		return model.BingoResponse{}, err
	}
	//引数で渡したアドレスの指し示す値が書き換わっている(&taskの話)
	if err := tu.tr.CreateTask(&task); err != nil {
		return model.BingoResponse{}, err
	}
	resTask := model.BingoResponse{
		ID:        task.ID,
		Room:      task.Room,
		Team:      task.Team,
		Locate:    task.Locate,
		Status:    task.Status,
		Character: task.Character,
	}
	return resTask, nil
}

func (tu *taskUsecase) UpdateTask(task model.Bingo, room string, team uint, locate uint) (model.BingoResponse, error) {
	// if err := tu.tv.TaskValidate(task); err != nil {
	// 	return model.TaskResponse{}, err
	// }
	if err := tu.tr.UpdateTask(&task, room, team, locate); err != nil {
		return model.BingoResponse{}, err
	}
	resTask := model.BingoResponse{
		ID:        task.ID,
		Room:      task.Room,
		Team:      task.Team,
		Locate:    task.Locate,
		Status:    task.Status,
		Character: task.Character,
	}
	return resTask, nil
}

func (tu *taskUsecase) DeleteTask(room string) error {
	if err := tu.tr.DeleteTask(room); err != nil {
		return err
	}
	return nil
}
