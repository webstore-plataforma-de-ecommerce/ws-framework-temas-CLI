const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function verifyGit() {
  try {
    const {stdout, stderr } = await exec(`git --version`)
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

async function verifyPermission(repo, token) {
  let path = actualPath + '/teste' + token + '/';
  fs.mkdirSync(path);
  const permission = await cloneRepo(repo, path, true);
  fs.rmdirSync(path)
  return permission;
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
    const { stdout, stderr } = await exec(`git add "${gitPath}" && git commit --message="${commitMessage}" && git push`, { cwd: gitPath })
    console.log(stdout, '\n', stderr);
    return true
  } catch(err) {
    console.log(err);
    return false;
  }
}

const gitPath = (repo, path) => path + repo.split('/')[repo.split('/').length -1];

module.exports = {
  verifyGit, verifyPermission, gitPath, cloneRepo, gitPush
}