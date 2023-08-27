import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt, { genSaltSync } from "bcrypt";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, genSaltSync(10))
export const isValidPassword = (savedPassword, password) => bcrypt.compareSync(password, savedPassword)