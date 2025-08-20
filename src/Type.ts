import minimist from "minimist";

export type CmdArgs = minimist.ParsedArgs
export type PackageJsonType = {
    name?: string
    version?: string
    description?: string
    main?: string
    types?: string
    scripts?: Record<string, string>
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
    depsOn?: Record<string, string>
    devDepsOn?: Record<string, string>
    [key: string]: unknown
}

export type PkgDepsFilters = RegExp[] | ((name:string)=>boolean)
