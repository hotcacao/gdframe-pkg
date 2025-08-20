import fs from 'node:fs'
import path from 'node:path'
import {chain, each, isArray, isEmpty, set} from "lodash"

export class PackageUtil {
  debug(...args: unknown[]) {
    console.log(...args)
  }

  private log(...args: unknown[]) {
    console.log(...args);
  }

  private error(...args: unknown[]) {
    console.log(...args);
  }

  addLocalPackageDeps(deps: Record<string, string>, path = 'dependencies') {
    const data = this.getLocalPackageJson()
    each(deps, (version, name) => {
      set(data, [path, name], version)
    })
    this.writeLocalPackageJson(data)
  }

  getLocalPackageJson() {
    const finalPath = path.resolve('./package.json')
    if (fs.existsSync(finalPath)) {
      const content = fs.readFileSync(`./package.json`, 'utf8')
      return JSON.parse(content)
    }
    throw `File "${finalPath}" not found`
  }

  writeLocalPackageJson(data: unknown) {
    const finalPath = path.resolve('./package.json')
    if (fs.existsSync(finalPath)) {
      const jsonString = JSON.stringify(data, null, 2)
      fs.writeFileSync(finalPath, jsonString, 'utf-8')
    } else {
      throw `File "${finalPath}" not found`
    }
  }

  getPackageJson(packageName: string, nodeModulePaths = ['node_modules']) {
    for (const nodeModulePath of nodeModulePaths) {
      const pkgPath = `${nodeModulePath}/${packageName}`
      this.debug(`Attempt to find "${packageName}" at path: ${pkgPath}`)
      if (fs.existsSync(pkgPath)) {
        const content = fs.readFileSync(`${pkgPath}/package.json`, 'utf8')
        return JSON.parse(content)
      }
    }
    throw `Package "${packageName}" not found`
  }

  getPackageNameFromPackageJson() {
    return this.getLocalPackageJson()?.name
  }

  installDeps(packages: string[] | Record<string, string>, saveDev = true, dryRun = false) {
    if (isEmpty(packages)) {
      return
    }

    const pkgOptions: string[] = isArray(packages)
      ? packages
      : chain(packages)
        .map((v, k) => {
          return `${k}@${v}`
        })
        .value()

    const deps: Record<string, string> = {}
    each(pkgOptions, (e: string) => {
      const lastIdx = e.lastIndexOf('@')
      if (lastIdx === -1) {
        deps[e] = '*'
      } else {
        const name = e.slice(0, lastIdx)
        deps[name] = e.slice(lastIdx + 1) || '*'
      }
    })

    this.debug(pkgOptions.join(' '))
    if (!dryRun) {
      this.addLocalPackageDeps(deps, saveDev ? 'devDependencies' : 'dependencies')
    }
  }

  parseDeps(pkgName: string, fieldName: string, option?: { nodeModulesPaths: string[] }) {
    if (!pkgName) {
      throw `Cannot discover package "${pkgName}" to install "${fieldName}"`
    }

    const nodeModulesPaths = option?.nodeModulesPaths ?? [
      'node_modules',
      '../node_modules',
      '../../node_modules',
      '../../../node_modules',
    ]

    const packageJson = this.getPackageJson(pkgName, nodeModulesPaths)
    return packageJson?.[fieldName] || {}
  }
}
