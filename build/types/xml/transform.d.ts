import * as XmlCore from "xml-core";
import { XmlSignatureObject } from "./xml_object";
/**
 *
 * <element name="Transforms" type="ds:TransformsType"/>
 * <complexType name="TransformsType">
 *   <sequence>
 *     <element ref="ds:Transform" maxOccurs="unbounded"/>
 *   </sequence>
 * </complexType>
 *
 * <element name="Transform" type="ds:TransformType"/>
 * <complexType name="TransformType" mixed="true">
 *   <choice minOccurs="0" maxOccurs="unbounded">
 *     <any namespace="##other" processContents="lax"/>
 *     <!--  (1,1) elements from (0,unbounded) namespaces  -->
 *     <element name="XPath" type="string"/>
 *   </choice>
 *   <attribute name="Algorithm" type="anyURI" use="required"/>
 * </complexType>
 *
 */
export interface ITransform extends XmlCore.IXmlSerializable {
    Algorithm: string;
    LoadInnerXml(node: Node): void;
    GetInnerXml(): Node | null;
    GetOutput(): any;
}
export type ITransformConstructable = new () => Transform;
/**
 * The Transform element contains a single transformation
 */
export declare class Transform extends XmlSignatureObject implements ITransform {
    Algorithm: string;
    /**
     * XPath of the transformation
     */
    XPath: string;
    protected innerXml: Node | null;
    /**
     * When overridden in a derived class, returns the output of the current Transform object.
     */
    GetOutput(): string;
    LoadInnerXml(node: Node): void;
    GetInnerXml(): Node | null;
}
