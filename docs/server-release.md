# Server release How-To

To release the server:

- [ ] Bump the version in `package.json`
- [ ] Generate a new changelog with:
  - `./bin/generate-commit-log --write recent`
- [ ] Commit version change and changelog
- [ ] Tag with `git tag VERSION`
- [ ] Push version and tags, `git push && git push --tags`
- [ ] Merge to `server-prod`:
  - Temporarily [edit the branch protection rules](https://github.com/mozilla-services/screenshots/settings/branch_protection_rules/2048091) to turn off protection on `server-prod` (by renaming the branch pattern)
  - `git push -f origin master:server-prod`
  - Re-enable the branch protection
  - This will trigger a deploy to stage. A deploy will take about 30 minutes.
  - View the CI build of [server-prod](https://circleci.com/gh/mozilla-services/screenshots/tree/server-prod)
  - IRC will get updates (no update until deploy happens)
  - [https://screenshots.stage.mozaws.net/__version__](https://screenshots.stage.mozaws.net/__version__) will show the status
- [ ] Ping our ops contact on IRC to deploy to prod
  - As of Q3 2018, primary is oremj, secondary is miles
  - [https://screenshots.firefox.com/__version__](https://screenshots.firefox.com/__version__) will show the status
  - IRC will get updates

Note if someone needs to re-deploy the last stage deployment (e.g., some dependent resource has been updated), then going to the [CircleCI server-prod builds](https://circleci.com/gh/mozilla-services/screenshots/tree/server-prod), finding the latest build, and "rebuilding" it should trigger a redeployment of stage.

To view production deploys, see [this query](http://logs.glob.uno/?a=search&c=mozilla%23screenshots&q=deployed+to+prod&se=)
