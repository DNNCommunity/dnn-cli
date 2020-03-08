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

    if (args._[0] === 'create-extension') {
        extensionTypeIndex++;
        moduleTypeIndex++;
    }

    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        extensionType: args._[extensionTypeIndex],
        moduleType: args._[moduleTypeIndex],
        runInstall: args['--install'] || false,
    };
}

async function promptForMissingOptions(options) {
    
    const defaultExtensionType = 'Module';
    const defaultModuleType = 'SPA';

    if (options.skipPrompts) {
      return {
        ...options,
        extensionType: options.extensionType || defaultExtensionType,
        moduleType: options.moduleType || defaultModuleType,
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
      git: options.git || answers.git,
    };
}
   
export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    //console.log(options);
    await createProject(options);
}