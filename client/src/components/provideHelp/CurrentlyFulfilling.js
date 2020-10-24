import React from "react";
import Loading from "../commonBits/Loading";
import {Button} from "@primer/components";

function Confirmation(props) {
    return <>
        <h1>Your offer of help has been rescinded</h1>
        <Button onClick={e => {
            e.preventDefault();
            props.setData(false);
            props.setConfirmation(false);
        }}>Go back</Button>
    </>
}

export default function CurrentlyFulfilling() {
    let [data, setData] = React.useState(null);
    let [error, setError] = React.useState(null);
    let [confirmation, setConfirmation] = React.useState(false);
    if (!data) {
        fetch("/simplehelp/currentlyFulfilling", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(response => {
                response.json().then(json => {
                    if (!response.ok) {
                        setError(json);
                        return;
                    }
                    setData(response["data"])
                })
            }
        ).catch(problem => setError(problem));
    }
    if (confirmation) {
        return <Confirmation setData={setData} setConfirmation={setConfirmation}/>
    }
    return (
        <>
            {data ? <>
                <h1>Help requests I'm fulfilling</h1>
                {data.map((item, index) => {
                    return <div key={index}>
                        <h3>Thing {index}</h3>
                        <p>{item.description}</p>
                        <Button onClick={e => {
                            e.preventDefault();
                            fetch(`/simplehelp/rescind/${item.id}`).then(() => {
                                setConfirmation(true);
                            }).catch(error => {
                                setError(error);
                            });
                        }}>Cancel help</Button>
                    </div>
                })}

            </> : <Loading/>}
        </>
    )
}
