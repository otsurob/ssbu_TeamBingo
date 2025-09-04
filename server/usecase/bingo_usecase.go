// GetAllBingos, CreateBingo について、2チーム分一気に処理するか1チームずつ処理するか、どうする?
package usecase

import (
	"server/domain"
	"server/repository"
)

type IBingoUsecase interface {
	GetTwoBingos(roomName string) ([]domain.BingoResponse, error)
	CreateBingos(bingo domain.Bingo) ([]domain.BingoResponse, error)
	UpdateCell(cell domain.Cell, roomName string, team domain.Team, row uint, col uint) (domain.CellResponse, error)
	DeleteBingos(roomName string) error
}

// usecase のソースコードはrepositoryのインターフェースだけに依存させる
type bingoUsecase struct {
	br repository.IBingoRepository
	rr repository.IRoomRepository
}

// 依存性を注入するためのコンストラクタ
// bingoUsecase の構造体の実体を作成
func NewBingoUsecase(br repository.IBingoRepository, rr repository.IRoomRepository) IBingoUsecase {
	return &bingoUsecase{br, rr}
}

func (bu *bingoUsecase) GetTwoBingos(roomName string) ([]domain.BingoResponse, error) {
	resBingos := []domain.BingoResponse{}
	// repository のGetAllBingosの引数にbingosのアドレスを渡すことで、そのアドレスに値(データベースから取得したデータ)が書き込まれていく
	Team := []domain.Team{domain.TeamA, domain.TeamB}
	// teamは0, 1
	for _, team := range Team {
		bingo := domain.Bingo{}
		cells := []domain.Cell{}
		// repositoryのメソッドを呼んで、bingo, cellsに値を格納
		if err := bu.br.GetBingo(&bingo, roomName, team); err != nil {
			return nil, err
		}
		if err := bu.br.GetCells(&cells, bingo.ID); err != nil {
			return nil, err
		}
		//クライアントへのレスポンス用
		resBingo := domain.BingoResponse{
			ID:       bingo.ID,
			RoomName: bingo.RoomName,
			Team:     bingo.Team,
			// ここってCellいらない？確認 -> いらない
		}
		// 生成された全セルを順番にresBingoに入れていく
		for _, v := range cells {
			c := domain.CellResponse{
				ID:        v.ID,
				Row:       v.Row,
				Col:       v.Col,
				Status:    v.Status,
				Character: v.Character,
				BingoId:   bingo.ID,
			}
			resBingo.CellReses = append(resBingo.CellReses, c)
		}
		resBingos = append(resBingos, resBingo)
	}
	return resBingos, nil
}

func (bu *bingoUsecase) CreateBingos(bingo domain.Bingo) ([]domain.BingoResponse, error) {
	// これここで宣言して大丈夫？後半で追加処理しかしてないから2ビンゴ分追加されそう
	resBingos := []domain.BingoResponse{}
	Team := []domain.Team{domain.TeamA, domain.TeamB}

	room := domain.Room{}
	if err := bu.rr.GetRoom(&room, bingo.RoomName); err != nil {
		return nil, err
	}
	for _, team := range Team {
		characterNumber := domain.RandomBingoGenerator()

		newBingo := domain.Bingo{
			RoomName: bingo.RoomName,
			Team:     team,
			RoomId:   room.ID,
		}

		if err := bu.br.CreateBingo(&newBingo); err != nil {
			return nil, err
		}

		cellReses := []domain.CellResponse{}

		for i, v := range characterNumber {
			newCell := domain.Cell{
				Row:       (uint)(i / 5),
				Col:       (uint)(i % 5),
				Status:    domain.NON_GOT,
				Character: uint(v),
				BingoId:   newBingo.ID,
			}
			// ビンゴの中央は最初から埋まってる
			if i == domain.BINGO_CENTER {
				newCell.Status = domain.GOTTEN
			}
			if err := bu.br.CreateCell(&newCell); err != nil {
				return nil, err
			}
			cellRes := domain.CellResponse{
				ID:        newCell.ID,
				Row:       newCell.Row,
				Col:       newCell.Col,
				Status:    newCell.Status,
				Character: newCell.Character,
				BingoId:   newCell.BingoId,
			}
			cellReses = append(cellReses, cellRes)
		}
		resBingo := domain.BingoResponse{
			ID:        bingo.ID,
			RoomName:  bingo.RoomName,
			Team:      bingo.Team,
			CellReses: cellReses,
		}

		resBingos = append(resBingos, resBingo)
	}
	return resBingos, nil
}

func (bu *bingoUsecase) UpdateCell(cell domain.Cell, roomName string, team domain.Team, row uint, col uint) (domain.CellResponse, error) {
	bingo := domain.Bingo{}
	// cellを特定するためのbingoIDを取得
	if err := bu.br.GetBingo(&bingo, roomName, team); err != nil {
		return domain.CellResponse{}, err
	}
	if err := bu.br.UpdateCell(&cell, bingo.ID, row, col); err != nil {
		return domain.CellResponse{}, err
	}
	resCell := domain.CellResponse{
		ID:      cell.ID,
		BingoId: cell.BingoId,
		Row:     cell.Row,
		Col:     cell.Col,
		Status:  cell.Status,
	}
	return resCell, nil
}

func (bu *bingoUsecase) DeleteBingos(roomName string) error {
	if err := bu.br.DeleteBingos(roomName); err != nil {
		return err
	}
	return nil
}
