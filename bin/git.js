const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const { spawn } = require('node:child_process');

async function verifyGit() {
  try {
    const {stdout, stderr } = await exec(`git -v`)
    if (stdout.indexOf('git version') != -1) return true;
    else throw '';
  } catch(err) {
    return false;
  }
}

async function cloneRepo(repo, path, bare) {
  try {
    const { stdout, stderr } = await exec(`git clone ${repo} ${bare ? '--bare' : `--separate-git-dir="${path+'/sys/git_repo'}"`}`, {cwd: path});
    try {
      try { fs.rmSync(gitPath(repo, path) + '.git', {recursive: true, force: true}); } catch(err) {}
    } catch(err){}
    if (stdout.indexOf('Cloning into') != -1 || stderr.indexOf('Cloning into') != -1) return true;
    else throw '';
  } catch(err) {
    console.log('Repositório não existe ou você não possui permissão para clonar.'.red.bold);
    try {
      try { fs.rmSync(gitPath(repo, path) + '.git', {recursive: true, force: true}); } catch(err) {}
    } catch(err){}
    return false;
  }
}

async function verifyPermission(repo) {
  return await cloneRepo(repo, actualPath + '/', true);
}

async function verifyPush(gitPath) {
  try {
    const { stdout, stderr } = await exec(`git ls-remote`, { cwd: gitPath })
    if (stdout.indexOf('not found') != -1 || stderr.indexOf('not found') != -1) return true;
    else throw '';
  } catch(err) {
    if (err.toString().indexOf('not found') != -1) return true;
  }
}

async function gitPush(commitMessage = 'updating files') {
  let gitPath = actualPath + '/layout/';
  let vrf = await verifyPush(gitPath);
  if (vrf) {
    console.log('Você não tem permissão para dar push neste repositório'.red.bold);
    return false;
  }
  try {
    const { stdout, stderr } = await exec(`git commit "${gitPath}" --message="${commitMessage}" && git push`, { cwd: gitPath })
    console.log('teste1', stdout)
    console.log('teste2', stderr)

  } catch(err) {
    console.log('teste3', err)
    return false;
  }
}

const gitPath = (repo, path) => path + repo.split('/')[repo.split('/').length -1];

module.exports = {
  verifyGit, verifyPermission, gitPath, cloneRepo, gitPush
}