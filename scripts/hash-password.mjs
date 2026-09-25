// Generates the ADMIN_PASSWORD_HASH (and a fresh SESSION_SECRET) for the
// admin panel. Usage:  npm run admin:hash-password
// The password is typed at a hidden prompt so it never lands in shell history.
// Keep the format in sync with src/lib/auth/password.ts.
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

function prompt(question) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    if (!stdin.isTTY) {
      // Piped input: read the first line.
      let data = "";
      stdin.setEncoding("utf8");
      stdin.on("data", (c) => (data += c));
      stdin.on("end", () => resolve(data.split(/\r?\n/)[0]));
      return;
    }
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (ch) => {
      if (ch === "\r" || ch === "\n" || ch === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onData);
        stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") {
        stdout.write("\n");
        process.exit(130);
      } else if (ch === "\u007f" || ch === "\b") {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    };
    stdin.on("data", onData);
    stdin.resume();
  });
}

const password = await prompt("New admin password: ");
if (password.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}
if (process.stdin.isTTY && (await prompt("Repeat password: ")) !== password) {
  console.error("Passwords don't match.");
  process.exit(1);
}

const salt = randomBytes(16);
const key = await scryptAsync(password, salt, 64);
console.log(`\nAdd these to the server's environment (e.g. .env.local):\n`);
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${key.toString("hex")}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
console.log(`\nChanging SESSION_SECRET signs everyone out; keep the existing one if you only want a new password.`);
