import {useEffect, useState} from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import axios from 'axios';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {string} from "prop-types";

enum websocketEnum {
    INITIALIZE = "initialize",
    UPDATE = "update"
}

interface intradayData{
    time: String
    price: Number
}

const Graph = (props: any) => {
    const [websocketInstance, setWebsocketInstance] = useState<WebSocket | null>(null);
    const [intradayData, setIntraDayData] = useState<intradayData[] | []>([]);

    const reduxTimeScale: string = useSelector((state : RootState) => state.timeScale)
    const reduxSelectedEquity: string = useSelector((state : RootState) => state.selectedEquity)
    const reduxTechnicalIndicator: string = useSelector((state : RootState) => state.technicalIndicator)

    useEffect(() => {
        // if timeScale is 1D, minute-updated intraday data is shown.
        if (reduxTimeScale === "1D"){
            const ws: WebSocket = new WebSocket("ws://127.0.0.1:8000/realtime-data/")

            ws.onopen = function(){
                setWebsocketInstance(ws)

                ws.send(
                    JSON.stringify({
                        selectedEquity: reduxSelectedEquity,
                        technicalIndicator: reduxTechnicalIndicator
                    })
                )
            }

            ws.onmessage = function(data){
            }
        }
        console.log("remounted")
    }, [])

    return(
        "Graph goes here"
    )
}

export default Graph