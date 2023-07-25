import { GitHubProfileStatus } from 'github-profile-status';
import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

async function main() {
  const profileStatus = new GitHubProfileStatus({
    token: process.env.GITHUB_ACCESS_TOKEN,
  });

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

  const auth = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(auth.body['access_token']);

  const result = await spotifyApi.getMyCurrentPlaybackState();

  if (!result.body?.is_playing) {
    await profileStatus.clear();
    return;
  }

  const song = result.body.item.name;
  const artist = result.body.item.artists[0].name;

  const wut = await profileStatus.set({
    emoji: ':headphones:',
    message: `${song} - ${artist}`,
    limitedAvailability: false,
  });
}

await main();
