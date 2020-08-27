export default function validatePasswordEqual(password: string, expectedPassword: string) {
    if (password !== expectedPassword) { return false; }
    else { return true; }
  }