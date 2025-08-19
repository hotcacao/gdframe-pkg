import fs from 'node:fs'
import path from 'node:path'
import minimist from 'minimist'
import {CmdArgs} from "@gdframe/pkg-json/type";

export class PkgJson {
    args: CmdArgs
    constructor(args = process.argv) {
        this.args = minimist(args)
    }

    run() {
        const pkgJsonRPath = './package.json'
        const pkgJsRPath = './package.js'

        const pkgJsonPath = path.resolve(pkgJsonRPath)
        const pkgJsPath = path.resolve(pkgJsRPath)

        try {
            const packageJsonValid = fs.existsSync(pkgJsonPath) ? fs.lstatSync(pkgJsonRPath).isFile() : undefined
            const packageJsValid = fs.existsSync(pkgJsPath) ? fs.lstatSync(pkgJsPath).isFile() : undefined
            if (packageJsonValid && packageJsValid) {
                const packageJson = require(pkgJsonPath)
                const packageJs = require(pkgJsPath)

                if (!packageJs || typeof packageJs !== 'function') {
                    throw new Error(`expect ${pkgJsPath} to export a function`)
                }

                const emptyDeps = false
                const emptyDevDeps = false
                const emptyAllDeps = false

                if (emptyDeps && packageJson?.dependencies) {
                    packageJson.dependencies = undefined
                }

                if (emptyDevDeps && packageJson?.devDependencies) {
                    packageJson.devDependencies = undefined
                }

                if (emptyAllDeps) {
                    packageJson.dependencies = undefined
                    packageJson.devDependencies = undefined
                    packageJson.depsOn = undefined
                    packageJson.devDepsOn = undefined
                }

                const configObject = packageJs(packageJson) ?? packageJson

                const jsonString = JSON.stringify(configObject, null, 2)
                fs.writeFileSync(pkgJsonPath, jsonString, 'utf-8')
                this.log(`Converted ${pkgJsPath} to ${pkgJsonPath}`)
            }
        } catch (error) {
            this.error(`Error converting ${pkgJsPath} to JSON: ${error}`)
        }
    }

    private log(...args: unknown[]){
        console.log(...args);
    }

    private error(...args: unknown[]){
        console.log(...args);
    }
}
