import dotenv from "dotenv";
import { Octokit } from "octokit";
import path from "node:path";
import fse from "fs-extra";
import chalk from "chalk";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.TOKEN 
});

const dbPath = path.join(process.cwd(), "DB.json");

export async function fetchLatestEvents(username) {
  try {
    const result = await octokit.request("GET /users/{username}/events", {
      username: username,
      per_page: arguments[arguments.length - 1] || 30, // Default per_page value
    });

    const formattedEvents = result.data.map(event => {
      switch (event.type) {
        case "PushEvent":
          return chalk.green(`- Pushed ${event.payload.commits.length} commits to ${event.repo.name} at ${event.created_at}`);
        case "IssuesEvent":
          return chalk.blue(`- Opened a new issue in ${event.repo.name}`);
        case "WatchEvent":
          return chalk.yellow(`- Starred ${event.repo.name}`);
        case "PublicEvent":
          return chalk.magenta(`- Repository ${event.repo.name} made public at ${event.created_at}`);
        case "RepositoryEvent":
          return chalk.cyan(`- Repository ${event.repo.name} ${event.payload.action} at ${event.created_at}`);
        default:
          return chalk.gray(event.type);
      }
    }).filter(Boolean);

    formattedEvents.forEach(element => {
      console.log(element);
    });
  } catch (err) {
    console.error(chalk.red("Error fetching events:", err.message));
  }
}

export async function writeUsername(username) {
  try {
    await fse.writeJSON(dbPath, { username }, { spaces: 2 });
    console.log(chalk.green.bold("Username written to DB.json successfully!"));
  } catch (err) {
    console.error(chalk.red("Error writing username to file:", err.message));
  }
}

export async function readUsername() {
  try {
    const result = await fse.readJSON(dbPath);
    return result.username;
  } catch (err) {
    console.error(chalk.red("Error reading username from file:", err.message));
  }
}

export async function createIssue(owner, repo, issue) {
  try {
    const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      assignees: issue.assignees
    });

    console.log(chalk.green.bold('Issue created successfully!'), response.data);
    return response.data;
  } catch (error) {
    console.error(chalk.red('Error creating issue:', error.message));
    throw error;
  }
}

export async function createRepo(name, description, accesstype) {
  try {
    const result = await octokit.request("POST /user/repos", {
      name: name,
      description: description,
      private: accesstype === "private",
    });
    console.log(chalk.green.bold("Repository created successfully!"));
    return result;
  } catch (error) {
    console.error(chalk.red("Error creating repository:", error.message));
    throw error;
  }
}

export async function deleteRepo(owner, repo) {
  try {
    const result = await octokit.request("DELETE /repos/{owner}/{repo}", {
      owner,
      repo,
    });
    console.log(chalk.green.bold("Repository deleted successfully!"));
    return result;
  } catch (error) {
    console.error(chalk.red("Error deleting repository:", error.message));
    throw error;
  }
}

export async function getRepos(username) {
  try {
    const response = await octokit.request("GET /users/{username}/repos", {
      username: username,
      per_page: arguments[arguments.length - 1] || 30, // Default per_page value
    });
    console.log(chalk.green.bold("Repositories retrieved successfully!"));
    console.log(response);
  } catch (error) {
    console.error(chalk.red("Error fetching repositories:", error.message));
  }
}

export async function getdetails(requirement, username) {
  try {
    switch (requirement) {
      case "commits": {
        const response = await octokit.request("GET /users/{username}/events", {
          username: username,
          per_page: arguments[arguments.length - 1] || 30,
        });

        response.data.forEach((event) => {
          if (event.type === 'PushEvent') {
            event.payload.commits.forEach((commit) => {
              console.log(chalk.green.bold(`Commit SHA: ${commit.sha}`));
              console.log(chalk.yellow(`Author: ${commit.author.name}`));
              console.log(chalk.blue(`Message: ${commit.message}`));
              console.log(chalk.gray('---\n'));
            });
          }
        });
        break;
      }
      case "repositories": {
        const response = await octokit.request("GET /users/{username}/repos", {
          username: username,
          per_page: arguments[arguments.length - 1] || 30,
        });

        response.data.forEach((repo) => {
          console.log(chalk.green(`Repository name: ${repo.name}`));
          console.log(chalk.yellow(`Status: ${repo.private ? 'private' : 'public'}`));
          console.log(chalk.blue(`Created at: ${repo.created_at}`));
          console.log(chalk.cyan(`Updated at: ${repo.updated_at}`));
          console.log(chalk.gray('---'));
        });
        break;
      }
      case "lastproject": {
        const response = await octokit.request("GET /users/{username}/repos", {
          username: username,
        });
        console.log(chalk.green.bold("Last project details:"), response.data[0]);
        break;
      }
      default:
        console.log(chalk.red("Invalid requirement specified!"));
    }
  } catch (error) {
    console.error(chalk.red("Error fetching details:", error.message));
  }
}
