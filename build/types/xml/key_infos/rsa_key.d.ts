import { XmlObject } from "xml-core";
import { DigestMethod } from "../digest_method";
import { KeyInfoClause } from "./key_info_clause";
export interface IJwkRsa {
    alg: string;
    kty: string;
    e: string;
    n: string;
    ext: boolean;
}
export interface RsaPSSSignParams extends RsaPssParams, Algorithm {
    hash: AlgorithmIdentifier;
}
/**
 * Represents the <RSAKeyValue> element of an XML signature.
 */
export declare class RsaKeyValue extends KeyInfoClause {
    /**
     * Gets the Modulus of the public key
     */
    Modulus: Uint8Array | null;
    /**
     * Gets the Exponent of the public key
     */
    Exponent: Uint8Array | null;
    protected key: CryptoKey | null;
    protected jwk: JsonWebKey | null;
    protected keyUsage: string[];
    /**
     * Imports key to the RSAKeyValue object
     * @param  {CryptoKey} key
     * @returns Promise
     */
    importKey(key: CryptoKey): Promise<this>;
    /**
     * Exports key from the RSAKeyValue object
     * @param  {Algorithm} alg
     * @returns Promise
     */
    exportKey(alg?: Algorithm): Promise<CryptoKey>;
    /**
     * Loads an RSA key clause from an XML element.
     * @param  {Element | string} element
     * @returns void
     */
    LoadXml(node: Element | string): void;
}
export declare class MaskGenerationFunction extends XmlObject {
    DigestMethod: DigestMethod;
    Algorithm: string;
}
export declare class PssAlgorithmParams extends XmlObject {
    static FromAlgorithm(algorithm: RsaPSSSignParams): PssAlgorithmParams;
    DigestMethod: DigestMethod;
    MGF: MaskGenerationFunction;
    SaltLength: number;
    TrailerField: number;
    constructor(algorithm?: RsaPSSSignParams);
    FromAlgorithm(algorithm: RsaPSSSignParams): void;
}
