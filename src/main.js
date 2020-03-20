import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import url from 'url';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    const tasks = new Listr([
    {
        title: 'Cloning repository...',
        task: async (ctx, task) => {
            let repo = (options.extensionType.toLowerCase() !== '*custom' ? 'https://github.com/DNNCommunity/starter-' + 
            options.extensionType.replace(' ', '-').toLowerCase() + 
            (options.moduleType !== undefined && options.extensionType.toLowerCase() === 'module' ? '-' + options.moduleType.replace(' ', '-').toLowerCase() : '') + 
            (options.personaBarModuleType !== undefined && options.extensionType.toLowerCase() === 'persona bar' ? '-' + options.personaBarModuleType.replace(' ', '-').toLowerCase() : '') +
            '.git' : options.customExtensionRepo);

            await execa('git', ['clone', repo, '.'], {
                cwd: options.targetDirectory
            }).catch((error) => {
				ctx.cloned = false;
				task.title = `Cloning repository ` + chalk.yellow.bold('(ERROR)');
				task.skip(error.stderr);
			})
        },
    },
    {
        title: 'Installing dependencies...',
        enabled: ctx => ctx.cloned !== false,
        task: (ctx, task) => projectInstall({
                cwd: options.targetDirectory,
                prefer: 'yarn'
            }
        ),
        skip: () => !options.runInstall
            ? 'Pass --install to automatically install dependencies'
            : undefined,
    },
    {
        title: '...',
        enabled: ctx => ctx.cloned !== false,
        task: (ctx, task) => { 
            task.title = `Project ` + chalk.green.bold('READY');
        } 
    }
    ]);
 
    await tasks.run();

    return true;
}