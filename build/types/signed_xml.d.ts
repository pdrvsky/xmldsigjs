import * as XmlCore from "xml-core";
import { Reference, Signature, Transform as XmlTransform, Transforms as XmlTransforms } from "./xml";
export interface OptionsXPathSignTransform {
    name: "xpath";
    selector: string;
    namespaces?: Record<string, string>;
}
export type OptionsSignTransform = "enveloped" | "c14n" | "exc-c14n" | "c14n-com" | "exc-c14n-com" | "base64" | OptionsXPathSignTransform;
export type DigestReferenceSource = Element | BufferSource;
export interface OptionsVerify {
    key?: CryptoKey;
    content?: DigestReferenceSource;
}
export interface OptionsSignReference {
    /**
     * Id of Reference
     *
     * @type {string}
     * @memberOf OptionsSignReference
     */
    id?: string;
    uri?: string;
    type?: string;
    /**
     * Hash algorithm
     */
    hash: AlgorithmIdentifier;
    /**
     * List of transforms
     */
    transforms?: OptionsSignTransform[];
    /**
     * File buffer to calculate digest from. Used
     * only in Detached mode
     *
     * @type {ArrayBuffer}
     * @memberOf OptionsSignReference
     */
    digestSource?: ArrayBuffer;
    /**
     * File digest. Used only in detached mode
     *
     * @type {ArrayBuffer}
     * @memberOf OptionsSignReference
     */
    digestValue?: ArrayBuffer;
}
export interface OptionsSign {
    /**
     * Id of Signature
     */
    id?: string;
    /**
     * Public key for KeyInfo block
     *
     * @type {boolean}
     * @memberOf OptionsSign
     */
    keyValue?: CryptoKey;
    /**
     * List of X509 Certificates
     *
     * @type {string[]}
     * @memberOf OptionsSign
     */
    x509?: string[];
    /**
     * List of Reference
     * Default is Reference with hash alg SHA-256 and exc-c14n transform
     *
     * @type {OptionsSignReference[]}
     * @memberOf OptionsSign
     */
    references?: OptionsSignReference[];
}
/**
 * Provides a wrapper on a core XML signature object to facilitate creating XML signatures.
 */
export declare class SignedXml implements XmlCore.IXmlSerializable {
    get XmlSignature(): Signature;
    contentHandler?: (reference: Reference, target: this) => Promise<Document | DigestReferenceSource | null>;
    Parent?: Element | XmlCore.XmlObject;
    Key?: CryptoKey;
    Algorithm?: Algorithm | RsaPssParams | EcdsaParams;
    get Signature(): Uint8Array | null;
    protected signature: Signature;
    protected document?: Document;
    /**
     * Creates an instance of SignedXml.
     *
     * @param {(Document | Element)} [node]
     *
     * @memberOf SignedXml
     */
    constructor(node?: Document | Element);
    Sign(algorithm: Algorithm | EcdsaParams | RsaPssParams, key: CryptoKey, data: Document | DigestReferenceSource, options?: OptionsSign): Promise<Signature>;
    SignDetached(algorithm: Algorithm | EcdsaParams | RsaPssParams, key: CryptoKey, options?: OptionsSign): Promise<Signature>;
    Verify(params: OptionsVerify): Promise<boolean>;
    Verify(key: CryptoKey): Promise<boolean>;
    Verify(): Promise<boolean>;
    GetXml(): Element | null;
    /**
     * Loads a SignedXml state from an XML element.
     * @param  {Element | string} value The XML to load the SignedXml state from.
     * @returns void
     */
    LoadXml(value: Element | string): void;
    toString(): string;
    /**
     * Returns the public key of a signature.
     */
    protected GetPublicKeys(): Promise<CryptoKey[]>;
    /**
     * Returns dictionary of namespaces used in signature
     */
    protected GetSignatureNamespaces(): XmlCore.AssocArray<string>;
    /**
     * Copies namespaces from source element and its parents into destination element
     */
    protected CopyNamespaces(src: Element, dst: Element, ignoreDefault: boolean): void;
    /**
     * Injects namespaces from dictionary to the target element
     */
    protected InjectNamespaces(namespaces: {
        [index: string]: string;
    }, target: Element, ignoreDefault: boolean): void;
    protected DigestReference(source: DigestReferenceSource, reference: Reference, checkHmac: boolean): Promise<Uint8Array>;
    protected DigestDetachedReferences(): Promise<void>;
    protected DigestReferences(data: DigestReferenceSource): Promise<void>;
    protected TransformSignedInfo(data?: Element | Document | BufferSource): string;
    protected ResolveTransform(transform: OptionsSignTransform): XmlTransform;
    protected ApplyTransforms(transforms: XmlTransforms, input: Element): any;
    protected ApplySignOptions(signature: Signature, algorithm: Algorithm, key: CryptoKey, options: OptionsSign): Promise<void>;
    protected ValidateReferences(doc: DigestReferenceSource): Promise<boolean>;
    protected ValidateSignatureValue(keys: CryptoKey[]): Promise<boolean>;
}
export declare function SelectRootNamespaces(node: Element): XmlCore.AssocArray<string>;
