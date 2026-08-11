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
