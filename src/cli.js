import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
        },
        {
            argv: rawArgs.slice(2),
        }
    );

    let extensionTypeIndex = 0;
    let moduleTypeIndex = 1;
    let personaBarModuleTypeIndex = 1;

    if (args._[0] === 'create-extension') {
        extensionTypeIndex++;
        moduleTypeIndex++;
        personaBarModuleTypeIndex++;
    }

    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        extensionType: args._[extensionTypeIndex],
        moduleType: (args._[extensionTypeIndex].toLowerCase() === 'module' ? args._[moduleTypeIndex] : undefined),
        personaBarModuleType: (args._[extensionTypeIndex].toLowerCase() === 'persona bar' ? args._[personaBarModuleTypeIndex] : undefined),
        runInstall: args['--install'] || false,
    };
}

async function promptForMissingOptions(options) {
    
    const defaultExtensionType = 'Module';
    const defaultModuleType = 'SPA';
    const defaultPersonaBarModuleType = 'HTML';

    if (options.skipPrompts) {
      return {
        ...options,
        extensionType: options.extensionType || defaultExtensionType,
        moduleType: options.moduleType || defaultModuleType,
        personaBarModuleType: options.personaBarModuleType || defaultPersonaBarModuleType
      };
    }
   
    const questions = [];
    if (!options.extensionType) {
        questions.push({
          type: 'list',
          name: 'extensionType',
          message: 'Please choose an extension type to use',
          choices: [
              'Module', 
              'Authentication System', 
              'Connector', 
              'Container', 
              'Core Language Pack', 
              'Extension Language Pack', 
              'JavaScript Library',
              'Library',
              'Persona Bar',
              'Provider',
              'Scheduled Job',
              'Theme',
              'Skin Object',
              'Widget'
            ],
          default: defaultExtensionType,
        });
    }
     
    if (!options.moduleType) {
        questions.push({
            type: 'list',
            name: 'moduleType',
            message: 'Please choose a module type to use (if applicable)',
            when: (answers) => answers.extensionType === 'Module',
            choices: [
                'SPA', 
                'MVC', 
                'Web Forms', 
                'Razor 3'
            ],
            default: defaultModuleType,
        });
    }
   
    if (!options.personaBarModuleType) {
      questions.push({
          type: 'list',
          name: 'personaBarModuleType',
          message: 'Please choose a Persona Bar module type to use',
          when: (answers) => answers.extensionType === 'Persona Bar',
          choices: [
              'HTML',
              'React',
              'Vue',
              'Angular', 
              'AngularJS'
          ],
          default: defaultPersonaBarModuleType
      });
  }
 
  if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      extensionType: options.extensionType || answers.extensionType,
      moduleType: options.moduleType || answers.moduleType,
      personaBarModuleType: options.personaBarModuleType || answers.personaBarModuleType,
      git: options.git || answers.git,
    };
}
   
export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    //console.log(options);
    await createProject(options);
}