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

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

async function gitClone(options) {
    let repo = 'https://github.com/DNNCommunity/starter-' + 
        options.extensionType.toLowerCase() + 
        (options.moduleType !== undefined && options.extensionType.toLowerCase() === 'module' ? '-' + options.moduleType.replace(' ', '-').toLowerCase() : '') + 
        (options.personaBarModuleType !== undefined && options.extensionType.toLowerCase() === 'persona bar' ? '-' + options.personaBarModuleType.replace(' ', '-').toLowerCase() : '');

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

    const currentFileUrl = import.meta.url;
    let templateDir = path.resolve(
        url.fileURLToPath(currentFileUrl),
        '..',
        '..',
        'extensions',
        options.extensionType.replace(' ', '-').toLowerCase()
    );
    if (options.moduleType !== undefined && options.extensionType.toLowerCase() === 'module') {
        templateDir = path.resolve(templateDir, options.moduleType.replace(' ', '-').toLowerCase());
    }
    if (options.personaBarModuleType !== undefined && options.extensionType.toLowerCase() === 'persona bar') {
        templateDir = path.resolve(templateDir, options.personaBarModuleType.replace(' ', '-').toLowerCase());
    }
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid project type', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
    /*{
        title: 'Copy project files',
        task: () => copyTemplateFiles(options),
    },
    {
        title: 'Initialize git',
        task: () => initGit(options),
        enabled: () => options.git,
    },*/
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