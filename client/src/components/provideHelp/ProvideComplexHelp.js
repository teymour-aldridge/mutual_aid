import React from "react";
import Loading from "../commonBits/Loading";
import {TileLayer, Map, Marker} from "react-leaflet";
import {Button} from "@primer/components";

function Confirmation(props) {
    return <>
        <h1>Thanks for agreeing to provide help for this person.</h1>
        <Button onClick={(e) => {
            e.preventDefault();
            props.setConfirmation(false);
            props.setLocationRequested(false);
        }}>Provide more help</Button>
    </>
}

export default function ProvideComplexHelp() {
    let [data, setData] = React.useState(null);
    let [locationRequested, setLocationRequested] = React.useState(false);
    let [error, setError] = React.useState(null);
    let [confirmation, setConfirmation] = React.useState(false);
    if (!locationRequested) {
        navigator.geolocation.getCurrentPosition(location => {
            fetch("/complexhelp/list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
                body: JSON.stringify({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                })
            }).then(response => {
                response.json().then(json => {
                    setLocationRequested(true);
                    setData(json["data"]);
                })
            }).catch(error => {
                    setError(error);
                }
            )
        });
    }
    if (confirmation)
        return <Confirmation setConfirmation={setConfirmation} setLocationRequested={setLocationRequested}/>
    return <>
        {data ? <> <h1>Provide complex help</h1>
                {data.length > 0 ? <>{data.map((item, index) => {
                        return <div key={index}>
                            <hr/>
                            <h2>Steps</h2>
                            <p>{item.description}</p>
                            <Map style={{height: 200, width: "100%"}} center={[item.latitude, item.longitude]} zoom={13}>
                                <TileLayer
                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[item.latitude, item.longitude]}/>
                            </Map>
                            <Button onClick={e => {
                                e.preventDefault();
                                fetch(`/complexhelp/provide/${item.id}`, {
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
                    })}</>
                    : <>
                        <h2>No-one has asked for help yet.</h2>
                    </>}

            </>
            : <Loading/>}
    </>
}
