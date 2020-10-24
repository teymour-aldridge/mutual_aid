import React from "react";
import {BorderBox, FormGroup, TextInput, ButtonOutline} from "@primer/components";
import Error from "../error/Error";
import {useHistory} from "react-router-dom";

export default function Login(props) {
    let [identifier, setIdentifier] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [error, setError] = React.useState(null);
    let history = useHistory();
    return (
        <>
            <BorderBox padding={3}>
                <h1>Login</h1>
                {error ? <Error error={error} dismiss={setError}/> : null}
                <form onSubmit={e => {
                    e.preventDefault();
                    fetch("/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({identifier, password})
                    }).then(response => {
                        response.json().then(data => {
                            if (!response.ok) {
                                setError(data);
                                return;
                            }
                            localStorage.setItem("jwt", data["data"]);
                            history.push("/");
                        });
                    }).catch(error => {
                        setError(error);
                    });
                }}>
                    <FormGroup>
                        <FormGroup.Label htmlFor="email">
                            Email or username
                        </FormGroup.Label>
                        <TextInput id="email" onChange={e => {
                            setIdentifier(e.target.value);
                        }} value={identifier}/>
                    </FormGroup>
                    <FormGroup>
                        <FormGroup.Label htmlFor="password">
                            Password
                        </FormGroup.Label>
                        <TextInput type="password" id="password" onChange={e => {
                            setPassword(e.target.value);
                        }} value={password}/>
                    </FormGroup>
                    <ButtonOutline>Submit</ButtonOutline>
                </form>
            </BorderBox>
        </>
    )
}