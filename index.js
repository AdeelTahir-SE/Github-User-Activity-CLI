import dotenv from "dotenv";
dotenv.config();
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.TOKEN 
});

const username = "AdeelTahir-SE";

export async function fetchLatestEvents() {
  try {
    const result = await octokit.request("GET /users/{username}/events", {
      username: username,
    });

    const formattedEvents = result.data.map(event => {
      switch (event.type) {
        case "PushEvent":
          return `- Pushed ${event.payload.commits.length} commits to ${event.repo.name} at ${event.created_at}`;
        case "IssuesEvent":
          return `- Opened a new issue in ${event.repo.name}`;
        case "WatchEvent":
          return `- Starred ${event.repo.name}`;
        case "PublicEvent":
          return `- repository ${event.repo.name} is made public at ${event.created_at}`;
        case "RepositoryEvent":
          return `- Repository ${event.repo.name} is ${event.payload.action} at ${event.created_at}`;
        default:
          return event.type;
      }
    }).filter(Boolean); // Remove any null or undefined values

    for (const element of formattedEvents) {
      console.log(element);
    }
  } catch (err) {
    console.error("Error fetching events:", err);
  }
}

