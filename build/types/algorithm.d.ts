export type BASE64 = string;
export interface IAlgorithm {
    algorithm: Algorithm;
    namespaceURI: string;
    getAlgorithmName(): string;
}
export interface IHashAlgorithm extends IAlgorithm {
    Digest(xml: BufferSource | string | Node): Promise<Uint8Array>;
}
export type IHashAlgorithmConstructable = new () => IHashAlgorithm;
export declare abstract class XmlAlgorithm implements IAlgorithm {
    algorithm: Algorithm;
    namespaceURI: string;
    getAlgorithmName(): string;
}
export declare abstract class HashAlgorithm extends XmlAlgorithm implements IHashAlgorithm {
    Digest(xml: BufferSource | string | Node): Promise<Uint8Array>;
}
export interface ISignatureAlgorithm extends IAlgorithm {
    Sign(signedInfo: string, signingKey: CryptoKey, algorithm: Algorithm): Promise<ArrayBuffer>;
    Verify(signedInfo: string, key: CryptoKey, signatureValue: Uint8Array, algorithm?: Algorithm): Promise<boolean>;
}
export type ISignatureAlgorithmConstructable = new () => ISignatureAlgorithm;
export declare abstract class SignatureAlgorithm extends XmlAlgorithm implements ISignatureAlgorithm {
    /**
     * Sign the given string using the given key
     */
    Sign(signedInfo: string, signingKey: CryptoKey, algorithm: Algorithm): Promise<ArrayBuffer>;
    /**
     * Verify the given signature of the given string using key
     */
    Verify(signedInfo: string, key: CryptoKey, signatureValue: Uint8Array, algorithm?: Algorithm): Promise<boolean>;
}
