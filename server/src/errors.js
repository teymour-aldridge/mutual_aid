export function notAllParametersSupplied(res) {
    res.status(400).json({
        "cause": "Not all the necessary parameters were supplied.",
        "fix": "This is a programming error, and will need to be fixed at the application level."
    });
}

export function databaseError(error, res) {
    res.status(500).json({
        "cause": "There was an error retrieving data from the database.",
        "fix": "This is a programming error, and will need to be fixed at the application level."
    });
}

export function authenticationError(res) {
    res.status(403).json({
        "cause": "You are not currently signed in.",
        "fix": "Please sign in and then repeat this action."
    });

}
