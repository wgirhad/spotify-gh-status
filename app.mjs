import { GitHubProfileStatus } from 'github-profile-status';
import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

async function main() {
  const profileStatus = new GitHubProfileStatus({
    token: process.env.GITHUB_ACCESS_TOKEN,
  });

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
  const result = await spotifyApi.getMyCurrentPlaybackState();

  const song = result.body.item.name;
  const artist = result.body.item.artists[0].name;

  const wut = await profileStatus.set({
    emoji: ':headphones:',
    message: `${song} - ${artist}`,
    limitedAvailability: false,
  });
}

await main();
