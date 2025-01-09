package validator

import (
	"server/domain"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

type ITaskValidator interface {
	TaskValidate(task domain.Bingo) error
}

type taskValidator struct{}

func NewTaskValidator() ITaskValidator {
	return &taskValidator{}
}

// バリデーションで評価したいtaskを引数で受け取る
func (tv *taskValidator) TaskValidate(task domain.Bingo) error {
	return validation.ValidateStruct(&task,
		validation.Field(
			//taskのタイトルに対するバリデーション
			&task.Room,
			//タイトルに値が存在するか
			validation.Required.Error("room is required"),
			//文字数が1-10であるか
			validation.RuneLength(1, 100).Error("limited max 100 char"),
		),
	)
}
