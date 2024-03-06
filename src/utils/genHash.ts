import crypto from "crypto";

/**
 * Generate hash from string
 *
 * @param args — strings to genenrate hash
 * @returns
 */
const genHash = (...args: any[]): string => {
  return crypto.createHash("md5").update(args.join("")).digest("hex");
};

export default genHash;
