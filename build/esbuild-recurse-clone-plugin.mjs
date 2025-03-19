/**
 *
 * @param {String | undefined} baseDir The base directory of which to read each
 *                                     folder with depth of param 'depth'.
 * @param {String | undefined} outDir  The output directory of which to write to
 *                                     each folder in param 'baseDir' with depth
 *                                     of param 'depth'.
 * @param {Number}             depth   The depths to recursively clone off of
 *                                     the param 'baseDir'.
 * @return {import("esbuild").Plugin | undefined}
 */
function customRecursePlugin(
  baseDir = undefined,
  outDir = undefined,
  depth = 1,
) {
  return undefined;
}

export default customRecursePlugin;
