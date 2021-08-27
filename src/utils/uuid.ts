/* eslint-disable no-useless-escape */
import { fromByteArray } from 'base64-js';
import { sha256 } from 'js-sha256';

function generateRandomString(len: number, alphabet: string) {
  const randomData = generateRandomData(len);

  const chars = [...Array(len)].map((_, idx) =>
    alphabet.charCodeAt(randomData[idx] % alphabet.length)
  );

  return String.fromCharCode.apply(null, chars);
}

function generateRandomData(len: number): number[] {
  return [...Array(len)].map(() => Math.floor(256 * Math.random()));
}

export function generateCodeVerifier(len: number) {
  return generateRandomString(
    len,
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  );
}

const hexDigits = '0123456789abcdef';

export function createUUID(): string {
  const s = generateRandomString(36, hexDigits).split('');

  s[14] = '4';
  // eslint-disable-next-line no-bitwise
  s[19] = hexDigits.substr(((s[19] as any) & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  return s.join('');
}

export function generatePkceChallenge(
  pkceMethod: string,
  codeVerifier: string
) {
  switch (pkceMethod) {
    // The use of the "plain" method is considered insecure and therefore not supported.
    case 'S256':
      // hash codeVerifier, then encode as url-safe base64 without padding
      const hashBytes = new Uint8Array(sha256.arrayBuffer(codeVerifier));
      const encodedHash = fromByteArray(hashBytes)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/\=/g, '');
      return encodedHash;

    default:
      throw 'Invalid value for pkceMethod';
  }
}
