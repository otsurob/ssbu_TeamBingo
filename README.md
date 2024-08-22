# チームビンゴ Web アプリ

大乱闘スマッシュブラザーズ SPECIAL(以下スマブラ) の対戦に付随したミニゲームの Web アプリを作成

## 作成背景

スマブラを対戦するコミュニティで流行している "チームビンゴ"というゲームがある。これまでは別サイトの、キャラクターが表示されるビンゴ表を利用してゲームを行っていたが、ビンゴ表が 1 枚しか表示されない・複数人が同じビンゴ表を見れない等の不便さが残っていた。そこで今回その問題を解決すべく、1 画面に 2 枚のビンゴ表を表示し、複数人がアクセスできるような Web アプリケーションを作成した。

## チームビンゴの概要

- 4-7 人でプレイすることを想定。2 チームに分かれて行う。
- チームごとに使用するビンゴ表を決め、これのマスを埋めることを目的とする。
- 各チームから 2 人を選出し、スマブラで 2 対 2 のチーム戦を行う。このとき使用するキャラクターは各チームのビンゴ表に存在するキャラクターのみ使用可能。試合に勝利したチームはその試合で使ったキャラクターのマスを埋める。これを繰り返す。
- 先にビンゴ表上で縦・横・斜めのラインで 2 ビンゴを達成したチームの勝利となる。

## 使用言語・フレームワーク

- フロントエンド
  React (TypeScript)
- バックエンド
  Echo (Go 言語)

## アプリ使用方法

- 最初の画面で、"名前"には自信のプレイヤーネーム、"合言葉"には部屋を識別するための文字列を入力し、参加する Team を選択してください。
- 上記内容を入力後、参加者の誰か 1 人が"部屋をつくる"ボタンで部屋を作成してください。"合言葉"で指定した部屋が既に存在する場合は作成できません。
- 部屋を作成しない参加者は"部屋に入る"ボタンで部屋に参加してください。"合言葉"で指定した部屋が存在しない場合は部屋に入ることはできません。
- 部屋に入ると既にランダムに生成されたビンゴ表が表示されています。ビンゴ表のマスを埋めるときは対応するキャラクターのマスを選択し、状態を更新してください。
- 基本的にはそれぞれの参加者が、ゲームで勝利したときに使用したキャラクターのマスを埋めてください。他の参加者の入力が終わったあとにページのリロードを行うと他の参加者の入力が反映されます。
- ゲームが終了したら参加者のうちだれか 1 人が**必ず**"終了"ボタンで部屋を削除してください。"退出"ボタンは部屋を抜けるためのもので、部屋の削除は行いません。

![TeamBingo1](https://github.com/otsurob/ssbu_TeamBingo/assets/129499838/5ecb40eb-8bb7-428c-be15-b71bbe97d398)

![TeamBingo2](https://github.com/otsurob/ssbu_TeamBingo/assets/129499838/181a8303-9cf0-4546-9987-c7062832cf8d)

https://team-bingo-client.vercel.app/
