import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

import {websocketEnum, intradayData} from "../../ts/types";


const Graph = (props: any) => {
    const [websocketInstance, setWebsocketInstance] = useState<WebSocket | null>(null);
    const [intradayData, setIntraDayData] = useState<intradayData[] | []>([]);

    const reduxTimeScale: string = useSelector((state : RootState) => state.timeScale)
    const reduxSelectedEquity: string = useSelector((state : RootState) => state.selectedEquity)

    useEffect(() => {
        // if timeScale is 1D, minute-updated intraday data is shown.
        if (reduxTimeScale === "1D"){
            const ws: WebSocket = new WebSocket("ws://127.0.0.1:8000/realtime-data/")

            ws.onopen = function(){
                setWebsocketInstance(ws)

                ws.send(
                    JSON.stringify({
                        type: websocketEnum.GROUP,
                        selectedEquity: reduxSelectedEquity
                    })
                )
            }

            ws.onmessage = function(data){
            }
        }
        console.log("remounted")
    }, [])

    return(
        <div>
            "Graph goes here"
        </div>
    )
}

export default Graph