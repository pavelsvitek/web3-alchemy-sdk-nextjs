import crypto from 'crypto';

export function getRandomEVMAddress(): string {
  return '0x' + crypto.randomBytes(20).toString('hex');
}
