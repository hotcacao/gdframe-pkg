import {PkgDeps} from "@gdframe/pkg-json/PkgDeps"
import minimist from "minimist"
import {getCmdArgAsArray} from "@gdframe/pkg-json/CmdArgsUtil"
import {chain} from "lodash"

const args = minimist(process.argv)

const filtersArgs = getCmdArgAsArray("filter", args)
const filters = chain(filtersArgs).map(e => {
  return new RegExp(e)
}).value()

const dryRun = args['dryRun'] === 1

const runner = new PkgDeps({
  filters
})
runner.run({dryRun})
