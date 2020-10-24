import React from "react";
import {BorderBox, FormGroup, TextInput, ButtonOutline} from "@primer/components";
import Error from "../error/Error";
import { useHistory } from "react-router-dom";

export default function Login(props) {
    let [username, setUsername] = React.useState("");
    let [email, setEmail] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [error, setError] = React.useState(null);
    let [passwordConfirmation, setPasswordConfirmation] = React.useState("");
    let history = useHistory();
    return (
        <>
            <BorderBox padding={3}>
                <h1>Register</h1>

                <form onSubmit={e => {
                    e.preventDefault();
                    if (password !== passwordConfirmation) {
                        setError({
                            "cause": "The inputted passwords do not match.",
                            "fix": "Check that the passwords are the same."
                        });
                        return;
                    }
                    fetch("/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({username, email, password})
                    }).then(response => {
                        response.json().then(json => {
                            localStorage.setItem("jwt", json["data"]);
                        })
                        history.push("/");
                    }).catch(error => {
                        setError(error);
                    });
                }}>
                    {error ? <Error error={error} dismiss={setError}/> : null}
                    <FormGroup>
                        <FormGroup.Label htmlFor="username">
                            Username
                        </FormGroup.Label>
                        <TextInput id="username" value={username} onInput={e => {
                            setUsername(e.target.value)
                        }}/>
                    </FormGroup>
                    <FormGroup>
                        <FormGroup.Label htmlFor="email">
                            Email
                        </FormGroup.Label>
                        <TextInput id="email" onInput={e => {
                            setEmail(e.target.value);
                        }} value={email}/>
                    </FormGroup>
                    <FormGroup>
                        <FormGroup.Label htmlFor="password">
                            Password
                        </FormGroup.Label>
                        <TextInput type="password" id="password" onInput={e => {
                            setPassword(e.target.value);
                        }} value={password}/>
                    </FormGroup>
                    <FormGroup>
                        <FormGroup.Label htmlFor="password-confirm">
                            Password confirmation
                        </FormGroup.Label>
                        <TextInput type="password" id="password-confirm" onInput={e => {
                            setPasswordConfirmation(e.target.value);
                        }} value={passwordConfirmation}/>
                    </FormGroup>
                    <ButtonOutline>Submit</ButtonOutline>
                </form>
            </BorderBox>
        </>
    )
}