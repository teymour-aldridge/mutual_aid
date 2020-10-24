import React from "react";

import Loading from "../commonBits/Loading";
import Error from "../error/Error";
import {Button} from "@primer/components";

function Confirmation(props) {
    return <>
        <h1>Thanks for agreeing to fulfil this help request.</h1>
        <Button onClick={() => {
            props.setConfirmation(false);
            props.setLocationRequested(false);
        }}/>
    </>
}

export default function ProvideHelp() {
    let [data, setData] = React.useState(null);
    let [error, setError] = React.useState(null);
    let [locationRequested, setLocationRequested] = React.useState(null);
    let [confirmation, setConfirmation] = React.useState(false);
    if (!locationRequested) {
        navigator.geolocation.getCurrentPosition((success) => {
            fetch("/simplehelp/list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    latitude: success.coords.latitude,
                    longitude: success.coords.longitude
                })
            }).then(data => {
                data.json().then(
                    json => {
                        setLocationRequested(true);
                        setData(json["data"]);
                    }
                )
            }).catch(error => {
                setError(error);
            });
        });
    }
    if (confirmation) {
        return <Confirmation setConfirmation={setConfirmation} setLocationRequested={setLocationRequested}/>
    }
    return (
        <>
            {error ? <Error error={error} dismiss={setError}/> : null}
            {data ? <>
                {data.length > 0 ? data.map((item, index) => {
                    return <div key={index}>
                        <p>{item.description}</p>
                        <Button onClick={e => {
                            fetch(`/simplehelp/provide/${item.id}`, {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                                }
                            }).then(() => {
                                setConfirmation(true);
                            }).catch(error => {
                                setError(error);
                            })
                        }}>Help this person</Button>
                    </div>
                }) : <h1>Nobody has asked for help!</h1>}
            </> : <Loading/>}
        </>
    )
}
