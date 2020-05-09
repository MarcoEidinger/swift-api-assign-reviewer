![Build](https://github.com/MarcoEidinger/swift-api-assign-reviewer/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/MarcoEidinger/swift-api-assign-reviewer/branch/master/graph/badge.svg)](https://codecov.io/gh/MarcoEidinger/swift-api-assign-reviewer)

# swift-api-assign-reviewer

GitHub action to detect access control changes (open/public) in Swift files and set reviewer/assignee to pull request 

Example

```yml
name: API-Protection

on:
  pull_request:
    types: [opened, synchronize]

jobs:

  auto-assign-reviewer:
    runs-on: ubuntu-latest
    steps:
      - uses: MarcoEidinger/swift-api-assign-reviewer@1.0.0
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          configuration-path: ".github/swift-api-assign-reviewer.yml"
```
## Configuration

Define a **configuration** file in your repository, e.g `.github/swift_api_assign_reviewer.yml`

### Example

```yml
# Set to true to add reviewers to pull requests
addReviewers: true

# Set to true to add assignees to pull requests
addAssignees: false

# A list of reviewers to be added to pull requests (GitHub user name)
reviewers:
  - MarcoEidinger

# A number of reviewers added to the pull request
# Set 0 to add all the reviewers (default: 0)
numberOfReviewers: 0
```

### Full Specification

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
```
