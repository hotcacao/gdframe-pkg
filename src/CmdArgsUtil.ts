import {CmdArgs} from "@gdframe/pkg-json/Type"
import {isArray, isString} from "lodash"

export function getCmdArgAsArray(name: string, args: CmdArgs) {
  const arg: unknown = args[name]
  if (isArray(arg)) {
    return arg as string[];
  }
  if (isString(arg) && arg.length) {
    return [arg]
  }
  return undefined
}
