import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt) // Move the callback implementation to a async implementation

export class Password {
  static async hash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hasedPassword, salt] = storedPassword.split('.')
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

    return buf.toString('hex') === hasedPassword
  }
}
