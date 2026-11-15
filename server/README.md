# Server

## ローカル環境構築

dockerの起動

```
docker compose up -d
```

DBマイグレーション

```
GO_ENV=dev go run migrate/migrate.go
```

サーバー起動

```
GO_ENV=dev go run main.go
```

## API一覧

| Method | Path | 役割 | クエリパラメータ | Body（JSON） | 成功時 |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/bingos` | ルームの2チーム分のビンゴを取得 | `room`: ルーム名 | — | `200` ビンゴ配列 |
| `POST` | `/createBingo` | 2チーム分のビンゴを生成 | — | `room_name`: ルーム名 | `201` ビンゴ配列 |
| `PUT` | `/updateCell` | 指定したビンゴマスの状態を更新 | `room`: ルーム名<br>`team`: チーム（`0`: A、`1`: B）<br>`row`: 行番号<br>`col`: 列番号 | `status`: 状態（`0`: 未獲得、`1`: 獲得済み） | `200` 更新後のマス |
| `DELETE` | `/deleteBingos` | ルームのビンゴをすべて削除 | `room`: ルーム名 | — | `204` |
| `GET` | `/rooms` | ルーム一覧を取得 | — | — | `200` ルーム配列 |
| `GET` | `/room` | 指定したルームを取得 | `room`: ルーム名 | — | `200` ルーム |
| `POST` | `/createRoom` | ルームを作成 | — | `room_name`: ルーム名<br>`password`: パスワード | `201` 作成したルーム |
| `GET` | `/roomCharacterSettings` | ルームの両チームのキャラクター設定を取得 | `room`: ルーム名 | — | `200` キャラクター設定配列 |
| `PUT` | `/updateRoomCharacterSetting` | 指定チームのキャラクター設定を更新 | `room`: ルーム名 | `team`: チーム（`0`: A、`1`: B）<br>`include`: 必ず含めるキャラクター番号配列<br>`exclude`: 除外するキャラクター番号配列 | `204` |
| `GET` | `/roomPlayerSeparationPairs` | ルームの分離ペア一覧を取得 | `room`: ルーム名 | — | `200` 分離ペア配列 |
| `POST` | `/roomPlayerSeparationPair` | 別チームにするプレイヤーペアを登録 | `room`: ルーム名 | `player_a_id`: 1人目のプレイヤーID<br>`player_b_id`: 2人目のプレイヤーID | `201` 登録した分離ペア |
| `DELETE` | `/roomPlayerSeparationPair` | 登録済みの分離ペアを削除 | `room`: ルーム名<br>`id`: 分離ペアID | — | `204` |
| `DELETE` | `/deleteRoom` | ルームを削除 | `room`: ルーム名 | — | `204` |
| `GET` | `/roomPassword` | 入力されたルームパスワードが一致するか確認 | `room`: ルーム名<br>`password`: パスワード | — | `200` 真偽値 |
| `GET` | `/player` | ルーム内の指定プレイヤーを取得 | `room`: ルーム名<br>`name`: プレイヤー名 | — | `200` プレイヤー |
| `GET` | `/players` | ルーム内のプレイヤー一覧を取得 | `room`: ルーム名 | — | `200` プレイヤー配列 |
| `POST` | `/joinPlayer` | プレイヤーをルームに参加させる | `room`: ルーム名 | `name`: プレイヤー名<br>`room_name`: ルーム名<br>`team`: チーム（`0`: A、`1`: B、`2`: 観戦者） | `201` 作成したプレイヤー |
| `PUT` | `/updatePlayerTeam` | プレイヤーのチームまたは名前を更新 | `room`: ルーム名<br>`name`: 更新前のプレイヤー名 | `team`: 更新後のチーム、または `name`: 更新後の名前 | `200` 更新後のプレイヤー |
| `PUT` | `/dividePlayers` | 分離ペアを考慮してプレイヤーを2チームに振り分け | `room`: ルーム名 | — | `200` 振り分け後のプレイヤー配列 |
| `DELETE` | `/deletePlayer` | ルーム内のプレイヤーをすべて削除 | `room`: ルーム名 | — | `204` |
| `DELETE` | `/deleteOnePlayer` | ルーム内の指定プレイヤーを削除 | `room`: ルーム名<br>`name`: プレイヤー名 | — | `204` |
| `GET` | `/ws` | ルームのWebSocket接続を開始 | `room`: ルーム名 | — | `101` WebSocketへ切り替え |

## テーブルの確認

開発用DBへ接続します。

```bash
docker compose exec dev-postgres psql -U otsu -d otsu
```

テーブル一覧と各テーブルの定義は、次のコマンドで確認できます。

```sql
\dt
\d rooms
\d players
\d bingos
\d cells
```

登録されているデータを確認する例です。

```sql
SELECT * FROM rooms;
SELECT * FROM players;
SELECT * FROM bingos;
SELECT * FROM cells;
```

## データベース

PostgreSQLを使用し、GORMの`AutoMigrate`によって以下の4テーブルを作成します。

### `rooms`

| カラム      | PostgreSQL型 | NULL | 制約・説明       |
| ----------- | ------------ | ---- | ---------------- |
| `id`        | `bigserial`  | 不可 | 主キー           |
| `room_name` | `text`       | 不可 | 部屋名           |
| `password`  | `text`       | 不可 | 部屋のパスワード |

### `players`

| カラム      | PostgreSQL型 | NULL | 制約・説明                                      |
| ----------- | ------------ | ---- | ----------------------------------------------- |
| `id`        | `bigserial`  | 不可 | 主キー                                          |
| `name`      | `text`       | 不可 | プレイヤー名                                    |
| `room_name` | `text`       | 不可 | 部屋名                                          |
| `team`      | `bigint`     | 不可 | 所属先。`0`: チームA、`1`: チームB、`2`: 観戦者 |
| `room_id`   | `bigint`     | 不可 | `rooms.id`を参照する外部キー                    |

`rooms`が削除された場合、紐づく`players`も`ON DELETE CASCADE`によって削除されます。

現時点では`room_name`と`name`に複合ユニーク制約はありません。同じ部屋・同じ名前で通常の再入室が行われた場合は、アプリケーション側で既存レコードを返し、新規レコードを作成しません。

### `bingos`

| カラム      | PostgreSQL型 | NULL | 制約・説明                             |
| ----------- | ------------ | ---- | -------------------------------------- |
| `id`        | `bigserial`  | 不可 | 主キー                                 |
| `room_name` | `text`       | 不可 | 部屋名                                 |
| `team`      | `bigint`     | 不可 | 対象チーム。`0`: チームA、`1`: チームB |
| `room_id`   | `bigint`     | 不可 | `rooms.id`を参照する外部キー           |

`rooms`が削除された場合、紐づく`bingos`も`ON DELETE CASCADE`によって削除されます。

### `cells`

| カラム      | PostgreSQL型 | NULL | 制約・説明                             |
| ----------- | ------------ | ---- | -------------------------------------- |
| `id`        | `bigserial`  | 不可 | 主キー                                 |
| `row`       | `bigint`     | 不可 | ビンゴ表の行番号                       |
| `col`       | `bigint`     | 不可 | ビンゴ表の列番号                       |
| `status`    | `bigint`     | 不可 | マスの状態。`0`: 未獲得、`1`: 獲得済み |
| `character` | `bigint`     | 可   | キャラクターを表す値                   |
| `bingo_id`  | `bigint`     | 不可 | `bingos.id`を参照する外部キー          |

`bingos`が削除された場合、紐づく`cells`も`ON DELETE CASCADE`によって削除されます。
