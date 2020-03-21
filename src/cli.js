import arg from 'arg';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--yes': Boolean,
            '--install': Boolean,
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
        extensionType: args._[extensionTypeIndex],
        moduleType: args._[moduleTypeIndex],
        personaBarModuleType: args._[moduleTypeIndex],
        customExtensionRepo: args._[moduleTypeIndex],
        runInstall: args['--install'] || false,
    };
}

async function promptForMissingOptions(options) {
    
    const defaultExtensionType = 'Module';
    const defaultModuleType = 'SPA';
    const defaultPersonaBarModuleType = 'HTML';
    const defaultCustomExtensionRepo = 'https://github.com/DNNCommunity/starter-module-web-forms.git';

    if (options.skipPrompts) {
      return {
        ...options,
        extensionType: options.extensionType || defaultExtensionType,
        moduleType: options.moduleType || defaultModuleType,
        personaBarModuleType: options.personaBarModuleType || defaultPersonaBarModuleType,
        customExtensionRepo: options.customExtensionRepo || defaultCustomExtensionRepo
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
              'Theme Object',
              'Widget',
              '*Custom'
            ],
          default: defaultExtensionType,
        });
    }
     
    if (!options.moduleType) {
        questions.push({
            type: 'list',
            name: 'moduleType',
            message: 'Please choose a module type to use',
            when: (answers) => answers.extensionType === 'Module' || (options.extensionType ? options.extensionType.toLowerCase() === 'module' : false),
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
            when: (answers) => answers.extensionType === 'Persona Bar' || (options.extensionType ? options.extensionType.toLowerCase() === 'persona bar' : false),
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
    
    if (!options.customExtensionRepo) {
        questions.push({
            type: 'input',
            name: 'customExtensionRepo',
            message: 'Enter custom git repo URL:',
            when: (answers) => answers.extensionType === '*Custom' || (options.extensionType ? options.extensionType.toLowerCase() === '*custom' : false),
            validate: function (answer) {
                var match = answer.match(/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/);
                return (match) ? true : 'Please enter a valid git repo URL in the form of https://github.com/<user>/<repo>.git'
            },
            default: defaultCustomExtensionRepo
        });
    }
      
      const answers = await inquirer.prompt(questions);
    return {
      ...options,
      extensionType: options.extensionType || answers.extensionType,
      moduleType: options.moduleType || answers.moduleType,
      personaBarModuleType: options.personaBarModuleType || answers.personaBarModuleType,
      customExtensionRepo: options.customExtensionRepo || answers.customExtensionRepo
    };
}

function displayDnn() {
    console.log(
        chalk.cyanBright(
            figlet.textSync('Dnn CLI', { horizontalLayout: 'full' })
        )
    );
}
   
export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    displayDnn();
    options = await promptForMissingOptions(options);
    //console.log(options);
    await createProject(options);
}