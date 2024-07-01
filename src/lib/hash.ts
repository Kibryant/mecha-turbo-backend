import * as bcrypt from "bcrypt";

async function hash(string: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(string, salt);
  return hash;
}

async function compareHash(string: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(string, hash);
}

export { hash, compareHash };
