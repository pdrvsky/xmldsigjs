import { KeyInfoClause } from "./key_info_clause";
/**
 * Represents the <KeyValue> element of an XML signature.
 */
export declare class KeyValue extends KeyInfoClause {
    protected value: KeyInfoClause;
    set Value(v: KeyInfoClause);
    get Value(): KeyInfoClause;
    constructor(value?: KeyInfoClause);
    importKey(key: CryptoKey): Promise<this>;
    exportKey(alg?: Algorithm): Promise<CryptoKey>;
    protected OnGetXml(element: Element): void;
    protected OnLoadXml(element: Element): void;
}
