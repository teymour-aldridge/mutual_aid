import React from "react";
import {useHistory, NavLink} from "react-router-dom";
import {Flex, Button, SideNav, Box} from "@primer/components";


export default function Navbar(props) {
    let history = useHistory();
    let [x, setX] = React.useState(true);
    React.useEffect(() => {
        return history.listen(({action, location}) => {
            setX(!x);
        });
    })
    return (
        <>
            <Flex>
                <Box p={5}>
                    <SideNav>
                        {localStorage.getItem("jwt") ? <>
                            <Button onClick={e => {
                                e.preventDefault();
                                localStorage.removeItem("jwt");
                                history.push("/login")
                            }}>Log out</Button>
                            <SideNav.Link as={NavLink} to={"/requestHelp"}>
                                Ask for help
                            </SideNav.Link>
                            <SideNav.Link as={NavLink} to={"/requestComplexHelp"}>
                                Ask for (complex) help
                            </SideNav.Link>
                            <SideNav.Link as={NavLink} to={"/provideHelp"}>
                                Help someone
                            </SideNav.Link>
                            <SideNav.Link as={NavLink} to={"/provideComplexHelp"}>
                                Help someone (complex)
                            </SideNav.Link>
                            <SideNav.Link as={NavLink} to={"/currentlyFulfilling"}>
                                Current help offers
                            </SideNav.Link>
                        </> : <>
                            <SideNav.Link as={NavLink} to={"/login"}>
                                Login
                            </SideNav.Link>
                            <SideNav.Link as={NavLink} to={"/register"}>
                                Register
                            </SideNav.Link>
                        </>}
                    </SideNav>
                </Box>
                <Box p={5}>
                    {props.children}
                </Box>
            </Flex>
        </>
    )
}
