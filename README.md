# Introduction 
HIVE is the Web-based Case Management System for Oregon's HIV Care and Treatment Programs.

# Environment Setup
> Install nodejs (https://nodejs.org, Use latest LTS version)
> Install git (https://git-scm.com/downloads)
> Install angular (npm install -g @angular/cli)\
> Install NX (npm install -g nx https://nx.dev/l/a/getting-started/intro)

# Build
> npm install\
> nx serve cms\
> nx build cms --verbose

# Solution upgrade
> do not use 'ng update', use 'nx migrate latest' instead (https://nx.dev/l/a/core-concepts/updating-nx)
>> nx migrate latest\
>> npm install\
>> nx migrate --run-migrations
# Branching Strategy
> [Gitflow] (https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

# Versioning Strategy
https://semver.org/

# Commit message format
https://www.conventionalcommits.org/en/v1.0.0-beta.2/
