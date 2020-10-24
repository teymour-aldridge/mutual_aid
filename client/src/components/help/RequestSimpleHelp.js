import React from "react";
import {BorderBox, ButtonOutline, FormGroup, TextInput} from "@primer/components";
import Error from "../error/Error";


function Request(props) {
    let [description, setDescription] = React.useState("");
    let [location, setLocation] = React.useState(null);
    let [error, setError] = React.useState(null);
    return (
        <>
            <BorderBox padding={3} onSubmit={e => {
                e.preventDefault();
                fetch("/simplehelp/create", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    },
                    method: "POST",
                    body: JSON.stringify({description, latitude: location[0], longitude: location[1]})
                }).then(response => {
                    props.setConfirm(true);
                }).catch(error => {
                    setError(error);
                });
            }}>
                <form>
                    <h1>Request help</h1>
                    {error ? <Error error={error} dismiss={setError}/> : null}
                    <FormGroup>
                        <FormGroup.Label htmlFor="description">
                            Description
                        </FormGroup.Label>
                        <TextInput type="textarea" id="description" onInput={e => {
                            e.preventDefault();
                            setDescription(e.target.value);
                        }}/>
                    </FormGroup>
                    <FormGroup>
                        <FormGroup.Label htmlFor="select-location">
                            Select location
                        </FormGroup.Label>
                        {location ? <p>You have successfully chosen your location.</p> :
                            <p>Please choose your location</p>}
                        <ButtonOutline onClick={e => {
                            e.preventDefault();
                            navigator.geolocation.getCurrentPosition((result) => {
                                setLocation([result.coords.latitude, result.coords.longitude]);
                            })
                        }}>Use my current location</ButtonOutline>
                    </FormGroup>
                    <ButtonOutline>Submit</ButtonOutline>
                </form>
            </BorderBox>
        </>
    );
}

function Confirmation(props) {
    return <>
        <h1>Your request has been confirmed.</h1>
        <ButtonOutline onClick={e => {
            e.preventDefault();
            props.setConfirm(false);
        }}>Ask again.</ButtonOutline>
    </>
}

export default function RequestSimpleHelp() {
    let [confirm, setConfirm] = React.useState(false);
    return (
        <>
            {confirm ? <Confirmation setConfirm={setConfirm}/> : <Request setConfirm={setConfirm}/>}
        </>
    );
}
