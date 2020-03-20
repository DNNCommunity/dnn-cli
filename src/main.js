import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import url from 'url';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

async function gitClone(options) {
    let repo = (options.extensionType.toLowerCase() !== '*custom' ? 'https://github.com/DNNCommunity/starter-' + 
        options.extensionType.replace(' ', '-').toLowerCase() + 
        (options.moduleType !== undefined && options.extensionType.toLowerCase() === 'module' ? '-' + options.moduleType.replace(' ', '-').toLowerCase() : '') + 
        (options.personaBarModuleType !== undefined && options.extensionType.toLowerCase() === 'persona bar' ? '-' + options.personaBarModuleType.replace(' ', '-').toLowerCase() : '') +
        '.git' : options.customExtensionRepo);

    const result = await execa('git', ['clone', repo, '.'], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to clone git repository for ' + repo));
    }
    return;
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    const tasks = new Listr([
    {
        title: 'Clone repository',
        task: () => gitClone(options),
    },
    {
        title: 'Install dependencies',
        task: () =>
        projectInstall({
            cwd: options.targetDirectory,
            prefer: 'yarn'
        }),
        skip: () =>
        !options.runInstall
            ? 'Pass --install to automatically install dependencies'
            : undefined,
    },
    ]);
 
    await tasks.run();

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}