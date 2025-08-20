import {PkgDepsFilters} from "@gdframe/pkg-json/Type";
import {PackageUtil} from "@gdframe/pkg-json/PkgUtil"
import {assign, chain, each, isEmpty, isFunction} from "lodash"
import {PkgJsonNames} from "@gdframe/pkg-json/Constant"

function FalseFilters(name: string) {
  return false;
}

export class PkgDeps {
  filters: PkgDepsFilters;
  pkgUtil: PackageUtil

  constructor(input: { filters?: PkgDepsFilters, verbose?: boolean }) {
    const filters = input?.filters;
    this.filters = isEmpty(filters) ? FalseFilters : filters
    this.pkgUtil = new PackageUtil({
      verbose: input?.verbose
    })
  }

  collectDeps(fieldName: string) {
    const pkgName = this.pkgUtil.getPackageNameFromPackageJson()
    if (!pkgName) {
      throw `Invalid package name: ${pkgName}`
    }
    const packages: Record<string, string> = {}
    this.recursiveParseDeps(pkgName, 'workspace', fieldName, packages)
    const finalPackages: Record<string, string> = chain(packages)
      .keys()
      .sort()
      .reduce((value, key) => {
        return {
          ...value,
          [key]: packages[key],
        }
      }, {})
      .value()

    delete finalPackages[pkgName]
    return finalPackages
  }

  recursiveParseDeps(pkgName: string, version: string, fieldName: string, state: Record<string, string>) {
    if (state[pkgName] || !this.filterPackageName(pkgName)) {
      return false
    }
    state[pkgName] = version

    const deps = this.pkgUtil.parseDeps(pkgName, fieldName)
    each(deps, (dVersion, dName) => {
      this.recursiveParseDeps(dName, dVersion, fieldName, state)
    })
    assign(state, deps)

    return true
  }

  filterPackageName(name: string) {
    if (isFunction(this.filters)) {
      return this.filters(name);
    }
    for (const filter of this.filters) {
      if (filter.test(name)) {
        return true
      }
    }
    return false
  }

  getDepsNames() {
    return {
      depsOn: PkgJsonNames.depsOn,
      devDepsOn: PkgJsonNames.devDepsOn
    }
  }

  build({dryRun}: { dryRun?: boolean }) {
    const names = this.getDepsNames()
    const depsOn = this.collectDeps(names.depsOn)
    const devDepsOn = this.collectDeps(names.devDepsOn)

    if (depsOn) {
      this.pkgUtil.installDeps(depsOn, false, dryRun)
    }
    if (devDepsOn) {
      this.pkgUtil.installDeps(devDepsOn, true, dryRun)
    }
  }

  run({dryRun}: { dryRun: boolean }) {
    this.build({
      dryRun
    })
  }
}
