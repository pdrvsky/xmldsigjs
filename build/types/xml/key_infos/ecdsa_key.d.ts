import { XmlObject } from "xml-core";
import { KeyInfoClause } from "./key_info_clause";
export declare type NamedCurveType = string | "P-256" | "P-384" | "P-521";
export declare class EcdsaPublicKey extends XmlObject {
    X: Uint8Array;
    Y: Uint8Array;
}
export declare class NamedCurve extends XmlObject {
    Uri: string;
}
export declare class DomainParameters extends XmlObject {
    NamedCurve: NamedCurve;
}
/**
 * Represents the <ECKeyValue> element of an XML signature.
 */
export declare class EcdsaKeyValue extends KeyInfoClause {
    DomainParameters: DomainParameters;
    PublicKey: EcdsaPublicKey;
    protected name: string;
    protected key: CryptoKey | null;
    protected jwk: JsonWebKey | null;
    protected keyUsage: string[] | null;
    /**
     * Gets the NamedCurve value of then public key
     */
    get NamedCurve(): string;
    /**
     * Imports key to the ECKeyValue object
     * @param  {CryptoKey} key
     * @returns Promise<this>
     */
    importKey(key: CryptoKey): Promise<this>;
    /**
     * Exports key from the ECKeyValue object
     * @param  {Algorithm} alg
     * @returns Promise
     */
    exportKey(alg?: Algorithm): Promise<CryptoKey>;
}
