import { Box, Button, Center, Container, Flex, HStack, IconButton, Img, Spacer, VStack, Wrap, useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Info, ResponseBingo } from "../types";
import { useMedia } from "use-media";
import { BingoTable } from "./Bingo";
import { SmallBingoTable } from "./SmallBingoTable";


export default function Game(){
    console.log("rendered")
    const [ bingos, setBingos] = useState<ResponseBingo[]>([]);
    useEffect(()=>{
        axios.get<ResponseBingo[]>(`${process.env.REACT_APP_API_URL}/bingo?room=${room}`).then((res)=>{
            setBingos(res.data)
        })
    }, [])

    const isWide = useMedia({minWidth: "1000px"})
    const [searchParams] = useSearchParams();
    const leader = searchParams.get("leader");
    const room = searchParams.get("room");
    const myTeam = searchParams.get("team");


    const navigate = useNavigate();

    if (!room || !leader) {
        navigate("/");
        return null;
    }

    const changeStatusTeam1 = (locate: number) => {
        if(window.confirm("状態を更新しますか？")){
            var tempBingos = bingos.concat();
            var changedStatusNumber = tempBingos[locate].status ^ 1;
            tempBingos[locate].status = changedStatusNumber;
            var updateElement ={
                status: changedStatusNumber,
            };
            axios.put(`${process.env.REACT_APP_API_URL}/update?room=${room}&team=1&locate=${locate}`, updateElement)
            console.log(tempBingos)
            setBingos(tempBingos)
        }
    }

    const changeStatusTeam2 = (locate: number) => {
        if(window.confirm("状態を更新しますか？")){
            var tempBingos = bingos.concat();
            var changedStatusNumber = tempBingos[locate+25].status ^ 1;
            tempBingos[locate+25].status = changedStatusNumber;
            var updateElement ={
                status: changedStatusNumber,
            };
            axios.put(`${process.env.REACT_APP_API_URL}/update?room=${room}&team=2&locate=${locate}`, updateElement)
            console.log(tempBingos)
            setBingos(tempBingos)
        }
    }

    const deleteGame = async() => {
        if(window.confirm("部屋を解散しますか？")){
            await axios.get(`${process.env.REACT_APP_API_URL}/bingo?room=${room}`).then(async(res)=>{
                if(res.data.length !== 0){
                    await axios.delete(`${process.env.REACT_APP_API_URL}/${room}`)
                }
                navigate("/")
            })
            
        }
    }

    const exitGame = async() => {
        if(window.confirm("部屋は残したまま退出しますか？")){
            navigate("/")            
        }
    }

    return (
        <div>
            <>
            {isWide ? (
                <Flex flexWrap="wrap" flexDirection="row" marginTop={30}>
                <Flex flexWrap="wrap" w="500px" flexDirection="row" marginLeft={30}>
                {bingos.map((bingo) => (
                    <div>
                        {bingo.team === 1 ? (
                        <>
                        {bingo.status === 0 ? (
                            <BingoTable 
                            bingo = {bingo}
                            changeStatus={changeStatusTeam1}
                            />
                        ) : (
                            <BingoTable 
                            bingo = {bingo}
                            changeStatus={changeStatusTeam1}
                            />
                        )}
                        </>) : (
                            //Team2の要素は表示しない
                            <></>
                        )}
                    </div>
                ))}
                </Flex>
                <Spacer />
                    <Button onClick={deleteGame}>終了</Button>
                    <Button onClick={exitGame}>退出</Button>
                <Spacer />
                <Flex flexWrap="wrap" w="500px" flexDirection="row" marginRight={30}>
                {bingos?.map((bingo) => (
                    <div>
                        {bingo.team === 2 ? (
                        <>
                        {bingo.status === 0 ? (
                            <BingoTable 
                            bingo = {bingo}
                            changeStatus={changeStatusTeam2}
                            />
                        ) : (
                            <BingoTable 
                            bingo = {bingo}
                            changeStatus={changeStatusTeam2}
                            />
                        )}
                        </>) : (
                            // Team1の要素は表示しない
                            <></>
                        )}
                    </div>
                ))}
                </Flex>
                </Flex>
            ) : (
            <SmallBingoTable
            bingos = {bingos}
            leader={leader}
            changeStatusTeam1={changeStatusTeam1}
            changeStatusTeam2={changeStatusTeam2}
            deleteGame={deleteGame}
            exitGame={exitGame} />
            )}
            </>
        </div>
    )
}