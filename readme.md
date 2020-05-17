# Lmatics exercise

The frontend is available at http://lmatics-server.s3-website.eu-west-1.amazonaws.com/

Please don't refresh continually or otherwise spam the backend server. In this short
exercise I wan't able to implement full rate limiting and NCBI don't like being
spammed :)

The server is very slow to retrieve data, so please be patient. This is because
it needs to make an API call per year requested (due to limitations in eSearch
that I could not find a way around).

## Run code and test locally

To install locally, clone the repo and in both 'client' and 'server' folders,
run `yarn` to install packages with yarn. The server tests can be run with `yarn test` from the main server directory; there are not yet tests for the frontend.

Both server and client are started with `yarn start`.