# GitHub User Activity CLI

A command-line interface (CLI) tool for interacting with GitHub user activities, such as creating and deleting repositories, managing issues, and retrieving user details.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)


## Features

- Create, delete, and manage GitHub repositories.
- Retrieve and display user details.
- Manage issues in repositories.
- Simple and intuitive CLI interface using yargs and chalk.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AdeelTahir-SE/Github-User-Activity-CLI.git
Navigate to the project directory:
cd Github-User-Activity-CLI

Install the dependencies:
npm install
Usage
Before using the CLI, ensure you have a GitHub account and a personal access token with appropriate permissions.

To set up your GitHub token:

export GITHUB_TOKEN=your_github_token_here
Run the CLI:

node index.js

## Commands
Here are the main commands available in the CLI:

Create a Repository:
node index.js create-repo --name <repository_name>

Delete a Repository:
node index.js delete-repo --name <repository_name>

Create an Issue:
node index.js create-issue --repo <repository_name> --title <issue_title> --body <issue_body>

List User Repositories:
node index.js list-repos --username <github_username>

Retrieve User Details:
node index.js user-details --username <github_username>

For a full list of commands and options, run:

node index.js --help
