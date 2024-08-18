import {
  Container,
  Center,
  Card,
  CardBody,
  Input,
  FormControl,
  FormLabel,
  Button,
  useToast,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const toast = useToast()
  const navigate = useNavigate()
  const [team, setTeam] = useState('1')
  let flag = false
  const infList = []

  const [name, setName] = useState('')
  const [room, setRoom] = useState('')

  const makeRoom = async () => {
    if (name == '' || room == '') {
      toast({
        title: '名前と合言葉を入力してください',
        status: 'error',
        isClosable: true,
        position: 'top',
      })
      return
    }
    const cb1 = {
      room: room,
      team: 1,
    }
    const cb2 = {
      room: room,
      team: 2,
    }
    await axios
      .get(`${process.env.REACT_APP_API_URL}/bingo?room=${room}`)
      .then(async (res) => {
        if (res.data.length !== 0) {
          toast({
            title: 'その名前の部屋はすでに存在します！',
            status: 'error',
            isClosable: true,
            position: 'top',
          })
          flag = true
        }
      })
    if (flag) {
      flag = false
      return
    }
    await axios
      .post(`${process.env.REACT_APP_API_URL}/create`, cb1)
      .then((response) => {
        infList.push(response)
      })
    await axios
      .post(`${process.env.REACT_APP_API_URL}/create`, cb2)
      .then((response) => {
        infList.push(response)
      })

    navigate(`game?leader=1&room=${room}&team=${team}`)
  }

  const enterRoom = async () => {
    if (name == '' || room == '') {
      toast({
        title: '名前と合言葉を入力してください',
        status: 'error',
        isClosable: true,
        position: 'top',
      })
      return
    }
    await axios
      .get(`${process.env.REACT_APP_API_URL}/bingo?room=${room}`)
      .then(async (res) => {
        if (res.data.length === 0) {
          toast({
            title: '部屋が存在しません！',
            status: 'error',
            isClosable: true,
            position: 'top',
          })
          flag = true
        }
      })
    if (flag) {
      flag = false
      return
    }
    navigate(`game?leader=0&room=${room}&team=${team}`)
  }

  return (
    <Container pt={20}>
      <Card>
        <CardBody>
          <FormControl>
            <FormLabel>名前</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>合言葉</FormLabel>
            <Input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </FormControl>
          <RadioGroup marginTop={10} onChange={setTeam} value={team}>
            <Stack direction="row">
              <Radio value="1">Team1</Radio>
              <Radio value="2">Team2</Radio>
            </Stack>
          </RadioGroup>
          <Center mt={8}>
            <Button
              marginRight={70}
              colorScheme="teal"
              size="lg"
              onClick={makeRoom}
            >
              部屋を作る
            </Button>
            <Button
              marginLeft={70}
              colorScheme="teal"
              size="lg"
              onClick={enterRoom}
            >
              部屋に入る
            </Button>
          </Center>
        </CardBody>
      </Card>
    </Container>
  )
}
