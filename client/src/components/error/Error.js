import React from "react";
import {Box, StyledOcticon, Button} from "@primer/components";
import {XIcon} from "@primer/octicons-react";

export default function Error(props) {
    return (
        <>
            <Box p={3}>
                <Button onClick={e => {
                    props.dismiss(null);
                }}>
                    Dismiss
                    <StyledOcticon icon={XIcon} size={32} color="red.5"/>
                </Button>
                <p>
                    {props.error.cause}
                </p>
                <p>
                    Suggestion: {props.error.fix}
                </p>
            </Box>
        </>
    )
}
