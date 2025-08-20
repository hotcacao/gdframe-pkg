import fs from 'node:fs'
import path from 'node:path'
import {PackageJsonType} from "@gdframe/pkg-json/Type";

export class PkgJson {
  run(input?: {
    emptyDeps?: boolean,
    emptyDevDeps?: boolean
    emptyAllDeps?: boolean
  }) {
    try {
      const {path: pkgJsonPath, data: pkgJson} = this.getPackageJson();
      const {path: pkgJsPath, data: pkgJs} = this.getPackageJs();

      if (pkgJson && pkgJs) {
        const emptyDeps = !!input?.emptyDeps
        const emptyDevDeps = !!input?.emptyDevDeps
        const emptyAllDeps = !!input?.emptyAllDeps

        if (emptyDeps && pkgJson?.dependencies) {
          pkgJson.dependencies = undefined
        }

        if (emptyDevDeps && pkgJson?.devDependencies) {
          pkgJson.devDependencies = undefined
        }

        if (emptyAllDeps) {
          pkgJson.dependencies = undefined
          pkgJson.devDependencies = undefined
          pkgJson.depsOn = undefined
          pkgJson.devDepsOn = undefined
        }

        const configObject = pkgJs(pkgJson) ?? pkgJson

        const jsonString = JSON.stringify(configObject, null, 2)
        fs.writeFileSync(pkgJsonPath, jsonString, 'utf-8')
        this.log(`Converted ${pkgJsPath} to ${pkgJsonPath}`)
      }
    } catch (error) {
      this.error(`Error converting package.(js|cjs) to JSON: ${error}`)
    }
  }

  getPackageJs(): { path: string, data: undefined | ((base?: PackageJsonType) => PackageJsonType) } {
    const pkgJsRPath = './package.js'
    const pkgCjsRPath = './package.cjs'
    const pkgJsPath = path.resolve(pkgJsRPath)
    const pkgCjsPath = path.resolve(pkgCjsRPath)
    let finalPath: string = pkgCjsPath;

    let packageJsValid = fs.existsSync(pkgJsPath) ? fs.lstatSync(pkgJsPath).isFile() : undefined
    let packageCjsValid = fs.existsSync(pkgCjsPath) ? fs.lstatSync(pkgCjsPath).isFile() : undefined
    let result: unknown;
    if (packageCjsValid) {
      result = require(pkgCjsPath);
      finalPath = pkgCjsPath;
    }
    if (!result && packageJsValid) {
      result = require(pkgJsPath);
      finalPath = pkgJsPath;
    }
    if (typeof result !== 'function') {
      throw new Error(`expect ${pkgJsPath} to export a function`)
    }
    return {
      path: finalPath,
      data: result as ((base?: PackageJsonType) => PackageJsonType)
    }
  }

  getPackageJson(): { path: string, data: PackageJsonType | undefined } {
    const pkgJsonRPath = './package.json'

    const pkgJsonPath = path.resolve(pkgJsonRPath)
    const pkgJsonValid = fs.existsSync(pkgJsonPath) ? fs.lstatSync(pkgJsonRPath).isFile() : undefined

    let result: unknown;
    if (pkgJsonValid) {
      result = require(pkgJsonPath);
    }
    return {
      path: pkgJsonPath,
      data: typeof result === 'object' ? result as PackageJsonType : undefined
    }
  }

  private log(...args: unknown[]) {
    console.log(...args);
  }

  private error(...args: unknown[]) {
    console.log(...args);
  }
}
