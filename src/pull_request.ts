/* eslint-disable @typescript-eslint/camelcase */
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
      owner,
      repo,
      pull_number: issue_number
    })

    if (
      !listFilesResponse ||
      listFilesResponse.hasOwnProperty('data') === false
    ) {
      return false
    }

    const relevantFiles = listFilesResponse.data.filter(
      f => f.filename.includes('.swift') === true
    )
    const patches = relevantFiles.map(f => f.patch)
    const realPatches = patches.filter(x => x != null && x !== '')

    let isRelevant = false
    for (const patchString of realPatches) {
      const patchList = patchString.split('\n')
      for (const patchLine of patchList) {
        if (
          patchLine.startsWith('+') &&
          (patchLine.includes('public') || patchLine.includes('open'))
        ) {
          // relevant: add
          isRelevant = true
        }
        if (
          patchLine.startsWith('-') &&
          (patchLine.includes('public') || patchLine.includes('open'))
        ) {
          // relevant: remove
          isRelevant = true
        }
      }
    }
    return isRelevant
  }
}
