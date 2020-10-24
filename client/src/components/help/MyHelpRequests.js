import React from "react";
import Loading from "../commonBits/Loading";
import {Box, ButtonDanger} from "@primer/components";

function MyHelpRequests() {
    let [data, setData] = React.useState(null);
    let [error, setError] = React.useState(null);
    fetch("/simplehelp/myHelpRequests",).then(data => {
        data.json().then(json => {
            setData(json["data"]);
        })
    }).catch(error => {
        setError(error);
    });
    return data ? <> {data.map((item, index) => {
        return <Box p={3} key={index}>
            <h1>{item.description}</h1>
            <ButtonDanger onClick={e => {
                e.preventDefault();
                fetch("/simplehelp/rescind", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body: JSON.stringify({id: item.id})
                })
            }}>Rescind request</ButtonDanger>
        </Box>
    })} </> : <Loading/>
}
