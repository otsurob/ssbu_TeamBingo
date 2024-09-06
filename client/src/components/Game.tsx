import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ResponseBingo, ResponsePlayer } from '../types'
import { useMedia } from 'use-media'
import { SmallBingoTable } from './SmallBingoTable'
import { NormalBingoTable } from './NormalBingoTable'

export default function Game() {
  const [bingos, setBingos] = useState<ResponseBingo[]>([])
  const [team1Players, setTeam1Players] = useState<ResponsePlayer[]>([])
  const [team2Players, setTeam2Players] = useState<ResponsePlayer[]>([])
  useEffect(() => {
    axios
      .get<
        ResponseBingo[]
      >(`${process.env.REACT_APP_API_URL}/bingo?room=${room}`)
      .then((res) => {
        setBingos(res.data)
      })
    axios
      .get<
        ResponsePlayer[]
      >(`${process.env.REACT_APP_API_URL}/player?room=${room}&team=1`)
      .then((res) => {
        setTeam1Players(res.data)
      })
    axios
      .get<
        ResponsePlayer[]
      >(`${process.env.REACT_APP_API_URL}/player?room=${room}&team=2`)
      .then((res) => {
        setTeam2Players(res.data)
      })
  }, [])

  const isWide = useMedia({ minWidth: '1000px' })
  const [searchParams] = useSearchParams()
  const room = searchParams.get('room')
  const team = searchParams.get('team')
  const name = searchParams.get('name')

  const navigate = useNavigate()

  if (!room || !name) {
    navigate('/')
    return null
  }

  const changeStatusTeam = (locate: number, team: number) => {
    if (window.confirm('状態を更新しますか？')) {
      const tempBingos = bingos.concat()
      const changedStatusNumber =
        tempBingos[locate + 25 * (team - 1)].status ^ 1
      tempBingos[locate + 25 * (team - 1)].status = changedStatusNumber
      const updateElement = {
        status: changedStatusNumber,
      }
      axios.put(
        `${process.env.REACT_APP_API_URL}/update?room=${room}&team=${team}&locate=${locate}`,
        updateElement,
      )
      console.log(tempBingos)
      setBingos(tempBingos)
    }
  }

  const deleteGame = async () => {
    if (window.confirm('部屋を解散しますか？')) {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/bingo?room=${room}`)
        .then(async (res) => {
          if (res.data.length !== 0) {
            await axios.delete(`${process.env.REACT_APP_API_URL}/${room}`)
          }
          navigate('/')
        })
      let isTeam1Existed = false
      let isTeam2Existed = false
      await axios
        .get(`${process.env.REACT_APP_API_URL}/player?room=${room}&team=1`)
        .then(async (res) => {
          if (res.data.length !== 0) {
            isTeam1Existed = true
          }
        })
      await axios
        .get(`${process.env.REACT_APP_API_URL}/player?room=${room}&team=2`)
        .then(async (res) => {
          if (res.data.length !== 0) {
            isTeam2Existed = true
          }
        })
      if (isTeam1Existed || isTeam2Existed) {
        console.log('wow')
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/leavePlayer/${room}`,
        )
      }
      navigate('/')
    }
  }

  const exitGame = async () => {
    if (window.confirm('部屋は残したまま退出しますか？')) {
      await axios
        .get(
          `${process.env.REACT_APP_API_URL}/player?room=${room}&team=${team}`,
        )
        .then(async (res) => {
          if (res.data.length !== 0) {
            await axios.delete(
              `${process.env.REACT_APP_API_URL}/leaveOnePlayer?room=${room}&name=${name}&team=${team}`,
            )
          }
        })
      navigate('/')
    }
  }

  return (
    <div>
      <>
        {isWide ? (
          <NormalBingoTable
            bingos={bingos}
            team1Players={team1Players}
            team2Players={team2Players}
            changeStatusTeam={changeStatusTeam}
            deleteGame={deleteGame}
            exitGame={exitGame}
          />
        ) : (
          <SmallBingoTable
            bingos={bingos}
            team1Players={team1Players}
            team2Players={team2Players}
            changeStatusTeam={changeStatusTeam}
            deleteGame={deleteGame}
            exitGame={exitGame}
          />
        )}
      </>
    </div>
  )
}
