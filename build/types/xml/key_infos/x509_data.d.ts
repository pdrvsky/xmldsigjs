import { X509Certificate } from "../../pki";
import { XmlSignatureObject } from "../xml_object";
import { KeyInfoClause } from "./key_info_clause";
/**
 *
 * <element name="X509Data" type="ds:X509DataType"/>
 * <complexType name="X509DataType">
 *   <sequence maxOccurs="unbounded">
 *     <choice>
 *       <element name="X509IssuerSerial" type="ds:X509IssuerSerialType"/>
 *       <element name="X509SKI" type="base64Binary"/>
 *       <element name="X509SubjectName" type="string"/>
 *       <element name="X509Certificate" type="base64Binary"/>
 *       <element name="X509CRL" type="base64Binary"/>
 *       <any namespace="##other" processContents="lax"/>
 *     </choice>
 *   </sequence>
 * </complexType>
 *
 *  <complexType name="X509IssuerSerialType">
 *    <sequence>
 *      <element name="X509IssuerName" type="string"/>
 *      <element name="X509SerialNumber" type="integer"/>
 *    </sequence>
 *  </complexType>
 *
 */
export declare class X509IssuerSerial extends XmlSignatureObject {
    X509IssuerName: string;
    X509SerialNumber: string;
}
export declare enum X509IncludeOption {
    None = 0,
    EndCertOnly = 1,
    ExcludeRoot = 2,
    WholeChain = 3
}
export interface IX509IssuerSerial {
    issuerName: string;
    serialNumber: string;
}
/**
 * Represents an <X509Data> sub element of an XMLDSIG or XML Encryption <KeyInfo> element.
 */
export declare class KeyInfoX509Data extends KeyInfoClause {
    private x509crl;
    private IssuerSerialList;
    private SubjectKeyIdList;
    private SubjectNameList;
    private X509CertificateList;
    constructor();
    constructor(rgbCert: Uint8Array);
    constructor(cert: X509Certificate, includeOptions?: X509IncludeOption);
    importKey(key: CryptoKey): Promise<this>;
    /**
     * Exports key from X509Data object
     * @param  {Algorithm} alg
     * @returns Promise
     */
    exportKey(alg?: RsaHashedImportParams | EcKeyImportParams): Promise<CryptoKey>;
    /**
     * Gets a list of the X.509v3 certificates contained in the KeyInfoX509Data object.
     */
    get Certificates(): X509Certificate[];
    /**
     * Gets or sets the Certificate Revocation List (CRL) contained within the KeyInfoX509Data object.
     */
    get CRL(): Uint8Array | null;
    set CRL(value: Uint8Array | null);
    /**
     * Gets a list of X509IssuerSerial structures that represent an issuer name and serial number pair.
     */
    get IssuerSerials(): IX509IssuerSerial[];
    /**
     * Gets a list of the subject key identifiers (SKIs) contained in the KeyInfoX509Data object.
     */
    get SubjectKeyIds(): Uint8Array[];
    /**
     * Gets a list of the subject names of the entities contained in the KeyInfoX509Data object.
     */
    get SubjectNames(): string[];
    /**
     * Adds the specified X.509v3 certificate to the KeyInfoX509Data.
     * @param  {X509Certificate} certificate
     * @returns void
     */
    AddCertificate(certificate: X509Certificate): void;
    /**
     * Adds the specified issuer name and serial number pair to the KeyInfoX509Data object.
     * @param  {string} issuerName
     * @param  {string} serialNumber
     * @returns void
     */
    AddIssuerSerial(issuerName: string, serialNumber: string): void;
    /**
     * Adds the specified subject key identifier (SKI) to the KeyInfoX509Data object.
     * @param  {string | Uint8Array} subjectKeyId
     * @returns void
     */
    AddSubjectKeyId(subjectKeyId: string | Uint8Array): void;
    /**
     * Adds the subject name of the entity that was issued an X.509v3 certificate to the KeyInfoX509Data object.
     * @param  {string} subjectName
     * @returns void
     */
    AddSubjectName(subjectName: string): void;
    /**
     * Returns an XML representation of the KeyInfoX509Data object.
     * @returns Element
     */
    GetXml(): Element;
    /**
     * Parses the input XmlElement object and configures the internal state of the KeyInfoX509Data object to match.
     * @param  {Element} element
     * @returns void
     */
    LoadXml(element: Element): void;
    private AddCertificatesChainFrom;
}
