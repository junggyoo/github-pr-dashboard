import { Octokit } from "@octokit/rest";

export class GitHubClient {
	private client: Octokit;
	private username: string | null = null;

	constructor(token: string) {
		this.client = new Octokit({ auth: token });
	}

	async initialize() {
		const { data: user } = await this.client.rest.users.getAuthenticated();
		this.username = user.login;
		return this;
	}

	getClient() {
		return this.client;
	}

	getUsername() {
		if (!this.username) {
			throw new Error("GitHub client not initialized");
		}
		return this.username;
	}
}

export function createGitHubClient(token: string) {
	return new GitHubClient(token);
}
