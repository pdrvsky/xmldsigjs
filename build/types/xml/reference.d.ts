import { DigestMethod } from "./digest_method";
import { Transforms } from "./transform_collection";
import { XmlSignatureCollection, XmlSignatureObject } from "./xml_object";
/**
 *
 * <element name="Reference" type="ds:ReferenceType"/>
 * <complexType name="ReferenceType">
 *   <sequence>
 *     <element ref="ds:Transforms" minOccurs="0"/>
 *     <element ref="ds:DigestMethod"/>
 *     <element ref="ds:DigestValue"/>
 *   </sequence>
 *   <attribute name="Id" type="ID" use="optional"/>
 *   <attribute name="URI" type="anyURI" use="optional"/>
 *   <attribute name="Type" type="anyURI" use="optional"/>
 * </complexType>
 *
 */
/**
 * Represents the <reference> element of an XML signature.
 */
export declare class Reference extends XmlSignatureObject {
    /**
     * Gets or sets the ID of the current Reference.
     */
    Id: string;
    /**
     * Gets or sets the Uri of the current Reference.
     */
    Uri?: string;
    /**
     * Gets or sets the type of the object being signed.
     */
    Type: string;
    Transforms: Transforms;
    /**
     * Gets or sets the digest method Uniform Resource Identifier (URI) of the current
     */
    DigestMethod: DigestMethod;
    /**
     * Gets or sets the digest value of the current Reference.
     */
    DigestValue: Uint8Array;
    DigestSource: ArrayBuffer;
    constructor(uri?: string);
}
export declare class References extends XmlSignatureCollection<Reference> {
}
