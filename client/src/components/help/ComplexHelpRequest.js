import React from "react";
import {FormGroup, TextInput, CircleOcticon, Button, Box} from "@primer/components";
import {ChevronUpIcon, ChevronDownIcon} from "@primer/octicons-react";
import {useHistory} from "react-router-dom";
import Error from "../error/Error";
import "leaflet-geosearch/dist/geosearch.css";

import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";
import {TileLayer, Map, useLeaflet, Marker, Popup} from "react-leaflet";

// make new leaflet element
const Search = (props) => {
    const {map} = useLeaflet();
    const {provider} = props

    React.useEffect(() => {
        const searchControl = new GeoSearchControl({
            provider,
            showMarker: true,
            showPopup: true,
            style: "bar",
            searchLabel: "search for location",
            keepResult: true
        })
        map.addControl(searchControl);
        map.on("geosearch/showlocation", (event) => {
            let latitude = event.location.y;
            let longitude = event.location.x;
            props.setLocation([latitude, longitude]);
        });
        return () => map.removeControl(searchControl)
    }, [props])

    return null // don't want anything to show up from this comp
}

function RenderMap(props) {
    return <Map style={{width: "100%", height: 300}} center={props.location} zoom={20}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Search provider={new OpenStreetMapProvider()} setLocation={props.setLocation}/>
    </Map>
}

function Confirmation(props) {
    let history = useHistory();
    return <>
        <h1>Your help request is confirmed.</h1>
        <Button onClick={props.setConfirmation(false)}>Submit another</Button>
        <Button onClick={e => {
            history.push("/")
        }}>Return home</Button>
    </>
}

export default function ComplexHelpRequest() {
    let [location, setLocation] = React.useState(null);
    let [steps, editSteps] = React.useState([]);
    let [confirmation, setConfirmation] = React.useState(false);
    let [error, setError] = React.useState(null);
    let [description, setDescription] = React.useState("");
    let [step, editStep] = React.useState({
        description: "",
        latitude: 0,
        longitude: 0
    });
    if (!location) {
        navigator.geolocation.getCurrentPosition(success => {
            let newLocation = [success.coords.latitude, success.coords.longitude];
            setLocation(newLocation);
        });
    }
    return <> {
        confirmation ?
            <Confirmation setConfirmation={setConfirmation}/> : <>
                <h1>Complex help request</h1>
                {error ? <Error error={error}/> : null}
                <form onSubmit={e => {
                    e.preventDefault();
                    fetch("/complexhelp/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                        },
                        body: JSON.stringify({
                            description,
                            steps: steps.map((item, index) => {
                                return {
                                    step: index,
                                    ...item
                                }
                            })
                        })
                    }).then(() => {
                        setConfirmation(true);
                    }).catch(
                        error => {
                            setError(error);
                        }
                    )
                }}>
                    <FormGroup>
                        <FormGroup.Label>
                            Description of help request
                        </FormGroup.Label>
                        <TextInput onInput={e => {
                            setDescription(e.target.value);
                        }} value={description}/>
                    </FormGroup>
                    {steps.map((item, index) => {
                        return <div key={index}>
                            <FormGroup>
                                {index > 0 ?
                                    <CircleOcticon icon={ChevronUpIcon} onClick={e => {
                                        e.preventDefault();
                                        editSteps(prevState => {
                                            let newState = Array.from(prevState);
                                            let tmp = newState[index];
                                            newState[index] = newState[index - 1];
                                            newState[index - 1] = tmp;
                                            return newState;
                                        });
                                    }}/> : null}
                                {(index + 1) !== steps.length ? <CircleOcticon icon={ChevronDownIcon} onClick={e => {
                                    e.preventDefault();
                                    editSteps(prevState => {
                                        let newState = Array.from(prevState);
                                        let tmp = newState[index];
                                        newState[index] = newState[index + 1];
                                        newState[index + 1] = tmp;
                                        return newState;
                                    });
                                }}/> : null}
                                <FormGroup.Label htmlFor={`item-${index + 1}`}>
                                    {`Step ${index + 1}`}
                                </FormGroup.Label>
                                <TextInput id={`item-${index + 1}`} onInput={e => {
                                    editSteps(prevState => {
                                        prevState[index].description = e.target.value;
                                        return Array.from(prevState);
                                    })
                                }} value={steps[index].description}/>
                                <br/>
                                <RenderMap location={location} setLocation={([latitude, longitude]) => {
                                    editStep(prevState => {
                                        let newState = Array.from(prevState);
                                        newState[index] = {...newState[index], latitude, longitude};
                                        return newState;
                                    })
                                }}/>
                                <p><b>Selected location:</b> <i>Latitude</i> {steps[index].latitude},
                                    Longitude: {steps[index].longitude}</p>
                            </FormGroup>
                            <hr/>
                        </div>
                    })}
                    <FormGroup>
                        <FormGroup.Label htmlFor={`new-item`}>
                            {`Add a new step`}
                        </FormGroup.Label>
                        <TextInput onInput={e => {
                            editStep(prevState => {
                                    return {
                                        ...prevState,
                                        description: e.target.value
                                    }
                                }
                            );
                        }} value={step.description}/>
                        <RenderMap location={location} setLocation={([latitude, longitude]) => {
                            editStep(prevState => {
                                return {
                                    ...prevState,
                                    latitude,
                                    longitude
                                }
                            })
                        }}/>
                        <br/>
                        <br/>
                        <Button onClick={e => {
                            e.preventDefault();
                            console.log(step);
                            editSteps(prevState => {
                                return [...prevState, {
                                    description: step.description,
                                    latitude: step.latitude,
                                    longitude: step.longitude
                                }]
                            });
                            editStep({
                                description: "",
                                latitude: 0,
                                longitude: 0
                            });
                        }}>Add step</Button>
                        <hr/>
                    </FormGroup>
                    <Button>Submit help request</Button>
                </form>
            </>
    }
    </>
}
