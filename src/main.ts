import * as core from '@actions/core'
import * as github from '@actions/github'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', {required: true})
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

	const prNumber = getPrNumber()
	if (!prNumber) {
		console.log('Could not get pull request number from context, exiting')
		return
	}

    const client = new github.GitHub(token)

    core.debug(`fetching changed files for pr #${prNumber}`)
    const changedFiles: string[] = await getChangedFiles(client, prNumber)

	await addAssignees(client, prNumber, ['MarcoEidinger'])

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getPrNumber(): number | undefined {
  const pullRequest = github.context.payload.pull_request
  if (!pullRequest) {
    return undefined
  }

  return pullRequest.number
}

async function getChangedFiles(
  client: github.GitHub,
  prNumber: number
): Promise<string[]> {
  const listFilesResponse = await client.pulls.listFiles({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber
  })

  const changedFiles = listFilesResponse.data.map(f => f.filename)

  core.debug('found changed files:')
  for (const file of changedFiles) {
    core.debug('  ' + file)
  }

  return changedFiles
}

async function addAssignees(
	client: github.GitHub,
	prNumber: number,
	assignees: string[]
  ) {
	await client.issues.addAssignees({
		owner: github.context.repo.owner,
		repo: github.context.repo.repo,
		issue_number: prNumber,
		assignees: assignees
	})
  }

run()
