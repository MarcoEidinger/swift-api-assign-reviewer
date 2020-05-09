![Build](https://github.com/MarcoEidinger/swift-api-assign-reviewer/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/MarcoEidinger/swift-api-assign-reviewer/branch/master/graph/badge.svg)](https://codecov.io/gh/MarcoEidinger/swift-api-assign-reviewer)

# swift-api-assign-reviewer

GitHub action to detect access control changes (open/public) in Swift files and set reviewer/assignee to pull request 

## Configuration

Install github action and create `.github/swift_api_assign_reviewer.yml` in your repository

```yml
# Set to true to add reviewers to pull requests
addReviewers: true

# Set to true to add assignees to pull requests
addAssignees: false

# A list of reviewers to be added to pull requests (GitHub user name)
reviewers:
  - reviewerA
  - reviewerB
  - reviewerC

# A number of reviewers added to the pull request
# Set 0 to add all the reviewers (default: 0)
numberOfReviewers: 0

# A list of assignees, overrides reviewers if set
# assignees:
#   - assigneeA

# A number of assignees to add to the pull request
# Set to 0 to add all of the assignees.
# Uses numberOfReviewers if unset.
# numberOfAssignees: 2

# A list of keywords to be skipped the process that add reviewers if pull requests include it
# skipKeywords:
#   - wip
```

## Development

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run pack
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
```

