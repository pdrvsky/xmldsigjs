import { XmlSignatureObject } from "../xml_object";
export declare abstract class KeyInfoClause extends XmlSignatureObject {
    Key: CryptoKey | null;
    abstract importKey(key: CryptoKey): Promise<this>;
    abstract exportKey(alg?: Algorithm): Promise<CryptoKey>;
}
