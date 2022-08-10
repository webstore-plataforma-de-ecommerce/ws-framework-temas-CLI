const saveUpdate = (obj) => fs.writeFileSync('./layout/config/config.json', JSON.stringify(obj, null, 2))
const readConfigs = () => JSON.parse(fs.readFileSync('./layout/config/config.json', 'utf-8'))


const renameGroup = async (group) => {
  let consoleQuest = {
    type: 'string',
    message: 'Digite um novo nome para o grupo: ' + group.grupo.yellow.bold,
    name: 'name'
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let name = response.name;

  let actualConfigs = readConfigs();

  let vrf = await confirmOperation('renomear o grupo: ' + group.grupo.yellow.bold + ' por ' + name.blue.bold);

  if (vrf) {
    let indexOfGroup;
    actualConfigs.grupoPreferencias.map((elm, i) => indexOfGroup = elm.grupo == group.grupo ? i : indexOfGroup );

    group.grupo = name;

    actualConfigs.grupoPreferencias[indexOfGroup] = group;

    saveUpdate(actualConfigs);
    console.log('Grupo renomeado com sucesso'.green.bold)


  } else return intiatePrefs();
}

const renamePref = async (group, pref) => {
  let consoleQuest = {
    type: 'string',
    message: 'Digite um novo nome para a preferência: ' + pref.id.yellow.bold,
    name: 'name'
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let name = response.name;

  let actualConfigs = readConfigs();

  let vrf = await confirmOperation('renomear a preferência: ' + pref.id.yellow.bold + ' por ' + name.blue.bold);

  if (vrf) {
    let indexOfGroup;
    actualConfigs.grupoPreferencias.map((elm, i) => indexOfGroup = elm.grupo == group.grupo ? i : indexOfGroup );

    console.log(indexOfGroup)
    let indexOfPref = group.variaveis.indexOf(pref)
    
    pref.id = name

    group.variaveis[indexOfPref] = pref;

    actualConfigs.grupoPreferencias[indexOfGroup] = group;

    console.log(actualConfigs.grupoPreferencias)

    saveUpdate(actualConfigs);
    console.log('Preferência renomeada com sucesso'.green.bold);

  }else return intiatePrefs();
}

const removeGroup = async (group) => {
  let actualConfigs = readConfigs();

  let indexOfGroup;
  actualConfigs.grupoPreferencias.map((elm, i) => indexOfGroup = elm.grupo == group.grupo ? i : indexOfGroup );

  
  let vrf = await confirmOperation('excluir o grupo: ' + group.grupo.yellow.bold);
  
  if (vrf) {
    actualConfigs.grupoPreferencias.splice(indexOfGroup, 1);
    saveUpdate(actualConfigs);
    console.log('Grupo removido com sucesso'.green.bold);
  }
 
  process.exit(0);
}

const listPrefs = async (group) => {
  let choices =  group.variaveis.map(elm => elm.id);
  choices.push({ name: 'Criar Preferência'.blue.bold, value: 'Criar Preferência' });

  let consoleQuest = {
    type: "list",
    message: "Selecione uma preferência para editar.",
    name: 'prefId',
    choices: choices
  }

  let response = await new Inquirer.prompt(consoleQuest);
  let prefId = response.prefId;

  if (prefId == 'Criar Preferência') return createPref();

  let prefChoice = group.variaveis.filter(elm => prefId == elm.id)[0]
  
  return selectedPref(prefChoice, group);
}

const selectedPref = async (pref, group) => {
  let consoleQuest = {
    type: 'list',
    message: 'Oque deseja fazer com a preferência ' + pref.id.yellow.bold + '?',
    name: "selectedOption",
    choices: [
      { 
        name: 'Renomear'.blue.bold,
        value: 0
      }, 
      { 
        name: 'Excluir'.red.bold,
        value: 1
      }, 
      {
        name: 'Editar '.yellow.bold,
        value: 2
      }
    ]
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let selectedOption = `${response.selectedOption}`;

  if (selectedOption == 0) return await renamePref(group, pref)
  if (selectedOption == 1) return await removeObj(group, pref)
  if (selectedOption == 2) return await editPref(group, pref)
}

const createPref = async(pref, group, oldPref) => {
}

const listGroups = async (groupsArr) => {
  let choices =  groupsArr.map(elm => elm.grupo);
      choices.push({ name: 'Criar Grupo'.blue.bold, value: 'Criar Grupo' });

  let consoleQuest = {
    type: "list",
    message: "Selecione um grupo de preferências.",
    name: 'group',
    choices: choices 
  }

  let response = await new Inquirer.prompt(consoleQuest);
  let group = response.group;

  if (group == 'Criar Grupo') return createGroup();

  let groupChoice = groupsArr.filter(elm => elm.grupo == group)[0]

  return selectedGroup(groupChoice);
}

const selectedGroup = async (group) => {
  let groupName = group.grupo;

  let consoleQuest = {
    type: 'list',
    message: 'Oque deseja fazer com o grupo ' + groupName.yellow.bold + '?',
    name: "selectedOption",
    choices: [
      { 
        name: 'Renomear'.blue.bold,
        value: 0
      },
      { 
        name: 'Excluir'.red.bold,
        value: 1
      }, 
      {
        name: 'Editar'.yellow.bold,
        value: 2
      }
    ]
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let selectedOption = `${response.selectedOption}`;
  
  if (selectedOption == 0) return await renameGroup(group)
  if (selectedOption == 1) return await removeGroup(group)
  if (selectedOption == 2) return await listPrefs(group)
}

const createGroup = async () => {
  let consoleQuest = {
    type: 'string',
    message: 'Digite um nome para o novo grupo de preferências.',
    name: "newGroup"
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let newGroup = response.newGroup;

  let actualConfigs = readConfigs();

  let vrf = actualConfigs.grupoPreferencias.filter(elm => elm.grupo.toLowerCase() == newGroup.toLowerCase());

  if (vrf.length > 0) {
    console.log('Este grupo já existe'.red.bold)
    return createGroup();
  }

  if (newGroup.trim() == '') {
    console.log('Este grupo é inválido'.red.bold)
    return createGroup();
  }

  actualConfigs.grupoPreferencias.push({
    grupo: newGroup,
    variaveis: []
  });
  
  saveUpdate(actualConfigs);
  console.log('Grupo criado:'.bold, newGroup.yellow.bold);

  

}

const intiatePrefs = async () => {
  let actualConfigs = readConfigs();

  if (typeof actualConfigs.grupoPreferencias == undefined) {
    actualConfigs.grupoPreferencias = []
    saveUpdate(actualConfigs);
  }
  if (typeof actualConfigs.PreferenciasSets == undefined) {
    actualConfigs.PreferenciasSets = []
    saveUpdate(actualConfigs);
  }

  let groupsArr = actualConfigs.grupoPreferencias;

  if (!Array.isArray(groupsArr) || groupsArr.length == 0) {
    await createGroup();
    return;
  };

  return await listGroups(groupsArr);
}

module.exports = {
  default: intiatePrefs
}