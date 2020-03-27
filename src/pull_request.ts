import * as github from '@actions/github'
import * as core from '@actions/core'
import {Context} from '@actions/github/lib/context'

export class PullRequest {
  private client: github.GitHub
  private context: Context

  constructor(client: github.GitHub, context: Context) {
    this.client = client
    this.context = context
  }

  async addReviewers(reviewers: string[]): Promise<void> {
    const {owner, repo, number: pull_number} = this.context.issue
    const result = await this.client.pulls.createReviewRequest({
      owner,
      repo,
      pull_number,
      reviewers
    })
    core.debug(JSON.stringify(result))
  }

  async addAssignees(assignees: string[]): Promise<void> {
    const {owner, repo, number: issue_number} = this.context.issue
    const result = await this.client.issues.addAssignees({
      owner,
      repo,
      issue_number,
      assignees
    })
    core.debug(JSON.stringify(result))
  }

  hasAnyLabel(labels: string[]): boolean {
    if (!this.context.payload.pull_request) {
      return false
    }
    const {labels: pullRequestLabels = []} = this.context.payload.pull_request
    return pullRequestLabels.some(label => labels.includes(label.name))
  }

  async isMatchingWith(): Promise<boolean> {
    const {owner, repo, number: issue_number} = this.context.issue
    const listFilesResponse = await this.client.pulls.listFiles({
      owner: owner,
      repo: repo,
      pull_number: issue_number
    })

    if (
      listFilesResponse
    ) {
		console.log('ok ??')
		if ( listFilesResponse.hasOwnProperty('data') === true ) {
			console.log('has')
		} else {
			console.log('has not')
			return true
		}
	}

	console.log(listFilesResponse)

    const changedFiles = listFilesResponse.data.map(f => f.filename)
    const patches = listFilesResponse.data.map(f => f.patch)

    console.log('found changed files:')
    for (const file of changedFiles) {
		console.log('  ' + file)
	}

	console.log('found changed files:')
    for (const patch of patches) {
		if (patch.startsWith('+') && patch.includes('public')) {
			console.log('relevant: add')
			return true
		}
		if (patch.startsWith('-') && patch.includes('public')) {
			console.log('relevant: remove')
			return true
		}
    }

    return true
  }
}
