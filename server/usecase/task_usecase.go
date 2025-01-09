package usecase

import (
	"server/domain"
	"server/repository"
	"server/validator"
)

type ITaskUsecase interface {
	GetAllTasks(room string) ([]domain.BingoResponse, error)
	CreateTask(task domain.Bingo) ([]domain.BingoResponse, error)
	UpdateTask(task domain.Bingo, room string, team uint, locate uint) (domain.BingoResponse, error)
	DeleteTask(room string) error
}

// usecase のソースコードはrepositoryのインターフェースだけに依存させる
type taskUsecase struct {
	tr repository.ITaskRepository
	tv validator.ITaskValidator
}

// 依存性を注入するためのコンストラクタ
// taskUsecase の構造体の実体を作成
func NewTaskUsecase(tr repository.ITaskRepository, tv validator.ITaskValidator) ITaskUsecase {
	return &taskUsecase{tr, tv}
}

func (tu *taskUsecase) GetAllTasks(room string) ([]domain.BingoResponse, error) {
	tasks := []domain.Bingo{}
	// repository のGetAllTasksの引数にtasksのアドレスを渡すことで、そのアドレスに値(データベースから取得したデータ)が書き込まれていく
	if err := tu.tr.GetAllTasks(&tasks, room); err != nil {
		return nil, err
	}
	//クライアントへのレスポンス用
	resTasks := []domain.BingoResponse{}
	for _, v := range tasks {
		t := domain.BingoResponse{
			ID:        v.ID,
			Team:      v.Team,
			Locate:    v.Locate,
			Status:    v.Status,
			Character: v.Character,
		}
		resTasks = append(resTasks, t)
	}
	return resTasks, nil
}

func (tu *taskUsecase) CreateTask(task domain.Bingo) ([]domain.BingoResponse, error) {
	characterNumber := domain.RandomGenerator()

	var taskResList []domain.BingoResponse

	for i, v := range characterNumber {
		newTask := domain.Bingo{
			Room:      task.Room,
			Team:      task.Team,
			Locate:    uint(i),
			Character: uint(v),
			Status:    0,
		}
		if i == domain.BINGO_CENTER {
			newTask.Status = 1
		}
		if err := tu.tr.CreateTask(&newTask); err != nil {
			return []domain.BingoResponse{}, err
		}
		taskRes := domain.BingoResponse{
			ID:        newTask.ID,
			Team:      newTask.Team,
			Locate:    newTask.Locate,
			Status:    newTask.Status,
			Character: newTask.Character,
		}
		taskResList = append(taskResList, taskRes)
	}

	//バリデーションのチェック
	if err := tu.tv.TaskValidate(task); err != nil {
		return []domain.BingoResponse{}, err
	}
	return taskResList, nil
}

func (tu *taskUsecase) UpdateTask(task domain.Bingo, room string, team uint, locate uint) (domain.BingoResponse, error) {
	if err := tu.tr.UpdateTask(&task, room, team, locate); err != nil {
		return domain.BingoResponse{}, err
	}
	resTask := domain.BingoResponse{
		ID:        task.ID,
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
