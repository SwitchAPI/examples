# examples
This repository contains the examples for using Switch APIs

1. Goto https://developer-demo.switchmail.com/usage/dashboard

 - Get your API_KEY to use when calling Switch APIs

 ```javascript

const fetch = require('node-fetch');

const developerApiKey = process.env.API_KEY || "Your_api_key_here"

const switchApiKeyCall = function (apikey, path, body, method) {
    const headerParams = {
        'Content-Type': 'application/json',
        'x-api-key': `${apikey}`
    }
    return fetch('https://atbqgbgotb.execute-api.us-east-1.amazonaws.com/demo' + path, {
        headers: headerParams,
        method: method || "POST",
        body: method == "GET" ? null : JSON.stringify(body)
    }).then(response => response.json())
}

switchApiKeyCall("Your_api_key_here", "/auth/token", { email: "your_email@gmail.com" }, "POST").then(result => {
    console.log(result)
})
```