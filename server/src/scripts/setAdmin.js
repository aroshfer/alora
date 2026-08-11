// Usage: npm run make-admin -- <username-or-email>
//
// Deliberately a local script, not an API route — granting admin access
// should never be reachable over HTTP, even by another admin account,
// to keep the attack surface for privilege escalation as small as possible.

import { db, findUserByUsernameOrEmail } from "../db.js";

const identifier = process.argv[2];

if (!identifier) {
  console.error("Usage: npm run make-admin -- <username-or-email>");
  process.exit(1);
}

const user = findUserByUsernameOrEmail(identifier);

if (!user) {
  console.error(`No user found matching "${identifier}".`);
  process.exit(1);
}

user.isAdmin = true;
await db.write();

console.log(`✓ ${user.username} (${user.email}) is now an admin.`);
EOF