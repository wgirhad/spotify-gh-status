require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.SERVER_PORT || 3000;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = `http://localhost:${port}/callback`;

app.get('/login', function(req, res) {
  const scope = 'user-read-currently-playing user-read-playback-state';

  res.redirect('https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      //state: state
    }).toString()
  );
});

app.get('/callback', async function(req, res) {
  const code = req.query.code;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    }),
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  });

  const res_body = await response.json();

  res.send(res_body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
