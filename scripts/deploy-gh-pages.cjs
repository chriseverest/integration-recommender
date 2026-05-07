/**
 * gh-pages caches a clone under node_modules/.cache/gh-pages. If that cache is
 * half-written (e.g. interrupted deploy), the next run can fail with:
 *   fatal: a branch named 'gh-pages' already exists
 * Cleaning the cache before publish avoids that. See gh-pages docs / index.clean().
 *
 * When `origin` is https://github.com/..., this script passes an authenticated
 * remote URL built from `gh auth token` so `npm run deploy` uses your GitHub
 * CLI login instead of SSH keys or macOS keychain mismatches.
 */
const { execSync } = require('child_process')
const ghpages = require('gh-pages')
const path = require('path')

const dist = path.join(__dirname, '..', 'dist')

function repoRoot() {
  return path.join(__dirname, '..')
}

function getOriginUrl() {
  return execSync('git remote get-url origin', {
    encoding: 'utf8',
    cwd: repoRoot(),
  }).trim()
}

/**
 * @returns {string|undefined} Fully qualified HTTPS URL with embed token, or undefined to let gh-pages use git remote as-is (e.g. SSH).
 */
function getPublishRepoUrl() {
  let origin
  try {
    origin = getOriginUrl()
  } catch {
    return undefined
  }

  if (origin.startsWith('git@github.com:')) {
    console.warn(
      '[deploy] origin uses SSH. For deploy via GitHub CLI, switch to HTTPS:\n' +
        '  git remote set-url origin https://github.com/<user>/<repo>.git',
    )
    return undefined
  }

  if (!origin.startsWith('https://github.com/')) {
    return undefined
  }

  try {
    const token = execSync('gh auth token -h github.com', {
      encoding: 'utf8',
    }).trim()
    if (!token) {
      throw new Error('empty token')
    }
    const withGit = origin.endsWith('.git') ? origin : `${origin}.git`
    const u = new URL(withGit)
    u.username = 'x-access-token'
    u.password = token
    return u.toString()
  } catch {
    console.error(
      '[deploy] Could not get a GitHub token. Run:\n' +
        '  gh auth login -h github.com\n' +
        '  gh auth setup-git',
    )
    process.exit(1)
  }
}

const opts = {
  nojekyll: true,
  history: false,
}
const repo = getPublishRepoUrl()
if (repo) opts.repo = repo

ghpages.clean()

ghpages.publish(dist, opts, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  process.stdout.write('Published to gh-pages\n')
})
