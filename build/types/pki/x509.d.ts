import { Certificate } from "pkijs";
export type DigestAlgorithm = string | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
/**
 * Represents an <X509Certificate> element.
 */
export declare class X509Certificate {
    protected raw: Uint8Array;
    protected simpl: Certificate;
    protected publicKey: CryptoKey | null;
    constructor(rawData?: BufferSource);
    /**
     * Gets a serial number of the certificate in BIG INTEGER string format
     */
    get SerialNumber(): string;
    /**
     * Gets a issuer name of the certificate
     */
    get Issuer(): string;
    /**
     * Gets a subject name of the certificate
     */
    get Subject(): string;
    /**
     * Returns a thumbprint of the certificate
     * @param  {DigestAlgorithm="SHA-1"} algName Digest algorithm name
     * @returns Promise<ArrayBuffer>
     */
    Thumbprint(algName?: DigestAlgorithm): Promise<ArrayBuffer>;
    /**
     * Gets the public key from the X509Certificate
     */
    get PublicKey(): CryptoKey | null;
    /**
     * Returns DER raw of X509Certificate
     */
    GetRaw(): Uint8Array;
    /**
     * Returns public key from X509Certificate
     * @param  {Algorithm} algorithm
     * @returns Promise<CryptoKey>
     */
    exportKey(algorithm?: Algorithm | EcKeyImportParams | RsaHashedImportParams): Promise<CryptoKey>;
    /**
     * Converts X500Name to string
     * @param  {RDN} name X500Name
     * @param  {string} splitter Splitter char. Default ','
     * @returns string Formatted string
     * Example:
     * > C=Some name, O=Some organization name, C=RU
     */
    protected NameToString(name: any, splitter?: string): string;
    /**
     * Loads X509Certificate from DER data
     * @param  {Uint8Array} rawData
     */
    protected LoadRaw(rawData: BufferSource): void;
    private isHashedAlgorithm;
}
