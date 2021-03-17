const fetch = require('node-fetch');

const developerApiKey = process.env.API_KEY || "xK38CsC45SejE9IgtP1W2bhSWAcliCh7AHjP7QXc"
const developerEmailAddress = process.env.EMAIL || "Your_developer_email@"

const switchApiKeyCall = function (apikey, path, body, method) {
    const headerParams = {
        'Content-Type': 'application/json',
        'x-api-key': `${apikey}`
    }
    return fetch('https://atbqgbgotb.execute-api.us-east-1.amazonaws.com/demo' + path, {
        headers: headerParams,
        method: method || "GET",
        body: method == "GET" ? null : JSON.stringify(body)
    }).then(response => response.json())
}

const switchAuthorizationCall = function (token, path, body, method) {
    const headerParams = {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
    }
    return fetch('https://atbqgbgotb.execute-api.us-east-1.amazonaws.com/demo' + path, {
        headers: headerParams,
        method: method || "GET",
        body: method == "GET" ? null : JSON.stringify(body)
    }).then(response => response.json())
}

let accessToken = null

if (!accessToken) {
    switchApiKeyCall(developerApiKey, "/auth/token", {
        email: developerEmailAddress
    }, "POST").then(result => {
        accessToken = result.authorization
        console.log("AUTHORIZATION:", accessToken ? "OK (You can reuse the accessToken for the next calls)" : result)
        if (accessToken) {
            switchAuthorizationCall(accessToken, "/letters", {
                url: "http://www.africau.edu/images/default/sample.pdf",
                email: "john.doe@email.com",
                sender: {
                    "firstName": "John",
                    "lastName": "DC",
                    "address1": "RM-2244",
                    "address2": "1st Floor",
                    "state": "TX",
                    "city": "West Lake Hills",
                    "postcode": "78746"
                },
                receiver: [
                    {
                        "firstName": "John",
                        "lastName": "DC",
                        "zipCode": "08865",
                        "postcode": "08865",
                        "state": "NJ",
                        "city": "Phillipsburg",
                        "address1": "RT-122",
                        "address2": "2nd Floor"
                    }
                ],
            }, "POST").then(letter => {
                const requestId = letter.id
                console.log("LETTER:", letter.id)
                switchAuthorizationCall(accessToken, `/letters/${requestId}/confirm`, {
                    trackingId: letter.trackingId,
                    transaction: letter.transaction
                }, "POST").then(result => {
                    console.log("RESULT:", result)
                    switchAuthorizationCall(accessToken, `/trackings/${letter.trackingId}`, {}, "GET").then(result => {
                        console.log("TRACKING:", result)
                    })
                })
            }).catch(err => console.log(err))
        }
    }).catch(err => console.log(err))
}
