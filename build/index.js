'use strict';

var XmlCore = require('xml-core');
var pkijs = require('pkijs');
var tslib = require('tslib');
var Asn1Js = require('asn1js');
var pvtsutils = require('pvtsutils');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var XmlCore__namespace = /*#__PURE__*/_interopNamespaceDefault(XmlCore);
var Asn1Js__namespace = /*#__PURE__*/_interopNamespaceDefault(Asn1Js);

let engineCrypto = null;
class Application {
    static setEngine(name, crypto) {
        engineCrypto = Object.assign(crypto, { name });
        pkijs.setEngine(name, new pkijs.CryptoEngine({ name, crypto }));
    }
    static get crypto() {
        if (!engineCrypto) {
            throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC_NO_MODULE);
        }
        return engineCrypto;
    }
    static isNodePlugin() {
        return (typeof self === "undefined" && typeof window === "undefined");
    }
}
function init() {
    if (!Application.isNodePlugin()) {
        Application.setEngine("W3 WebCrypto module", self.crypto);
    }
}
init();

class XmlAlgorithm {
    getAlgorithmName() {
        return this.namespaceURI;
    }
}
class HashAlgorithm extends XmlAlgorithm {
    async Digest(xml) {
        let buf;
        if (typeof xml === "string") {
            buf = XmlCore.Convert.FromString(xml, "utf8");
        }
        else if (ArrayBuffer.isView(xml)) {
            buf = new Uint8Array(xml.buffer);
        }
        else if (xml instanceof ArrayBuffer) {
            buf = new Uint8Array(xml);
        }
        else {
            const txt = new XMLSerializer().serializeToString(xml);
            buf = XmlCore.Convert.FromString(txt, "utf8");
        }
        const hash = await Application.crypto.subtle.digest(this.algorithm, buf);
        return new Uint8Array(hash);
    }
}
class SignatureAlgorithm extends XmlAlgorithm {
    async Sign(signedInfo, signingKey, algorithm) {
        const info = XmlCore.Convert.FromString(signedInfo, "utf8");
        return Application.crypto.subtle.sign(algorithm, signingKey, info);
    }
    async Verify(signedInfo, key, signatureValue, algorithm) {
        const info = XmlCore.Convert.FromString(signedInfo, "utf8");
        return Application.crypto.subtle.verify((algorithm || this.algorithm), key, signatureValue, info);
    }
}

const SHA1 = "SHA-1";
const SHA256 = "SHA-256";
const SHA384 = "SHA-384";
const SHA512 = "SHA-512";
const SHA1_NAMESPACE = "http://www.w3.org/2000/09/xmldsig#sha1";
const SHA256_NAMESPACE = "http://www.w3.org/2001/04/xmlenc#sha256";
const SHA384_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#sha384";
const SHA512_NAMESPACE = "http://www.w3.org/2001/04/xmlenc#sha512";
class Sha1 extends HashAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = { name: SHA1 };
        this.namespaceURI = SHA1_NAMESPACE;
    }
}
class Sha256 extends HashAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = { name: SHA256 };
        this.namespaceURI = SHA256_NAMESPACE;
    }
}
class Sha384 extends HashAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = { name: SHA384 };
        this.namespaceURI = SHA384_NAMESPACE;
    }
}
class Sha512 extends HashAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = { name: SHA512 };
        this.namespaceURI = SHA512_NAMESPACE;
    }
}

const ECDSA = "ECDSA";
const ECDSA_SHA1_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha1";
const ECDSA_SHA256_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256";
const ECDSA_SHA384_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha384";
const ECDSA_SHA512_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512";
class EcdsaSha1 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: ECDSA,
            hash: {
                name: SHA1,
            },
        };
        this.namespaceURI = ECDSA_SHA1_NAMESPACE;
    }
}
class EcdsaSha256 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: ECDSA,
            hash: {
                name: SHA256,
            },
        };
        this.namespaceURI = ECDSA_SHA256_NAMESPACE;
    }
}
class EcdsaSha384 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: ECDSA,
            hash: {
                name: SHA384,
            },
        };
        this.namespaceURI = ECDSA_SHA384_NAMESPACE;
    }
}
class EcdsaSha512 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: ECDSA,
            hash: {
                name: SHA512,
            },
        };
        this.namespaceURI = ECDSA_SHA512_NAMESPACE;
    }
}

const HMAC = "HMAC";
const HMAC_SHA1_NAMESPACE = "http://www.w3.org/2000/09/xmldsig#hmac-sha1";
const HMAC_SHA256_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256";
const HMAC_SHA384_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha384";
const HMAC_SHA512_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha512";
class HmacSha1 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: HMAC,
            hash: {
                name: SHA1,
            },
        };
        this.namespaceURI = HMAC_SHA1_NAMESPACE;
    }
}
class HmacSha256 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: HMAC,
            hash: {
                name: SHA256,
            },
        };
        this.namespaceURI = HMAC_SHA256_NAMESPACE;
    }
}
class HmacSha384 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: HMAC,
            hash: {
                name: SHA384,
            },
        };
        this.namespaceURI = HMAC_SHA384_NAMESPACE;
    }
}
class HmacSha512 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: HMAC,
            hash: {
                name: SHA512,
            },
        };
        this.namespaceURI = HMAC_SHA512_NAMESPACE;
    }
}

const RSA_PKCS1 = "RSASSA-PKCS1-v1_5";
const RSA_PKCS1_SHA1_NAMESPACE = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
const RSA_PKCS1_SHA256_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
const RSA_PKCS1_SHA384_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha384";
const RSA_PKCS1_SHA512_NAMESPACE = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512";
class RsaPkcs1Sha1 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: RSA_PKCS1,
            hash: {
                name: SHA1,
            },
        };
        this.namespaceURI = RSA_PKCS1_SHA1_NAMESPACE;
    }
}
class RsaPkcs1Sha256 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: RSA_PKCS1,
            hash: {
                name: SHA256,
            },
        };
        this.namespaceURI = RSA_PKCS1_SHA256_NAMESPACE;
    }
}
class RsaPkcs1Sha384 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: RSA_PKCS1,
            hash: {
                name: SHA384,
            },
        };
        this.namespaceURI = RSA_PKCS1_SHA384_NAMESPACE;
    }
}
class RsaPkcs1Sha512 extends SignatureAlgorithm {
    constructor() {
        super(...arguments);
        this.algorithm = {
            name: RSA_PKCS1,
            hash: {
                name: SHA512,
            },
        };
        this.namespaceURI = RSA_PKCS1_SHA512_NAMESPACE;
    }
}

const RSA_PSS = "RSA-PSS";
const RSA_PSS_WITH_PARAMS_NAMESPACE = "http://www.w3.org/2007/05/xmldsig-more#rsa-pss";
class RsaPssBase extends SignatureAlgorithm {
    constructor(saltLength) {
        super();
        this.algorithm = {
            name: RSA_PSS,
            hash: {
                name: SHA1,
            },
        };
        this.namespaceURI = RSA_PSS_WITH_PARAMS_NAMESPACE;
        if (saltLength) {
            this.algorithm.saltLength = saltLength;
        }
    }
}
class RsaPssSha1 extends RsaPssBase {
    constructor(saltLength) {
        super(saltLength);
        this.algorithm.hash.name = SHA1;
    }
}
class RsaPssSha256 extends RsaPssBase {
    constructor(saltLength) {
        super(saltLength);
        this.algorithm.hash.name = SHA256;
    }
}
class RsaPssSha384 extends RsaPssBase {
    constructor(saltLength) {
        super(saltLength);
        this.algorithm.hash.name = SHA384;
    }
}
class RsaPssSha512 extends RsaPssBase {
    constructor(saltLength) {
        super(saltLength);
        this.algorithm.hash.name = SHA512;
    }
}

const RSA_PSS_SHA1_NAMESPACE = "http://www.w3.org/2007/05/xmldsig-more#sha1-rsa-MGF1";
const RSA_PSS_SHA256_NAMESPACE = "http://www.w3.org/2007/05/xmldsig-more#sha256-rsa-MGF1";
const RSA_PSS_SHA384_NAMESPACE = "http://www.w3.org/2007/05/xmldsig-more#sha384-rsa-MGF1";
const RSA_PSS_SHA512_NAMESPACE = "http://www.w3.org/2007/05/xmldsig-more#sha512-rsa-MGF1";
class RsaPssWithoutParamsBase extends SignatureAlgorithm {
    constructor() {
        super();
        this.algorithm = {
            name: RSA_PSS,
            hash: {
                name: SHA1,
            },
        };
        this.namespaceURI = RSA_PSS_SHA1_NAMESPACE;
    }
}
class RsaPssWithoutParamsSha1 extends RsaPssWithoutParamsBase {
    constructor() {
        super();
        this.algorithm.hash.name = SHA1;
        this.algorithm.saltLength = 20;
    }
}
class RsaPssWithoutParamsSha256 extends RsaPssWithoutParamsBase {
    constructor() {
        super();
        this.algorithm.hash.name = SHA256;
        this.algorithm.saltLength = 32;
    }
}
class RsaPssWithoutParamsSha384 extends RsaPssWithoutParamsBase {
    constructor() {
        super();
        this.algorithm.hash.name = SHA384;
        this.algorithm.saltLength = 48;
    }
}
class RsaPssWithoutParamsSha512 extends RsaPssWithoutParamsBase {
    constructor() {
        super();
        this.algorithm.hash.name = SHA512;
        this.algorithm.saltLength = 64;
    }
}

exports.XmlCanonicalizerState = void 0;
(function (XmlCanonicalizerState) {
    XmlCanonicalizerState[XmlCanonicalizerState["BeforeDocElement"] = 0] = "BeforeDocElement";
    XmlCanonicalizerState[XmlCanonicalizerState["InsideDocElement"] = 1] = "InsideDocElement";
    XmlCanonicalizerState[XmlCanonicalizerState["AfterDocElement"] = 2] = "AfterDocElement";
})(exports.XmlCanonicalizerState || (exports.XmlCanonicalizerState = {}));
class XmlCanonicalizer {
    constructor(withComments, excC14N, propagatedNamespaces = new XmlCore__namespace.NamespaceManager()) {
        this.propagatedNamespaces = new XmlCore__namespace.NamespaceManager();
        this.result = [];
        this.visibleNamespaces = new XmlCore__namespace.NamespaceManager();
        this.inclusiveNamespacesPrefixList = [];
        this.state = exports.XmlCanonicalizerState.BeforeDocElement;
        this.withComments = withComments;
        this.exclusive = excC14N;
        this.propagatedNamespaces = propagatedNamespaces;
    }
    get InclusiveNamespacesPrefixList() {
        return this.inclusiveNamespacesPrefixList.join(" ");
    }
    set InclusiveNamespacesPrefixList(value) {
        this.inclusiveNamespacesPrefixList = value.split(" ");
    }
    Canonicalize(node) {
        if (!node) {
            throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC, "Parameter 1 is not Node");
        }
        this.WriteNode(node);
        const res = this.result.join("");
        return res;
    }
    WriteNode(node) {
        switch (node.nodeType) {
            case XmlCore__namespace.XmlNodeType.Document:
            case XmlCore__namespace.XmlNodeType.DocumentFragment:
                this.WriteDocumentNode(node);
                break;
            case XmlCore__namespace.XmlNodeType.Element:
                this.WriteElementNode(node);
                break;
            case XmlCore__namespace.XmlNodeType.CDATA:
            case XmlCore__namespace.XmlNodeType.SignificantWhitespace:
            case XmlCore__namespace.XmlNodeType.Text:
                if (!XmlCore__namespace.isDocument(node.parentNode)) {
                    this.WriteTextNode(node);
                }
                break;
            case XmlCore__namespace.XmlNodeType.Whitespace:
                if (this.state === exports.XmlCanonicalizerState.InsideDocElement) {
                    this.WriteTextNode(node);
                }
                break;
            case XmlCore__namespace.XmlNodeType.Comment:
                this.WriteCommentNode(node);
                break;
            case XmlCore__namespace.XmlNodeType.ProcessingInstruction:
                this.WriteProcessingInstructionNode(node);
                break;
            case XmlCore__namespace.XmlNodeType.EntityReference:
                for (let i = 0; i < node.childNodes.length; i++) {
                    this.WriteNode(node.childNodes[i]);
                }
                break;
            case XmlCore__namespace.XmlNodeType.Attribute:
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC, "Attribute node is impossible here");
            case XmlCore__namespace.XmlNodeType.EndElement:
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC, "Attribute node is impossible here");
            case XmlCore__namespace.XmlNodeType.EndEntity:
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC, "Attribute node is impossible here");
            case XmlCore__namespace.XmlNodeType.DocumentType:
            case XmlCore__namespace.XmlNodeType.Entity:
            case XmlCore__namespace.XmlNodeType.Notation:
            case XmlCore__namespace.XmlNodeType.XmlDeclaration:
                break;
        }
    }
    WriteDocumentNode(node) {
        this.state = exports.XmlCanonicalizerState.BeforeDocElement;
        for (let child = node.firstChild; child != null; child = child.nextSibling) {
            this.WriteNode(child);
        }
    }
    WriteCommentNode(node) {
        if (this.withComments) {
            if (this.state === exports.XmlCanonicalizerState.AfterDocElement) {
                this.result.push(String.fromCharCode(10) + "<!--");
            }
            else {
                this.result.push("<!--");
            }
            this.result.push(this.NormalizeString(node.nodeValue, XmlCore__namespace.XmlNodeType.Comment));
            if (this.state === exports.XmlCanonicalizerState.BeforeDocElement) {
                this.result.push("-->" + String.fromCharCode(10));
            }
            else {
                this.result.push("-->");
            }
        }
    }
    WriteTextNode(node) {
        this.result.push(this.NormalizeString(node.nodeValue, node.nodeType));
    }
    WriteProcessingInstructionNode(node) {
        const nodeName = node.nodeName || node.tagName;
        if (nodeName === "xml") {
            return;
        }
        if (this.state === exports.XmlCanonicalizerState.AfterDocElement) {
            this.result.push("\u000A<?");
        }
        else {
            this.result.push("<?");
        }
        this.result.push(nodeName);
        if (node.nodeValue) {
            this.result.push(" ");
            this.result.push(this.NormalizeString(node.nodeValue, XmlCore__namespace.XmlNodeType.ProcessingInstruction));
        }
        if (this.state === exports.XmlCanonicalizerState.BeforeDocElement) {
            this.result.push("?>\u000A");
        }
        else {
            this.result.push("?>");
        }
    }
    WriteElementNode(node) {
        const state = this.state;
        if (this.state === exports.XmlCanonicalizerState.BeforeDocElement) {
            this.state = exports.XmlCanonicalizerState.InsideDocElement;
        }
        this.result.push("<");
        this.result.push(node.nodeName);
        let visibleNamespacesCount = this.WriteNamespacesAxis(node);
        this.WriteAttributesAxis(node);
        this.result.push(">");
        for (let n = node.firstChild; n != null; n = n.nextSibling) {
            this.WriteNode(n);
        }
        this.result.push("</");
        this.result.push(node.nodeName);
        this.result.push(">");
        if (state === exports.XmlCanonicalizerState.BeforeDocElement) {
            this.state = exports.XmlCanonicalizerState.AfterDocElement;
        }
        while (visibleNamespacesCount--) {
            this.visibleNamespaces.Pop();
        }
    }
    WriteNamespacesAxis(node) {
        const list = [];
        let visibleNamespacesCount = 0;
        for (let i = 0; i < node.attributes.length; i++) {
            const attribute = node.attributes[i];
            if (!IsNamespaceNode(attribute)) {
                if (attribute.prefix && !this.IsNamespaceRendered(attribute.prefix, attribute.namespaceURI)) {
                    const ns = { prefix: attribute.prefix, namespace: attribute.namespaceURI };
                    list.push(ns);
                    this.visibleNamespaces.Add(ns);
                    visibleNamespacesCount++;
                }
                continue;
            }
            if (attribute.localName === "xmlns" && !attribute.prefix && !attribute.nodeValue) {
                const ns = { prefix: attribute.prefix, namespace: attribute.nodeValue };
                list.push(ns);
                this.visibleNamespaces.Add(ns);
                visibleNamespacesCount++;
            }
            let prefix = null;
            let matches;
            if (matches = /xmlns:([\w\.-]+)/.exec(attribute.nodeName)) {
                prefix = matches[1];
            }
            let printable = true;
            if (this.exclusive && !this.IsNamespaceInclusive(node, prefix)) {
                const used = IsNamespaceUsed(node, prefix);
                if (used > 1) {
                    printable = false;
                }
                else if (used === 0) {
                    continue;
                }
            }
            if (this.IsNamespaceRendered(prefix, attribute.nodeValue)) {
                continue;
            }
            if (printable) {
                const ns = { prefix, namespace: attribute.nodeValue };
                list.push(ns);
                this.visibleNamespaces.Add(ns);
                visibleNamespacesCount++;
            }
        }
        if (!this.IsNamespaceRendered(node.prefix, node.namespaceURI) && node.namespaceURI !== "http://www.w3.org/2000/xmlns/") {
            const ns = { prefix: node.prefix, namespace: node.namespaceURI };
            list.push(ns);
            this.visibleNamespaces.Add(ns);
            visibleNamespacesCount++;
        }
        list.sort(XmlDsigC14NTransformNamespacesComparer);
        let prevPrefix = null;
        list.forEach((n) => {
            if (n.prefix === prevPrefix) {
                return;
            }
            prevPrefix = n.prefix;
            this.result.push(" xmlns");
            if (n.prefix) {
                this.result.push(":" + n.prefix);
            }
            this.result.push("=\"");
            this.result.push(n.namespace);
            this.result.push("\"");
        });
        return visibleNamespacesCount;
    }
    WriteAttributesAxis(node) {
        const list = [];
        for (let i = 0; i < node.attributes.length; i++) {
            const attribute = node.attributes[i];
            if (!IsNamespaceNode(attribute)) {
                list.push(attribute);
            }
        }
        list.sort(XmlDsigC14NTransformAttributesComparer);
        list.forEach((attribute) => {
            if (attribute != null) {
                this.result.push(" ");
                this.result.push(attribute.nodeName);
                this.result.push("=\"");
                this.result.push(this.NormalizeString(attribute.nodeValue, XmlCore__namespace.XmlNodeType.Attribute));
                this.result.push("\"");
            }
        });
    }
    NormalizeString(input, type) {
        const sb = [];
        if (input) {
            for (let i = 0; i < input.length; i++) {
                const ch = input[i];
                if (ch === "<" && (type === XmlCore__namespace.XmlNodeType.Attribute || this.IsTextNode(type))) {
                    sb.push("&lt;");
                }
                else if (ch === ">" && this.IsTextNode(type)) {
                    sb.push("&gt;");
                }
                else if (ch === "&" && (type === XmlCore__namespace.XmlNodeType.Attribute || this.IsTextNode(type))) {
                    sb.push("&amp;");
                }
                else if (ch === "\"" && type === XmlCore__namespace.XmlNodeType.Attribute) {
                    sb.push("&quot;");
                }
                else if (ch === "\u0009" && type === XmlCore__namespace.XmlNodeType.Attribute) {
                    sb.push("&#x9;");
                }
                else if (ch === "\u000A" && type === XmlCore__namespace.XmlNodeType.Attribute) {
                    sb.push("&#xA;");
                }
                else if (ch === "\u000D") {
                    sb.push("&#xD;");
                }
                else {
                    sb.push(ch);
                }
            }
        }
        return sb.join("");
    }
    IsTextNode(type) {
        switch (type) {
            case XmlCore__namespace.XmlNodeType.Text:
            case XmlCore__namespace.XmlNodeType.CDATA:
            case XmlCore__namespace.XmlNodeType.SignificantWhitespace:
            case XmlCore__namespace.XmlNodeType.Whitespace:
                return true;
        }
        return false;
    }
    IsNamespaceInclusive(node, prefix) {
        const prefix2 = prefix || null;
        if (node.prefix === prefix2) {
            return false;
        }
        return this.inclusiveNamespacesPrefixList.indexOf(prefix2 || "") !== -1;
    }
    IsNamespaceRendered(prefix, uri) {
        prefix = prefix || "";
        uri = uri || "";
        if (!prefix && !uri) {
            return true;
        }
        if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace") {
            return true;
        }
        const ns = this.visibleNamespaces.GetPrefix(prefix);
        if (ns) {
            return ns.namespace === uri;
        }
        return false;
    }
}
function XmlDsigC14NTransformNamespacesComparer(x, y) {
    if (x == y) {
        return 0;
    }
    else if (!x) {
        return -1;
    }
    else if (!y) {
        return 1;
    }
    else if (!x.prefix) {
        return -1;
    }
    else if (!y.prefix) {
        return 1;
    }
    else if (x.prefix < y.prefix) {
        return -1;
    }
    else if (x.prefix > y.prefix) {
        return 1;
    }
    else {
        return 0;
    }
}
function XmlDsigC14NTransformAttributesComparer(x, y) {
    if (!x.namespaceURI && y.namespaceURI) {
        return -1;
    }
    if (!y.namespaceURI && x.namespaceURI) {
        return 1;
    }
    const left = x.namespaceURI + x.localName;
    const right = y.namespaceURI + y.localName;
    if (left === right) {
        return 0;
    }
    else if (left < right) {
        return -1;
    }
    else {
        return 1;
    }
}
function IsNamespaceUsed(node, prefix, result = 0) {
    const prefix2 = prefix || null;
    if (node.prefix === prefix2) {
        return ++result;
    }
    if (node.attributes) {
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            if (!IsNamespaceNode(attr) && prefix && node.attributes[i].prefix === prefix) {
                return ++result;
            }
        }
    }
    for (let n = node.firstChild; !!n; n = n.nextSibling) {
        if (n.nodeType === XmlCore__namespace.XmlNodeType.Element) {
            const el = n;
            const res = IsNamespaceUsed(el, prefix, result);
            if (n.nodeType === XmlCore__namespace.XmlNodeType.Element && res) {
                return ++result + res;
            }
        }
    }
    return result;
}
function IsNamespaceNode(node) {
    const reg = /xmlns:/;
    if (node !== null && node.nodeType === XmlCore__namespace.XmlNodeType.Attribute && (node.nodeName === "xmlns" || reg.test(node.nodeName))) {
        return true;
    }
    return false;
}

const XmlSignature = {
    DefaultCanonMethod: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    DefaultDigestMethod: "http://www.w3.org/2001/04/xmlenc#sha256",
    DefaultPrefix: "ds",
    ElementNames: {
        CanonicalizationMethod: "CanonicalizationMethod",
        DigestMethod: "DigestMethod",
        DigestValue: "DigestValue",
        DSAKeyValue: "DSAKeyValue",
        DomainParameters: "DomainParameters",
        EncryptedKey: "EncryptedKey",
        HMACOutputLength: "HMACOutputLength",
        RSAPSSParams: "RSAPSSParams",
        MaskGenerationFunction: "MaskGenerationFunction",
        SaltLength: "SaltLength",
        KeyInfo: "KeyInfo",
        KeyName: "KeyName",
        KeyValue: "KeyValue",
        Modulus: "Modulus",
        Exponent: "Exponent",
        Manifest: "Manifest",
        Object: "Object",
        Reference: "Reference",
        RetrievalMethod: "RetrievalMethod",
        RSAKeyValue: "RSAKeyValue",
        ECDSAKeyValue: "ECDSAKeyValue",
        NamedCurve: "NamedCurve",
        PublicKey: "PublicKey",
        Signature: "Signature",
        SignatureMethod: "SignatureMethod",
        SignatureValue: "SignatureValue",
        SignedInfo: "SignedInfo",
        Transform: "Transform",
        Transforms: "Transforms",
        X509Data: "X509Data",
        PGPData: "PGPData",
        SPKIData: "SPKIData",
        SPKIexp: "SPKIexp",
        MgmtData: "MgmtData",
        X509IssuerSerial: "X509IssuerSerial",
        X509IssuerName: "X509IssuerName",
        X509SerialNumber: "X509SerialNumber",
        X509SKI: "X509SKI",
        X509SubjectName: "X509SubjectName",
        X509Certificate: "X509Certificate",
        X509CRL: "X509CRL",
        XPath: "XPath",
        X: "X",
        Y: "Y",
    },
    AttributeNames: {
        Algorithm: "Algorithm",
        Encoding: "Encoding",
        Id: "Id",
        MimeType: "MimeType",
        Type: "Type",
        URI: "URI",
    },
    AlgorithmNamespaces: {
        XmlDsigBase64Transform: "http://www.w3.org/2000/09/xmldsig#base64",
        XmlDsigC14NTransform: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
        XmlDsigC14NWithCommentsTransform: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments",
        XmlDsigEnvelopedSignatureTransform: "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        XmlDsigXPathTransform: "http://www.w3.org/TR/1999/REC-xpath-19991116",
        XmlDsigXsltTransform: "http://www.w3.org/TR/1999/REC-xslt-19991116",
        XmlDsigExcC14NTransform: "http://www.w3.org/2001/10/xml-exc-c14n#",
        XmlDsigExcC14NWithCommentsTransform: "http://www.w3.org/2001/10/xml-exc-c14n#WithComments",
        XmlDecryptionTransform: "http://www.w3.org/2002/07/decrypt#XML",
        XmlLicenseTransform: "urn:mpeg:mpeg21:2003:01-REL-R-NS:licenseTransform",
    },
    Uri: {
        Manifest: "http://www.w3.org/2000/09/xmldsig#Manifest",
    },
    NamespaceURI: "http://www.w3.org/2000/09/xmldsig#",
    NamespaceURIMore: "http://www.w3.org/2007/05/xmldsig-more#",
    NamespaceURIPss: "http://www.example.org/xmldsig-pss/#",
};

exports.XmlSignatureObject = class XmlSignatureObject extends XmlCore.XmlObject {
};
exports.XmlSignatureObject = tslib.__decorate([
    XmlCore.XmlElement({
        localName: "xmldsig",
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
    })
], exports.XmlSignatureObject);
exports.XmlSignatureCollection = class XmlSignatureCollection extends XmlCore.XmlCollection {
};
exports.XmlSignatureCollection = tslib.__decorate([
    XmlCore.XmlElement({
        localName: "xmldsig_collection",
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
    })
], exports.XmlSignatureCollection);

class KeyInfoClause extends exports.XmlSignatureObject {
}

exports.CanonicalizationMethod = class CanonicalizationMethod extends exports.XmlSignatureObject {
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Algorithm,
        required: true,
        defaultValue: XmlSignature.DefaultCanonMethod,
    })
], exports.CanonicalizationMethod.prototype, "Algorithm", void 0);
exports.CanonicalizationMethod = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.CanonicalizationMethod,
    })
], exports.CanonicalizationMethod);

exports.DataObject = class DataObject extends exports.XmlSignatureObject {
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Id,
        defaultValue: "",
    })
], exports.DataObject.prototype, "Id", void 0);
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.MimeType,
        defaultValue: "",
    })
], exports.DataObject.prototype, "MimeType", void 0);
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Encoding,
        defaultValue: "",
    })
], exports.DataObject.prototype, "Encoding", void 0);
exports.DataObject = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.Object,
    })
], exports.DataObject);
exports.DataObjects = class DataObjects extends exports.XmlSignatureCollection {
};
exports.DataObjects = tslib.__decorate([
    XmlCore.XmlElement({
        localName: "xmldsig_objects",
        parser: exports.DataObject,
    })
], exports.DataObjects);

exports.DigestMethod = class DigestMethod extends exports.XmlSignatureObject {
    constructor(hashNamespace) {
        super();
        if (hashNamespace) {
            this.Algorithm = hashNamespace;
        }
    }
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Algorithm,
        required: true,
        defaultValue: XmlSignature.DefaultDigestMethod,
    })
], exports.DigestMethod.prototype, "Algorithm", void 0);
exports.DigestMethod = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.DigestMethod,
    })
], exports.DigestMethod);

exports.KeyInfo = class KeyInfo extends exports.XmlSignatureCollection {
    OnLoadXml(element) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes.item(i);
            if (node.nodeType !== XmlCore.XmlNodeType.Element) {
                continue;
            }
            let KeyInfoClass = null;
            switch (node.localName) {
                case XmlSignature.ElementNames.KeyValue:
                    KeyInfoClass = exports.KeyValue;
                    break;
                case XmlSignature.ElementNames.X509Data:
                    KeyInfoClass = exports.KeyInfoX509Data;
                    break;
                case XmlSignature.ElementNames.SPKIData:
                    KeyInfoClass = exports.SPKIData;
                    break;
                case XmlSignature.ElementNames.KeyName:
                case XmlSignature.ElementNames.RetrievalMethod:
                case XmlSignature.ElementNames.PGPData:
                case XmlSignature.ElementNames.MgmtData:
            }
            if (KeyInfoClass) {
                const item = new KeyInfoClass();
                item.LoadXml(node);
                this.Add(item);
            }
        }
    }
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Id,
        defaultValue: "",
    })
], exports.KeyInfo.prototype, "Id", void 0);
exports.KeyInfo = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.KeyInfo,
    })
], exports.KeyInfo);

exports.Transform = class Transform extends exports.XmlSignatureObject {
    constructor() {
        super(...arguments);
        this.innerXml = null;
    }
    GetOutput() {
        throw new XmlCore.XmlError(XmlCore.XE.METHOD_NOT_IMPLEMENTED);
    }
    LoadInnerXml(node) {
        if (!node) {
            throw new XmlCore.XmlError(XmlCore.XE.PARAM_REQUIRED, "node");
        }
        this.innerXml = node;
    }
    GetInnerXml() {
        return this.innerXml;
    }
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Algorithm,
        defaultValue: "",
    })
], exports.Transform.prototype, "Algorithm", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.XPath,
        defaultValue: "",
    })
], exports.Transform.prototype, "XPath", void 0);
exports.Transform = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.Transform,
    })
], exports.Transform);

class XmlDsigBase64Transform extends exports.Transform {
    constructor() {
        super(...arguments);
        this.Algorithm = XmlSignature.AlgorithmNamespaces.XmlDsigBase64Transform;
    }
    GetOutput() {
        if (!this.innerXml) {
            throw new XmlCore.XmlError(XmlCore.XE.PARAM_REQUIRED, "innerXml");
        }
        return XmlCore.Convert.FromString(this.innerXml.textContent || "", "base64");
    }
}

class XmlDsigC14NTransform extends exports.Transform {
    constructor() {
        super(...arguments);
        this.Algorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
        this.xmlCanonicalizer = new XmlCanonicalizer(false, false);
    }
    GetOutput() {
        if (!this.innerXml) {
            throw new XmlCore.XmlError(XmlCore.XE.PARAM_REQUIRED, "innerXml");
        }
        return this.xmlCanonicalizer.Canonicalize(this.innerXml);
    }
}
class XmlDsigC14NWithCommentsTransform extends XmlDsigC14NTransform {
    constructor() {
        super(...arguments);
        this.Algorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments";
        this.xmlCanonicalizer = new XmlCanonicalizer(true, false);
    }
}

class XmlDsigEnvelopedSignatureTransform extends exports.Transform {
    constructor() {
        super(...arguments);
        this.Algorithm = "http://www.w3.org/2000/09/xmldsig#enveloped-signature";
    }
    GetOutput() {
        var _a;
        if (!this.innerXml) {
            throw new XmlCore.XmlError(XmlCore.XE.PARAM_REQUIRED, "innerXml");
        }
        let child = this.innerXml.firstChild;
        const signatures = [];
        while (child) {
            if (XmlCore.isElement(child)
                && child.localName === XmlSignature.ElementNames.Signature
                && child.namespaceURI === XmlSignature.NamespaceURI) {
                signatures.push(child);
            }
            child = child.nextSibling;
        }
        for (const signature of signatures) {
            (_a = signature.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(signature);
        }
        return this.innerXml;
    }
}

class XmlDsigExcC14NTransform extends exports.Transform {
    constructor() {
        super(...arguments);
        this.Algorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";
        this.xmlCanonicalizer = new XmlCanonicalizer(false, true);
    }
    get InclusiveNamespacesPrefixList() {
        return this.xmlCanonicalizer.InclusiveNamespacesPrefixList;
    }
    set InclusiveNamespacesPrefixList(value) {
        this.xmlCanonicalizer.InclusiveNamespacesPrefixList = value;
    }
    LoadXml(param) {
        super.LoadXml(param);
        if (this.Element && this.Element.childNodes) {
            for (let i = 0; i < this.Element.childNodes.length; i++) {
                const element = this.Element.childNodes[i];
                if (element && element.nodeType === 1) {
                    switch (element.localName) {
                        case 'InclusiveNamespaces':
                            this.setInclusiveNamespacesElement(element);
                            break;
                    }
                }
            }
        }
    }
    GetOutput() {
        if (!this.innerXml) {
            throw new XmlCore.XmlError(XmlCore.XE.PARAM_REQUIRED, "innerXml");
        }
        return this.xmlCanonicalizer.Canonicalize(this.innerXml);
    }
    setInclusiveNamespacesElement(element) {
        const prefixList = element.getAttribute('PrefixList');
        if (prefixList && prefixList.length > 0) {
            this.xmlCanonicalizer.InclusiveNamespacesPrefixList = prefixList;
        }
    }
}
class XmlDsigExcC14NWithCommentsTransform extends XmlDsigExcC14NTransform {
    constructor() {
        super(...arguments);
        this.Algorithm = "http://www.w3.org/2001/10/xml-exc-c14n#WithComments";
        this.xmlCanonicalizer = new XmlCanonicalizer(true, true);
    }
}

function lookupParentNode(node) {
    return node.parentNode
        ? lookupParentNode(node.parentNode)
        : node;
}
class XmlDsigXPathTransform extends exports.Transform {
    constructor() {
        super(...arguments);
        this.Algorithm = XmlSignature.AlgorithmNamespaces.XmlDsigXPathTransform;
    }
    GetOutput() {
        if (!this.innerXml) {
            throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.PARAM_REQUIRED, "innerXml");
        }
        this.Filter(lookupParentNode(this.innerXml), this.XPath);
    }
    Filter(node, xpath) {
        const childNodes = node.childNodes;
        const nodes = [];
        for (let i = 0; childNodes && i < childNodes.length; i++) {
            const child = childNodes.item(i);
            nodes.push(child);
        }
        nodes.forEach((child) => {
            if (this.Evaluate(child, xpath)) {
                if (child.parentNode) {
                    child.parentNode.removeChild(child);
                }
            }
            else {
                this.Filter(child, xpath);
            }
        });
    }
    GetEvaluator(node) {
        if (typeof (self) !== "undefined") {
            return (node.ownerDocument == null ? node : node.ownerDocument);
        }
        else {
            return require("xpath");
        }
    }
    Evaluate(node, xpath) {
        try {
            const evaluator = this.GetEvaluator(node);
            const xpathEl = this.GetXml().firstChild;
            const xPath = `boolean(${xpath})`;
            const xpathResult = evaluator.evaluate(xPath, node, {
                lookupNamespaceURI: (prefix) => {
                    return xpathEl.lookupNamespaceURI(prefix);
                },
            }, (typeof (self) === "undefined" ? require("xpath") : self).XPathResult.ANY_TYPE, null);
            return !xpathResult.booleanValue;
        }
        catch (e) {
            return false;
        }
    }
}
tslib.__decorate([
    XmlCore__namespace.XmlChildElement({
        localName: XmlSignature.ElementNames.XPath,
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
        required: true,
    })
], XmlDsigXPathTransform.prototype, "XPath", void 0);

exports.Transforms = class Transforms extends exports.XmlSignatureCollection {
    OnLoadXml(element) {
        super.OnLoadXml(element);
        this.items = this.GetIterator().map((item) => {
            switch (item.Algorithm) {
                case XmlSignature.AlgorithmNamespaces.XmlDsigEnvelopedSignatureTransform:
                    return ChangeTransform(item, XmlDsigEnvelopedSignatureTransform);
                case XmlSignature.AlgorithmNamespaces.XmlDsigC14NTransform:
                    return ChangeTransform(item, XmlDsigC14NTransform);
                case XmlSignature.AlgorithmNamespaces.XmlDsigC14NWithCommentsTransform:
                    return ChangeTransform(item, XmlDsigC14NWithCommentsTransform);
                case XmlSignature.AlgorithmNamespaces.XmlDsigExcC14NTransform:
                    return ChangeTransform(item, XmlDsigExcC14NTransform);
                case XmlSignature.AlgorithmNamespaces.XmlDsigExcC14NWithCommentsTransform:
                    return ChangeTransform(item, XmlDsigExcC14NWithCommentsTransform);
                case XmlSignature.AlgorithmNamespaces.XmlDsigBase64Transform:
                    return ChangeTransform(item, XmlDsigBase64Transform);
                case XmlSignature.AlgorithmNamespaces.XmlDsigXPathTransform:
                    return ChangeTransform(item, XmlDsigXPathTransform);
                default:
                    throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC_UNKNOWN_TRANSFORM, item.Algorithm);
            }
        });
    }
};
exports.Transforms = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.Transforms,
        parser: exports.Transform,
    })
], exports.Transforms);
function ChangeTransform(t1, t2) {
    const t = new t2();
    t.LoadXml(t1.Element);
    return t;
}

exports.Reference = class Reference extends exports.XmlSignatureObject {
    constructor(uri) {
        super();
        this.DigestMethod = new exports.DigestMethod();
        if (uri) {
            this.Uri = uri;
        }
    }
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        defaultValue: "",
    })
], exports.Reference.prototype, "Id", void 0);
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.URI,
    })
], exports.Reference.prototype, "Uri", void 0);
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Type,
        defaultValue: "",
    })
], exports.Reference.prototype, "Type", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.Transforms,
    })
], exports.Reference.prototype, "Transforms", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        required: true,
        parser: exports.DigestMethod,
    })
], exports.Reference.prototype, "DigestMethod", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        required: true,
        localName: XmlSignature.ElementNames.DigestValue,
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
        converter: XmlCore.XmlBase64Converter,
    })
], exports.Reference.prototype, "DigestValue", void 0);
exports.Reference = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.Reference,
    })
], exports.Reference);
exports.References = class References extends exports.XmlSignatureCollection {
};
exports.References = tslib.__decorate([
    XmlCore.XmlElement({
        localName: "References",
        parser: exports.Reference,
    })
], exports.References);

exports.SignatureMethodOther = class SignatureMethodOther extends exports.XmlSignatureCollection {
    OnLoadXml(element) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes.item(i);
            if (node.nodeType !== XmlCore__namespace.XmlNodeType.Element ||
                node.nodeName === XmlSignature.ElementNames.HMACOutputLength) {
                continue;
            }
            let ParserClass;
            switch (node.localName) {
                case XmlSignature.ElementNames.RSAPSSParams:
                    ParserClass = exports.PssAlgorithmParams;
                    break;
            }
            if (ParserClass) {
                const xml = new ParserClass();
                xml.LoadXml(node);
                this.Add(xml);
            }
        }
    }
};
exports.SignatureMethodOther = tslib.__decorate([
    XmlCore.XmlElement({
        localName: "Other",
    })
], exports.SignatureMethodOther);
exports.SignatureMethod = class SignatureMethod extends exports.XmlSignatureObject {
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Algorithm,
        required: true,
        defaultValue: "",
    })
], exports.SignatureMethod.prototype, "Algorithm", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.HMACOutputLength,
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
        converter: XmlCore.XmlNumberConverter,
    })
], exports.SignatureMethod.prototype, "HMACOutputLength", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.SignatureMethodOther,
        noRoot: true,
        minOccurs: 0,
    })
], exports.SignatureMethod.prototype, "Any", void 0);
exports.SignatureMethod = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.SignatureMethod,
    })
], exports.SignatureMethod);

exports.SignedInfo = class SignedInfo extends exports.XmlSignatureObject {
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Id,
        defaultValue: "",
    })
], exports.SignedInfo.prototype, "Id", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.CanonicalizationMethod,
        required: true,
    })
], exports.SignedInfo.prototype, "CanonicalizationMethod", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.SignatureMethod,
        required: true,
    })
], exports.SignedInfo.prototype, "SignatureMethod", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.References,
        minOccurs: 1,
        noRoot: true,
    })
], exports.SignedInfo.prototype, "References", void 0);
exports.SignedInfo = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.SignedInfo,
    })
], exports.SignedInfo);

exports.Signature = class Signature extends exports.XmlSignatureObject {
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Id,
        defaultValue: "",
    })
], exports.Signature.prototype, "Id", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.SignedInfo,
        required: true,
    })
], exports.Signature.prototype, "SignedInfo", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.SignatureValue,
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
        required: true,
        converter: XmlCore.XmlBase64Converter,
        defaultValue: null,
    })
], exports.Signature.prototype, "SignatureValue", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.KeyInfo,
    })
], exports.Signature.prototype, "KeyInfo", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.DataObjects,
        noRoot: true,
    })
], exports.Signature.prototype, "ObjectList", void 0);
exports.Signature = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.Signature,
    })
], exports.Signature);

const NAMESPACE_URI$1 = "http://www.w3.org/2001/04/xmldsig-more#";
const PREFIX$1 = "ecdsa";
exports.EcdsaPublicKey = class EcdsaPublicKey extends XmlCore.XmlObject {
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.X,
        namespaceURI: NAMESPACE_URI$1,
        prefix: PREFIX$1,
        required: true,
        converter: XmlCore.XmlBase64Converter,
    })
], exports.EcdsaPublicKey.prototype, "X", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.Y,
        namespaceURI: NAMESPACE_URI$1,
        prefix: PREFIX$1,
        required: true,
        converter: XmlCore.XmlBase64Converter,
    })
], exports.EcdsaPublicKey.prototype, "Y", void 0);
exports.EcdsaPublicKey = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.PublicKey,
        namespaceURI: NAMESPACE_URI$1,
        prefix: PREFIX$1,
    })
], exports.EcdsaPublicKey);
exports.NamedCurve = class NamedCurve extends XmlCore.XmlObject {
};
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.URI,
        required: true,
    })
], exports.NamedCurve.prototype, "Uri", void 0);
exports.NamedCurve = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.NamedCurve,
        namespaceURI: NAMESPACE_URI$1,
        prefix: PREFIX$1,
    })
], exports.NamedCurve);
exports.DomainParameters = class DomainParameters extends XmlCore.XmlObject {
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.NamedCurve,
    })
], exports.DomainParameters.prototype, "NamedCurve", void 0);
exports.DomainParameters = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.DomainParameters,
        namespaceURI: NAMESPACE_URI$1,
        prefix: PREFIX$1,
    })
], exports.DomainParameters);
exports.EcdsaKeyValue = class EcdsaKeyValue extends KeyInfoClause {
    constructor() {
        super(...arguments);
        this.name = XmlSignature.ElementNames.ECDSAKeyValue;
        this.key = null;
        this.jwk = null;
        this.keyUsage = null;
    }
    get NamedCurve() {
        return GetNamedCurveOid(this.DomainParameters.NamedCurve.Uri);
    }
    async importKey(key) {
        if (key.algorithm.name.toUpperCase() !== "ECDSA") {
            throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_WRONG_NAME, key.algorithm.name);
        }
        const jwk = await Application.crypto.subtle.exportKey("jwk", key);
        this.key = key;
        this.jwk = jwk;
        this.PublicKey = new exports.EcdsaPublicKey();
        this.PublicKey.X = XmlCore.Convert.FromString(jwk.x, "base64url");
        this.PublicKey.Y = XmlCore.Convert.FromString(jwk.y, "base64url");
        if (!this.DomainParameters) {
            this.DomainParameters = new exports.DomainParameters();
        }
        if (!this.DomainParameters.NamedCurve) {
            this.DomainParameters.NamedCurve = new exports.NamedCurve();
        }
        this.DomainParameters.NamedCurve.Uri = GetNamedCurveOid(jwk.crv);
        this.keyUsage = key.usages;
        return this;
    }
    async exportKey(alg) {
        if (this.key) {
            return this.key;
        }
        const x = XmlCore.Convert.ToBase64Url(this.PublicKey.X);
        const y = XmlCore.Convert.ToBase64Url(this.PublicKey.Y);
        const crv = GetNamedCurveFromOid(this.DomainParameters.NamedCurve.Uri);
        const jwk = {
            kty: "EC",
            crv: crv,
            x,
            y,
            ext: true,
        };
        this.keyUsage = ["verify"];
        const key = await Application.crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: crv }, true, this.keyUsage);
        this.key = key;
        return this.key;
    }
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.DomainParameters,
    })
], exports.EcdsaKeyValue.prototype, "DomainParameters", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.EcdsaPublicKey,
        required: true,
    })
], exports.EcdsaKeyValue.prototype, "PublicKey", void 0);
exports.EcdsaKeyValue = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.ECDSAKeyValue,
        namespaceURI: NAMESPACE_URI$1,
        prefix: PREFIX$1,
    })
], exports.EcdsaKeyValue);
function GetNamedCurveOid(namedCurve) {
    switch (namedCurve) {
        case "P-256":
            return "urn:oid:1.2.840.10045.3.1.7";
        case "P-384":
            return "urn:oid:1.3.132.0.34";
        case "P-521":
            return "urn:oid:1.3.132.0.35";
    }
    throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC, "Unknown NamedCurve");
}
function GetNamedCurveFromOid(oid) {
    switch (oid) {
        case "urn:oid:1.2.840.10045.3.1.7":
            return "P-256";
        case "urn:oid:1.3.132.0.34":
            return "P-384";
        case "urn:oid:1.3.132.0.35":
            return "P-521";
    }
    throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC, "Unknown NamedCurve OID");
}

var PssAlgorithmParams_1;
const DEFAULT_ALGORITHM = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
        name: "SHA-256"
    }
};
exports.RsaKeyValue = class RsaKeyValue extends KeyInfoClause {
    constructor() {
        super(...arguments);
        this.key = null;
        this.jwk = null;
        this.keyUsage = [];
    }
    async importKey(key) {
        const algName = key.algorithm.name.toUpperCase();
        if (algName !== RSA_PKCS1.toUpperCase() && algName !== RSA_PSS.toUpperCase()) {
            throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_WRONG_NAME, key.algorithm.name);
        }
        this.key = key;
        const jwk = await Application.crypto.subtle.exportKey("jwk", key);
        this.jwk = jwk;
        this.Modulus = XmlCore.Convert.FromBase64Url(jwk.n);
        this.Exponent = XmlCore.Convert.FromBase64Url(jwk.e);
        this.keyUsage = key.usages;
        return this;
    }
    async exportKey(alg = DEFAULT_ALGORITHM) {
        if (this.key) {
            return this.key;
        }
        if (!this.Modulus) {
            throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC, "RsaKeyValue has no Modulus");
        }
        const modulus = XmlCore.Convert.ToBase64Url(this.Modulus);
        if (!this.Exponent) {
            throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC, "RsaKeyValue has no Exponent");
        }
        const exponent = XmlCore.Convert.ToBase64Url(this.Exponent);
        let algJwk;
        switch (alg.name.toUpperCase()) {
            case RSA_PKCS1.toUpperCase():
                algJwk = "R";
                break;
            case RSA_PSS.toUpperCase():
                algJwk = "P";
                break;
            default:
                throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_NOT_SUPPORTED, alg.name);
        }
        switch (alg.hash.name.toUpperCase()) {
            case SHA1:
                algJwk += "S1";
                break;
            case SHA256:
                algJwk += "S256";
                break;
            case SHA384:
                algJwk += "S384";
                break;
            case SHA512:
                algJwk += "S512";
                break;
        }
        const jwk = {
            kty: "RSA",
            alg: algJwk,
            n: modulus,
            e: exponent,
            ext: true,
        };
        return Application.crypto.subtle.importKey("jwk", jwk, alg, true, this.keyUsage);
    }
    LoadXml(node) {
        super.LoadXml(node);
        this.keyUsage = ["verify"];
    }
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.Modulus,
        prefix: XmlSignature.DefaultPrefix,
        namespaceURI: XmlSignature.NamespaceURI,
        required: true,
        converter: XmlCore.XmlBase64Converter,
    })
], exports.RsaKeyValue.prototype, "Modulus", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.Exponent,
        prefix: XmlSignature.DefaultPrefix,
        namespaceURI: XmlSignature.NamespaceURI,
        required: true,
        converter: XmlCore.XmlBase64Converter,
    })
], exports.RsaKeyValue.prototype, "Exponent", void 0);
exports.RsaKeyValue = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.RSAKeyValue,
    })
], exports.RsaKeyValue);
const NAMESPACE_URI = "http://www.w3.org/2007/05/xmldsig-more#";
const PREFIX = "pss";
exports.MaskGenerationFunction = class MaskGenerationFunction extends XmlCore.XmlObject {
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.DigestMethod,
    })
], exports.MaskGenerationFunction.prototype, "DigestMethod", void 0);
tslib.__decorate([
    XmlCore.XmlAttribute({
        localName: XmlSignature.AttributeNames.Algorithm,
        defaultValue: "http://www.w3.org/2007/05/xmldsig-more#MGF1",
    })
], exports.MaskGenerationFunction.prototype, "Algorithm", void 0);
exports.MaskGenerationFunction = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.MaskGenerationFunction,
        prefix: PREFIX,
        namespaceURI: NAMESPACE_URI,
    })
], exports.MaskGenerationFunction);
exports.PssAlgorithmParams = PssAlgorithmParams_1 = class PssAlgorithmParams extends XmlCore.XmlObject {
    static FromAlgorithm(algorithm) {
        return new PssAlgorithmParams_1(algorithm);
    }
    constructor(algorithm) {
        super();
        if (algorithm) {
            this.FromAlgorithm(algorithm);
        }
    }
    FromAlgorithm(algorithm) {
        this.DigestMethod = new exports.DigestMethod();
        const digest = CryptoConfig.GetHashAlgorithm(algorithm.hash);
        this.DigestMethod.Algorithm = digest.namespaceURI;
        if (algorithm.saltLength) {
            this.SaltLength = algorithm.saltLength;
        }
    }
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.DigestMethod,
    })
], exports.PssAlgorithmParams.prototype, "DigestMethod", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        parser: exports.MaskGenerationFunction,
    })
], exports.PssAlgorithmParams.prototype, "MGF", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        converter: XmlCore.XmlNumberConverter,
        prefix: PREFIX,
        namespaceURI: NAMESPACE_URI,
    })
], exports.PssAlgorithmParams.prototype, "SaltLength", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        converter: XmlCore.XmlNumberConverter,
    })
], exports.PssAlgorithmParams.prototype, "TrailerField", void 0);
exports.PssAlgorithmParams = PssAlgorithmParams_1 = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.RSAPSSParams,
        prefix: PREFIX,
        namespaceURI: NAMESPACE_URI,
    })
], exports.PssAlgorithmParams);

exports.KeyValue = class KeyValue extends KeyInfoClause {
    set Value(v) {
        this.element = null;
        this.value = v;
    }
    get Value() {
        return this.value;
    }
    constructor(value) {
        super();
        if (value) {
            this.Value = value;
        }
    }
    async importKey(key) {
        switch (key.algorithm.name.toUpperCase()) {
            case RSA_PSS.toUpperCase():
            case RSA_PKCS1.toUpperCase():
                this.Value = new exports.RsaKeyValue();
                await this.Value.importKey(key);
                break;
            case ECDSA.toUpperCase():
                this.Value = new exports.EcdsaKeyValue();
                await this.Value.importKey(key);
                break;
            default:
                throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_NOT_SUPPORTED, key.algorithm.name);
        }
        return this;
    }
    async exportKey(alg) {
        if (!this.Value) {
            throw new XmlCore.XmlError(XmlCore.XE.NULL_REFERENCE);
        }
        return this.Value.exportKey(alg);
    }
    OnGetXml(element) {
        if (!this.Value) {
            throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC, "KeyValue has empty value");
        }
        const node = this.Value.GetXml();
        if (node) {
            element.appendChild(node);
        }
    }
    OnLoadXml(element) {
        const keyValueTypes = [exports.RsaKeyValue, exports.EcdsaKeyValue];
        for (const keyValueType of keyValueTypes) {
            try {
                const keyValue = new keyValueType();
                for (let i = 0; i < element.childNodes.length; i++) {
                    const nodeKey = element.childNodes.item(i);
                    if (!XmlCore__namespace.isElement(nodeKey)) {
                        continue;
                    }
                    keyValue.LoadXml(nodeKey);
                    this.value = keyValue;
                    return;
                }
            }
            catch (e) { }
        }
        throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC, "Unsupported KeyValue in use");
    }
};
exports.KeyValue = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.KeyValue,
    })
], exports.KeyValue);

const OID = {
    "2.5.4.3": {
        short: "CN",
        long: "CommonName",
    },
    "2.5.4.6": {
        short: "C",
        long: "Country",
    },
    "2.5.4.5": {
        long: "DeviceSerialNumber",
    },
    "0.9.2342.19200300.100.1.25": {
        short: "DC",
        long: "DomainComponent",
    },
    "1.2.840.113549.1.9.1": {
        short: "E",
        long: "EMail",
    },
    "2.5.4.42": {
        short: "G",
        long: "GivenName",
    },
    "2.5.4.43": {
        short: "I",
        long: "Initials",
    },
    "2.5.4.7": {
        short: "L",
        long: "Locality",
    },
    "2.5.4.10": {
        short: "O",
        long: "Organization",
    },
    "2.5.4.11": {
        short: "OU",
        long: "OrganizationUnit",
    },
    "2.5.4.8": {
        short: "ST",
        long: "State",
    },
    "2.5.4.9": {
        short: "Street",
        long: "StreetAddress",
    },
    "2.5.4.4": {
        short: "SN",
        long: "SurName",
    },
    "2.5.4.12": {
        short: "T",
        long: "Title",
    },
    "1.2.840.113549.1.9.8": {
        long: "UnstructuredAddress",
    },
    "1.2.840.113549.1.9.2": {
        long: "UnstructuredName",
    },
};
class X509Certificate {
    constructor(rawData) {
        this.publicKey = null;
        if (rawData) {
            const buf = new Uint8Array(rawData);
            this.LoadRaw(buf);
            this.raw = buf;
        }
    }
    get SerialNumber() {
        return this.simpl.serialNumber.valueBlock.toString();
    }
    get Issuer() {
        return this.NameToString(this.simpl.issuer);
    }
    get Subject() {
        return this.NameToString(this.simpl.subject);
    }
    async Thumbprint(algName = "SHA-1") {
        return Application.crypto.subtle.digest(algName, this.raw);
    }
    get PublicKey() {
        return this.publicKey;
    }
    GetRaw() {
        return this.raw;
    }
    async exportKey(algorithm) {
        if (algorithm) {
            const alg = {
                algorithm,
                usages: ["verify"],
            };
            if (alg.algorithm.name.toUpperCase() === ECDSA) {
                const json = this.simpl.subjectPublicKeyInfo.toJSON();
                if ("crv" in json && json.crv) {
                    alg.algorithm.namedCurve = json.crv;
                }
                else {
                    throw new Error("Cannot get Curved name from the ECDSA public key");
                }
            }
            if (this.isHashedAlgorithm(alg.algorithm)) {
                if (typeof alg.algorithm.hash === "string") {
                    alg.algorithm.hash = { name: alg.algorithm.hash };
                }
            }
            const key = await this.simpl.getPublicKey({ algorithm: alg });
            this.publicKey = key;
            return key;
        }
        if (this.simpl.subjectPublicKeyInfo.algorithm.algorithmId === "1.2.840.113549.1.1.1") {
            this.publicKey = await this.simpl.getPublicKey({ algorithm: { algorithm: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } }, usages: ["verify"] } });
        }
        else {
            this.publicKey = await this.simpl.getPublicKey();
        }
        return this.publicKey;
    }
    NameToString(name, splitter = ",") {
        const res = [];
        name.typesAndValues.forEach((typeAndValue) => {
            const type = typeAndValue.type;
            const oid = OID[type.toString()];
            const name2 = oid ? oid.short : null;
            res.push(`${name2 ? name2 : type}=${typeAndValue.value.valueBlock.value}`);
        });
        return res.join(splitter + " ");
    }
    LoadRaw(rawData) {
        this.raw = new Uint8Array(rawData);
        const asn1 = Asn1Js__namespace.fromBER(this.raw.buffer);
        this.simpl = new pkijs.Certificate({ schema: asn1.result });
    }
    isHashedAlgorithm(alg) {
        return !!(alg)["hash"];
    }
}

exports.X509IssuerSerial = class X509IssuerSerial extends exports.XmlSignatureObject {
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.X509IssuerName,
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
        required: true,
    })
], exports.X509IssuerSerial.prototype, "X509IssuerName", void 0);
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.X509SerialNumber,
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
        required: true,
    })
], exports.X509IssuerSerial.prototype, "X509SerialNumber", void 0);
exports.X509IssuerSerial = tslib.__decorate([
    XmlCore.XmlElement({ localName: XmlSignature.ElementNames.X509IssuerSerial })
], exports.X509IssuerSerial);
exports.X509IncludeOption = void 0;
(function (X509IncludeOption) {
    X509IncludeOption[X509IncludeOption["None"] = 0] = "None";
    X509IncludeOption[X509IncludeOption["EndCertOnly"] = 1] = "EndCertOnly";
    X509IncludeOption[X509IncludeOption["ExcludeRoot"] = 2] = "ExcludeRoot";
    X509IncludeOption[X509IncludeOption["WholeChain"] = 3] = "WholeChain";
})(exports.X509IncludeOption || (exports.X509IncludeOption = {}));
exports.KeyInfoX509Data = class KeyInfoX509Data extends KeyInfoClause {
    constructor(cert, includeOptions = exports.X509IncludeOption.None) {
        super();
        this.x509crl = null;
        this.SubjectKeyIdList = [];
        if (cert) {
            if (cert instanceof Uint8Array) {
                this.AddCertificate(new X509Certificate(cert));
            }
            else if (cert instanceof X509Certificate) {
                switch (includeOptions) {
                    case exports.X509IncludeOption.None:
                    case exports.X509IncludeOption.EndCertOnly:
                        this.AddCertificate(cert);
                        break;
                    case exports.X509IncludeOption.ExcludeRoot:
                        this.AddCertificatesChainFrom(cert, false);
                        break;
                    case exports.X509IncludeOption.WholeChain:
                        this.AddCertificatesChainFrom(cert, true);
                        break;
                }
            }
        }
    }
    async importKey(key) {
        throw new XmlCore.XmlError(XmlCore.XE.METHOD_NOT_SUPPORTED);
    }
    async exportKey(alg) {
        if (!this.Certificates.length) {
            throw new XmlCore.XmlError(XmlCore.XE.NULL_REFERENCE);
        }
        this.Key = await this.Certificates[0].exportKey(alg);
        return this.Key;
    }
    get Certificates() {
        return this.X509CertificateList;
    }
    get CRL() {
        return this.x509crl;
    }
    set CRL(value) {
        this.x509crl = value;
    }
    get IssuerSerials() {
        return this.IssuerSerialList;
    }
    get SubjectKeyIds() {
        return this.SubjectKeyIdList;
    }
    get SubjectNames() {
        return this.SubjectNameList;
    }
    AddCertificate(certificate) {
        if (!certificate) {
            throw new XmlCore.XmlError(XmlCore.XE.PARAM_REQUIRED, "certificate");
        }
        if (!this.X509CertificateList) {
            this.X509CertificateList = [];
        }
        this.X509CertificateList.push(certificate);
    }
    AddIssuerSerial(issuerName, serialNumber) {
        if (issuerName == null) {
            throw new XmlCore.XmlError(XmlCore.XE.PARAM_REQUIRED, "issuerName");
        }
        if (this.IssuerSerialList == null) {
            this.IssuerSerialList = [];
        }
        const xis = { issuerName, serialNumber };
        this.IssuerSerialList.push(xis);
    }
    AddSubjectKeyId(subjectKeyId) {
        if (this.SubjectKeyIdList) {
            this.SubjectKeyIdList = [];
        }
        if (typeof subjectKeyId === "string") {
            if (subjectKeyId != null) {
                let id;
                id = XmlCore.Convert.FromBase64(subjectKeyId);
                this.SubjectKeyIdList.push(id);
            }
        }
        else {
            this.SubjectKeyIdList.push(subjectKeyId);
        }
    }
    AddSubjectName(subjectName) {
        if (this.SubjectNameList == null) {
            this.SubjectNameList = [];
        }
        this.SubjectNameList.push(subjectName);
    }
    GetXml() {
        const doc = this.CreateDocument();
        const xel = this.CreateElement(doc);
        const prefix = this.GetPrefix();
        if ((this.IssuerSerialList != null) && (this.IssuerSerialList.length > 0)) {
            this.IssuerSerialList.forEach((iser) => {
                const isl = doc.createElementNS(XmlSignature.NamespaceURI, prefix + XmlSignature.ElementNames.X509IssuerSerial);
                const xin = doc.createElementNS(XmlSignature.NamespaceURI, prefix + XmlSignature.ElementNames.X509IssuerName);
                xin.textContent = iser.issuerName;
                isl.appendChild(xin);
                const xsn = doc.createElementNS(XmlSignature.NamespaceURI, prefix + XmlSignature.ElementNames.X509SerialNumber);
                xsn.textContent = iser.serialNumber;
                isl.appendChild(xsn);
                xel.appendChild(isl);
            });
        }
        if ((this.SubjectKeyIdList != null) && (this.SubjectKeyIdList.length > 0)) {
            this.SubjectKeyIdList.forEach((skid) => {
                const ski = doc.createElementNS(XmlSignature.NamespaceURI, prefix + XmlSignature.ElementNames.X509SKI);
                ski.textContent = XmlCore.Convert.ToBase64(skid);
                xel.appendChild(ski);
            });
        }
        if ((this.SubjectNameList != null) && (this.SubjectNameList.length > 0)) {
            this.SubjectNameList.forEach((subject) => {
                const sn = doc.createElementNS(XmlSignature.NamespaceURI, prefix + XmlSignature.ElementNames.X509SubjectName);
                sn.textContent = subject;
                xel.appendChild(sn);
            });
        }
        if ((this.X509CertificateList != null) && (this.X509CertificateList.length > 0)) {
            this.X509CertificateList.forEach((x509) => {
                const cert = doc.createElementNS(XmlSignature.NamespaceURI, prefix + XmlSignature.ElementNames.X509Certificate);
                cert.textContent = XmlCore.Convert.ToBase64(x509.GetRaw());
                xel.appendChild(cert);
            });
        }
        if (this.x509crl != null) {
            const crl = doc.createElementNS(XmlSignature.NamespaceURI, prefix + XmlSignature.ElementNames.X509CRL);
            crl.textContent = XmlCore.Convert.ToBase64(this.x509crl);
            xel.appendChild(crl);
        }
        return xel;
    }
    LoadXml(element) {
        super.LoadXml(element);
        if (this.IssuerSerialList) {
            this.IssuerSerialList = [];
        }
        if (this.SubjectKeyIdList) {
            this.SubjectKeyIdList = [];
        }
        if (this.SubjectNameList) {
            this.SubjectNameList = [];
        }
        if (this.X509CertificateList) {
            this.X509CertificateList = [];
        }
        this.x509crl = null;
        let xnl = this.GetChildren(XmlSignature.ElementNames.X509IssuerSerial);
        if (xnl) {
            xnl.forEach((xel) => {
                const issuer = exports.XmlSignatureObject.GetChild(xel, XmlSignature.ElementNames.X509IssuerName, XmlSignature.NamespaceURI, true);
                const serial = exports.XmlSignatureObject.GetChild(xel, XmlSignature.ElementNames.X509SerialNumber, XmlSignature.NamespaceURI, true);
                if (issuer && issuer.textContent && serial && serial.textContent) {
                    this.AddIssuerSerial(issuer.textContent, serial.textContent);
                }
            });
        }
        xnl = this.GetChildren(XmlSignature.ElementNames.X509SKI);
        if (xnl) {
            xnl.forEach((xel) => {
                if (xel.textContent) {
                    const skid = XmlCore.Convert.FromBase64(xel.textContent);
                    this.AddSubjectKeyId(skid);
                }
            });
        }
        xnl = this.GetChildren(XmlSignature.ElementNames.X509SubjectName);
        if (xnl != null) {
            xnl.forEach((xel) => {
                if (xel.textContent) {
                    this.AddSubjectName(xel.textContent);
                }
            });
        }
        xnl = this.GetChildren(XmlSignature.ElementNames.X509Certificate);
        if (xnl) {
            xnl.forEach((xel) => {
                if (xel.textContent) {
                    const cert = XmlCore.Convert.FromBase64(xel.textContent);
                    this.AddCertificate(new X509Certificate(cert));
                }
            });
        }
        const x509el = this.GetChild(XmlSignature.ElementNames.X509CRL, false);
        if (x509el && x509el.textContent) {
            this.x509crl = XmlCore.Convert.FromBase64(x509el.textContent);
        }
    }
    AddCertificatesChainFrom(cert, root) {
        throw new XmlCore.XmlError(XmlCore.XE.METHOD_NOT_IMPLEMENTED);
    }
};
exports.KeyInfoX509Data = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.X509Data,
    })
], exports.KeyInfoX509Data);

exports.SPKIData = class SPKIData extends KeyInfoClause {
    async importKey(key) {
        const spki = await Application.crypto.subtle.exportKey("spki", key);
        this.SPKIexp = new Uint8Array(spki);
        this.Key = key;
        return this;
    }
    async exportKey(alg) {
        const key = await Application.crypto.subtle.importKey("spki", this.SPKIexp, alg, true, ["verify"]);
        this.Key = key;
        return key;
    }
};
tslib.__decorate([
    XmlCore.XmlChildElement({
        localName: XmlSignature.ElementNames.SPKIexp,
        namespaceURI: XmlSignature.NamespaceURI,
        prefix: XmlSignature.DefaultPrefix,
        required: true,
        converter: XmlCore.XmlBase64Converter,
    })
], exports.SPKIData.prototype, "SPKIexp", void 0);
exports.SPKIData = tslib.__decorate([
    XmlCore.XmlElement({
        localName: XmlSignature.ElementNames.SPKIData,
    })
], exports.SPKIData);

const SignatureAlgorithms = {};
SignatureAlgorithms[RSA_PKCS1_SHA1_NAMESPACE] = RsaPkcs1Sha1;
SignatureAlgorithms[RSA_PKCS1_SHA256_NAMESPACE] = RsaPkcs1Sha256;
SignatureAlgorithms[RSA_PKCS1_SHA384_NAMESPACE] = RsaPkcs1Sha384;
SignatureAlgorithms[RSA_PKCS1_SHA512_NAMESPACE] = RsaPkcs1Sha512;
SignatureAlgorithms[ECDSA_SHA1_NAMESPACE] = EcdsaSha1;
SignatureAlgorithms[ECDSA_SHA256_NAMESPACE] = EcdsaSha256;
SignatureAlgorithms[ECDSA_SHA384_NAMESPACE] = EcdsaSha384;
SignatureAlgorithms[ECDSA_SHA512_NAMESPACE] = EcdsaSha512;
SignatureAlgorithms[HMAC_SHA1_NAMESPACE] = HmacSha1;
SignatureAlgorithms[HMAC_SHA256_NAMESPACE] = HmacSha256;
SignatureAlgorithms[HMAC_SHA384_NAMESPACE] = HmacSha384;
SignatureAlgorithms[HMAC_SHA512_NAMESPACE] = HmacSha512;
SignatureAlgorithms[RSA_PSS_SHA1_NAMESPACE] = RsaPssWithoutParamsSha1;
SignatureAlgorithms[RSA_PSS_SHA256_NAMESPACE] = RsaPssWithoutParamsSha256;
SignatureAlgorithms[RSA_PSS_SHA384_NAMESPACE] = RsaPssWithoutParamsSha384;
SignatureAlgorithms[RSA_PSS_SHA512_NAMESPACE] = RsaPssWithoutParamsSha512;
const HashAlgorithms = {};
HashAlgorithms[SHA1_NAMESPACE] = Sha1;
HashAlgorithms[SHA256_NAMESPACE] = Sha256;
HashAlgorithms[SHA384_NAMESPACE] = Sha384;
HashAlgorithms[SHA512_NAMESPACE] = Sha512;
class CryptoConfig {
    static CreateFromName(name) {
        let transform;
        switch (name) {
            case XmlSignature.AlgorithmNamespaces.XmlDsigBase64Transform:
                transform = new XmlDsigBase64Transform();
                break;
            case XmlSignature.AlgorithmNamespaces.XmlDsigC14NTransform:
                transform = new XmlDsigC14NTransform();
                break;
            case XmlSignature.AlgorithmNamespaces.XmlDsigC14NWithCommentsTransform:
                transform = new XmlDsigC14NWithCommentsTransform();
                break;
            case XmlSignature.AlgorithmNamespaces.XmlDsigEnvelopedSignatureTransform:
                transform = new XmlDsigEnvelopedSignatureTransform();
                break;
            case XmlSignature.AlgorithmNamespaces.XmlDsigXPathTransform:
                throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_NOT_SUPPORTED, name);
            case XmlSignature.AlgorithmNamespaces.XmlDsigXsltTransform:
                throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_NOT_SUPPORTED, name);
            case XmlSignature.AlgorithmNamespaces.XmlDsigExcC14NTransform:
                transform = new XmlDsigExcC14NTransform();
                break;
            case XmlSignature.AlgorithmNamespaces.XmlDsigExcC14NWithCommentsTransform:
                transform = new XmlDsigExcC14NWithCommentsTransform();
                break;
            case XmlSignature.AlgorithmNamespaces.XmlDecryptionTransform:
                throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_NOT_SUPPORTED, name);
            default:
                throw new XmlCore.XmlError(XmlCore.XE.ALGORITHM_NOT_SUPPORTED, name);
        }
        return transform;
    }
    static CreateSignatureAlgorithm(method) {
        const alg = SignatureAlgorithms[method.Algorithm] || null;
        if (alg) {
            return new alg();
        }
        else if (method.Algorithm === RSA_PSS_WITH_PARAMS_NAMESPACE) {
            let pssParams;
            method.Any.Some((item) => {
                if (item instanceof exports.PssAlgorithmParams) {
                    pssParams = item;
                }
                return !!pssParams;
            });
            if (pssParams) {
                switch (pssParams.DigestMethod.Algorithm) {
                    case SHA1_NAMESPACE:
                        return new RsaPssSha1(pssParams.SaltLength);
                    case SHA256_NAMESPACE:
                        return new RsaPssSha256(pssParams.SaltLength);
                    case SHA384_NAMESPACE:
                        return new RsaPssSha384(pssParams.SaltLength);
                    case SHA512_NAMESPACE:
                        return new RsaPssSha512(pssParams.SaltLength);
                }
            }
            throw new XmlCore.XmlError(XmlCore.XE.CRYPTOGRAPHIC, `Cannot get params for RSA-PSS algoriithm`);
        }
        throw new Error(`signature algorithm '${method.Algorithm}' is not supported`);
    }
    static CreateHashAlgorithm(namespace) {
        const alg = HashAlgorithms[namespace];
        if (alg) {
            return new alg();
        }
        else {
            throw new Error("hash algorithm '" + namespace + "' is not supported");
        }
    }
    static GetHashAlgorithm(algorithm) {
        const alg = typeof algorithm === "string" ? { name: algorithm } : algorithm;
        switch (alg.name.toUpperCase()) {
            case SHA1:
                return new Sha1();
            case SHA256:
                return new Sha256();
            case SHA384:
                return new Sha384();
            case SHA512:
                return new Sha512();
            default:
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.ALGORITHM_NOT_SUPPORTED, alg.name);
        }
    }
    static GetSignatureAlgorithm(algorithm) {
        if (typeof algorithm.hash === "string") {
            algorithm.hash = {
                name: algorithm.hash,
            };
        }
        const hashName = algorithm.hash.name;
        if (!hashName) {
            throw new Error("Signing algorithm doesn't have name for hash");
        }
        let alg;
        switch (algorithm.name.toUpperCase()) {
            case RSA_PKCS1.toUpperCase():
                switch (hashName.toUpperCase()) {
                    case SHA1:
                        alg = new RsaPkcs1Sha1();
                        break;
                    case SHA256:
                        alg = new RsaPkcs1Sha256();
                        break;
                    case SHA384:
                        alg = new RsaPkcs1Sha384();
                        break;
                    case SHA512:
                        alg = new RsaPkcs1Sha512();
                        break;
                    default:
                        throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.ALGORITHM_NOT_SUPPORTED, `${algorithm.name}:${hashName}`);
                }
                break;
            case RSA_PSS.toUpperCase():
                const saltLength = algorithm.saltLength;
                switch (hashName.toUpperCase()) {
                    case SHA1:
                        alg = saltLength ? new RsaPssSha1(saltLength) : new RsaPssWithoutParamsSha1();
                        break;
                    case SHA256:
                        alg = saltLength ? new RsaPssSha256(saltLength) : new RsaPssWithoutParamsSha256();
                        break;
                    case SHA384:
                        alg = saltLength ? new RsaPssSha384(saltLength) : new RsaPssWithoutParamsSha384();
                        break;
                    case SHA512:
                        alg = saltLength ? new RsaPssSha512(saltLength) : new RsaPssWithoutParamsSha512();
                        break;
                    default:
                        throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.ALGORITHM_NOT_SUPPORTED, `${algorithm.name}:${hashName}`);
                }
                algorithm.saltLength = alg.algorithm.saltLength;
                break;
            case ECDSA:
                switch (hashName.toUpperCase()) {
                    case SHA1:
                        alg = new EcdsaSha1();
                        break;
                    case SHA256:
                        alg = new EcdsaSha256();
                        break;
                    case SHA384:
                        alg = new EcdsaSha384();
                        break;
                    case SHA512:
                        alg = new EcdsaSha512();
                        break;
                    default:
                        throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.ALGORITHM_NOT_SUPPORTED, `${algorithm.name}:${hashName}`);
                }
                break;
            case HMAC:
                switch (hashName.toUpperCase()) {
                    case SHA1:
                        alg = new HmacSha1();
                        break;
                    case SHA256:
                        alg = new HmacSha256();
                        break;
                    case SHA384:
                        alg = new HmacSha384();
                        break;
                    case SHA512:
                        alg = new HmacSha512();
                        break;
                    default:
                        throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.ALGORITHM_NOT_SUPPORTED, `${algorithm.name}:${hashName}`);
                }
                break;
            default:
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.ALGORITHM_NOT_SUPPORTED, algorithm.name);
        }
        return alg;
    }
}

class SignedXml {
    get XmlSignature() {
        return this.signature;
    }
    get Signature() {
        return this.XmlSignature.SignatureValue;
    }
    constructor(node) {
        this.signature = new exports.Signature();
        if (node && node.nodeType === XmlCore__namespace.XmlNodeType.Document) {
            this.document = node;
        }
        else if (node && node.nodeType === XmlCore__namespace.XmlNodeType.Element) {
            const xmlText = new XMLSerializer().serializeToString(node);
            this.document = new DOMParser().parseFromString(xmlText, XmlCore__namespace.APPLICATION_XML);
        }
    }
    async Sign(algorithm, key, data, options = {}) {
        if (XmlCore__namespace.isDocument(data)) {
            data = data.cloneNode(true).documentElement;
        }
        else if (XmlCore__namespace.isElement(data)) {
            data = data.cloneNode(true);
        }
        let alg;
        let signedInfo;
        const signingAlg = XmlCore__namespace.assign({}, algorithm);
        if (key.algorithm["hash"]) {
            signingAlg.hash = key.algorithm["hash"];
        }
        alg = CryptoConfig.GetSignatureAlgorithm(signingAlg);
        await this.ApplySignOptions(this.XmlSignature, algorithm, key, options);
        signedInfo = this.XmlSignature.SignedInfo;
        await this.DigestReferences(data);
        signedInfo.SignatureMethod.Algorithm = alg.namespaceURI;
        if (alg instanceof RsaPssBase) {
            const alg2 = XmlCore__namespace.assign({}, key.algorithm, signingAlg);
            if (typeof alg2.hash === "string") {
                alg2.hash = { name: alg2.hash };
            }
            const params = new exports.PssAlgorithmParams(alg2);
            this.XmlSignature.SignedInfo.SignatureMethod.Any.Add(params);
        }
        else if (HMAC.toUpperCase() === algorithm.name.toUpperCase()) {
            let outputLength = 0;
            const hmacAlg = key.algorithm;
            switch (hmacAlg.hash.name.toUpperCase()) {
                case SHA1:
                    outputLength = hmacAlg.length || 160;
                    break;
                case SHA256:
                    outputLength = hmacAlg.length || 256;
                    break;
                case SHA384:
                    outputLength = hmacAlg.length || 384;
                    break;
                case SHA512:
                    outputLength = hmacAlg.length || 512;
                    break;
            }
            this.XmlSignature.SignedInfo.SignatureMethod.HMACOutputLength = outputLength;
        }
        const si = this.TransformSignedInfo(data);
        const signature = await alg.Sign(si, key, signingAlg);
        this.Key = key;
        this.XmlSignature.SignatureValue = new Uint8Array(signature);
        if (XmlCore__namespace.isElement(data)) {
            this.document = data.ownerDocument;
        }
        return this.XmlSignature;
    }
    async SignDetached(algorithm, key, options = {}) {
        let alg;
        let signedInfo;
        const signingAlg = XmlCore__namespace.assign({}, algorithm);
        if (key.algorithm["hash"]) {
            signingAlg.hash = key.algorithm["hash"];
        }
        alg = CryptoConfig.GetSignatureAlgorithm(signingAlg);
        await this.ApplySignOptions(this.XmlSignature, algorithm, key, options);
        signedInfo = this.XmlSignature.SignedInfo;
        await this.DigestDetachedReferences();
        signedInfo.SignatureMethod.Algorithm = alg.namespaceURI;
        if (alg instanceof RsaPssBase) {
            const alg2 = XmlCore__namespace.assign({}, key.algorithm, signingAlg);
            if (typeof alg2.hash === "string") {
                alg2.hash = { name: alg2.hash };
            }
            const params = new exports.PssAlgorithmParams(alg2);
            this.XmlSignature.SignedInfo.SignatureMethod.Any.Add(params);
        }
        else if (HMAC.toUpperCase() === algorithm.name.toUpperCase()) {
            let outputLength = 0;
            const hmacAlg = key.algorithm;
            switch (hmacAlg.hash.name.toUpperCase()) {
                case SHA1:
                    outputLength = hmacAlg.length || 160;
                    break;
                case SHA256:
                    outputLength = hmacAlg.length || 256;
                    break;
                case SHA384:
                    outputLength = hmacAlg.length || 384;
                    break;
                case SHA512:
                    outputLength = hmacAlg.length || 512;
                    break;
            }
            this.XmlSignature.SignedInfo.SignatureMethod.HMACOutputLength = outputLength;
        }
        const si = this.TransformSignedInfo();
        const signature = await alg.Sign(si, key, signingAlg);
        this.Key = key;
        this.XmlSignature.SignatureValue = new Uint8Array(signature);
        return this.XmlSignature;
    }
    async Verify(params) {
        let content;
        let key;
        if (params) {
            if ("algorithm" in params && "usages" in params && "type" in params) {
                key = params;
            }
            else {
                key = params.key;
                content = params.content;
            }
        }
        if (!content) {
            const xml = this.document;
            if (!(xml && xml.documentElement)) {
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.NULL_PARAM, "SignedXml", "document");
            }
            content = xml.documentElement;
        }
        if (XmlCore__namespace.isDocument(content) || XmlCore__namespace.isElement(content)) {
            content = content.cloneNode(true);
        }
        const res = await this.ValidateReferences(content);
        if (res) {
            const keys = key
                ? [key]
                : await this.GetPublicKeys();
            return this.ValidateSignatureValue(keys);
        }
        else {
            return false;
        }
    }
    GetXml() {
        return this.signature.GetXml();
    }
    LoadXml(value) {
        this.signature = exports.Signature.LoadXml(value);
    }
    toString() {
        const signature = this.XmlSignature;
        const enveloped = signature.SignedInfo.References && signature.SignedInfo.References.Some((r) => r.Transforms && r.Transforms.Some((t) => t instanceof XmlDsigEnvelopedSignatureTransform));
        if (enveloped) {
            const doc = this.document.documentElement.cloneNode(true);
            const node = this.XmlSignature.GetXml();
            if (!node) {
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.XML_EXCEPTION, "Cannot get Xml element from Signature");
            }
            const sig = node.cloneNode(true);
            doc.appendChild(sig);
            return new XMLSerializer().serializeToString(doc);
        }
        return this.XmlSignature.toString();
    }
    async GetPublicKeys() {
        const keys = [];
        const alg = CryptoConfig.CreateSignatureAlgorithm(this.XmlSignature.SignedInfo.SignatureMethod);
        for (const kic of this.XmlSignature.KeyInfo.GetIterator()) {
            if (kic instanceof exports.KeyInfoX509Data) {
                for (const cert of kic.Certificates) {
                    const key = await cert.exportKey();
                    keys.push(key);
                }
            }
            else {
                const key = await kic.exportKey();
                keys.push(key);
            }
        }
        if (alg.algorithm.name.startsWith("RSA")) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key.algorithm.name.startsWith("RSA")) {
                    const spki = await Application.crypto.subtle.exportKey("spki", key);
                    const updatedKey = await Application.crypto.subtle.importKey("spki", spki, alg.algorithm, true, ["verify"]);
                    keys[i] = updatedKey;
                }
            }
        }
        return keys;
    }
    GetSignatureNamespaces() {
        const namespaces = {};
        if (this.XmlSignature.NamespaceURI) {
            namespaces[this.XmlSignature.Prefix || ""] = this.XmlSignature.NamespaceURI;
        }
        return namespaces;
    }
    CopyNamespaces(src, dst, ignoreDefault) {
        this.InjectNamespaces(SelectRootNamespaces(src), dst, ignoreDefault);
    }
    InjectNamespaces(namespaces, target, ignoreDefault) {
        for (const i in namespaces) {
            const uri = namespaces[i];
            if (ignoreDefault && i === "") {
                continue;
            }
            target.setAttribute("xmlns" + (i ? ":" + i : ""), uri);
        }
    }
    async DigestReference(source, reference, checkHmac) {
        if (this.contentHandler) {
            const content = await this.contentHandler(reference, this);
            if (content) {
                source = XmlCore__namespace.isDocument(content)
                    ? content.documentElement
                    : content;
            }
        }
        if (reference.Uri) {
            let objectName;
            if (!reference.Uri.indexOf("#xpointer")) {
                let uri = reference.Uri;
                uri = uri.substring(9).replace(/[\r\n\t\s]/g, "");
                if (uri.length < 2 || uri[0] !== `(` || uri[uri.length - 1] !== `)`) {
                    uri = "";
                }
                else {
                    uri = uri.substring(1, uri.length - 1);
                }
                if (uri.length > 6 && uri.indexOf(`id(`) === 0 && uri[uri.length - 1] === `)`) {
                    objectName = uri.substring(4, uri.length - 2);
                }
            }
            else if (reference.Uri[0] === `#`) {
                objectName = reference.Uri.substring(1);
            }
            if (objectName) {
                let found = null;
                const xmlSignatureObjects = [this.XmlSignature.KeyInfo.GetXml()];
                this.XmlSignature.ObjectList.ForEach((object) => {
                    xmlSignatureObjects.push(object.GetXml());
                });
                for (const xmlSignatureObject of xmlSignatureObjects) {
                    if (xmlSignatureObject) {
                        found = findById(xmlSignatureObject, objectName);
                        if (found) {
                            const el = found.cloneNode(true);
                            if (XmlCore__namespace.isElement(source)) {
                                this.CopyNamespaces(source, el, false);
                            }
                            if (this.Parent) {
                                const parent = (this.Parent instanceof XmlCore__namespace.XmlObject)
                                    ? this.Parent.GetXml()
                                    : this.Parent;
                                this.CopyNamespaces(parent, el, true);
                            }
                            this.CopyNamespaces(found, el, false);
                            this.InjectNamespaces(this.GetSignatureNamespaces(), el, true);
                            source = el;
                            break;
                        }
                    }
                }
                if (!found && (source && XmlCore__namespace.isElement(source))) {
                    found = XmlCore__namespace.XmlObject.GetElementById(source, objectName);
                    if (found) {
                        const el = found.cloneNode(true);
                        this.CopyNamespaces(found, el, false);
                        this.CopyNamespaces(source, el, false);
                        source = el;
                    }
                }
                if (found == null) {
                    throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC, `Cannot get object by reference: ${objectName}`);
                }
            }
        }
        let canonOutput = null;
        if (reference.Transforms && reference.Transforms.Count) {
            if (pvtsutils.BufferSourceConverter.isBufferSource(source)) {
                throw new Error("Transformation for argument 'source' of type BufferSource is not implemented");
            }
            canonOutput = this.ApplyTransforms(reference.Transforms, source);
        }
        else {
            if (reference.Uri && reference.Uri[0] !== `#`) {
                if (XmlCore__namespace.isElement(source)) {
                    if (!source.ownerDocument) {
                        throw new Error("Cannot get ownerDocument from the XML document");
                    }
                    canonOutput = new XMLSerializer().serializeToString(source.ownerDocument);
                }
                else {
                    canonOutput = pvtsutils.BufferSourceConverter.toArrayBuffer(source);
                }
            }
            else {
                const excC14N = new XmlDsigC14NTransform();
                if (pvtsutils.BufferSourceConverter.isBufferSource(source)) {
                    source = XmlCore__namespace.Parse(pvtsutils.Convert.ToUtf8String(source)).documentElement;
                }
                excC14N.LoadInnerXml(source);
                canonOutput = excC14N.GetOutput();
            }
        }
        if (!reference.DigestMethod.Algorithm) {
            throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.NULL_PARAM, "Reference", "DigestMethod");
        }
        const digest = CryptoConfig.CreateHashAlgorithm(reference.DigestMethod.Algorithm);
        return digest.Digest(canonOutput);
    }
    async DigestDetachedReferences() {
        for (const ref of this.XmlSignature.SignedInfo.References.GetIterator()) {
            if (ref.DigestValue) {
                continue;
            }
            if (!ref.DigestMethod.Algorithm) {
                ref.DigestMethod.Algorithm = new Sha256().namespaceURI;
            }
            if (!ref.DigestSource) {
                ref.DigestValue = await this.DigestReference(undefined, ref, false);
                continue;
            }
            const digest = CryptoConfig.CreateHashAlgorithm(ref.DigestMethod.Algorithm);
            const hash = await digest.Digest(ref.DigestSource);
            ref.DigestValue = hash;
        }
    }
    async DigestReferences(data) {
        for (const ref of this.XmlSignature.SignedInfo.References.GetIterator()) {
            if (ref.DigestValue) {
                continue;
            }
            if (!ref.DigestMethod.Algorithm) {
                ref.DigestMethod.Algorithm = new Sha256().namespaceURI;
            }
            const hash = await this.DigestReference(data, ref, false);
            ref.DigestValue = hash;
        }
    }
    TransformSignedInfo(data) {
        const t = CryptoConfig.CreateFromName(this.XmlSignature.SignedInfo.CanonicalizationMethod.Algorithm);
        const xml = this.XmlSignature.SignedInfo.GetXml();
        if (!xml) {
            throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.XML_EXCEPTION, "Cannot get Xml element from SignedInfo");
        }
        const node = xml.cloneNode(true);
        this.CopyNamespaces(xml, node, false);
        if (data && !pvtsutils.BufferSourceConverter.isBufferSource(data)) {
            if (data.nodeType === XmlCore__namespace.XmlNodeType.Document) {
                this.CopyNamespaces(data.documentElement, node, false);
            }
            else {
                this.CopyNamespaces(data, node, false);
            }
        }
        if (this.Parent) {
            const parentXml = (this.Parent instanceof XmlCore__namespace.XmlObject)
                ? this.Parent.GetXml()
                : this.Parent;
            if (parentXml) {
                this.CopyNamespaces(parentXml, node, false);
            }
        }
        const childNamespaces = XmlCore__namespace.SelectNamespaces(xml);
        for (const i in childNamespaces) {
            const uri = childNamespaces[i];
            if (i === node.prefix) {
                continue;
            }
            node.setAttribute("xmlns" + (i ? ":" + i : ""), uri);
        }
        t.LoadInnerXml(node);
        const res = t.GetOutput();
        return res;
    }
    ResolveTransform(transform) {
        if (typeof transform === "string") {
            switch (transform) {
                case "enveloped":
                    return new XmlDsigEnvelopedSignatureTransform();
                case "c14n":
                    return new XmlDsigC14NTransform();
                case "c14n-com":
                    return new XmlDsigC14NWithCommentsTransform();
                case "exc-c14n":
                    return new XmlDsigExcC14NTransform();
                case "exc-c14n-com":
                    return new XmlDsigExcC14NWithCommentsTransform();
                case "base64":
                    return new XmlDsigBase64Transform();
                default:
                    throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC_UNKNOWN_TRANSFORM, transform);
            }
        }
        switch (transform.name) {
            case "xpath": {
                const xpathTransform = new XmlDsigXPathTransform();
                xpathTransform.XPath = transform.selector;
                const transformEl = xpathTransform.GetXml();
                if (transformEl && transform.namespaces) {
                    for (const [prefix, namespace] of Object.entries(transform.namespaces)) {
                        transformEl.firstChild.setAttributeNS("http://www.w3.org/2000/xmlns/", `xmlns:${prefix}`, namespace);
                    }
                }
                return xpathTransform;
            }
            default:
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC_UNKNOWN_TRANSFORM, transform.name);
        }
    }
    ApplyTransforms(transforms, input) {
        let output = null;
        transforms.Sort((a, b) => {
            const c14nTransforms = [XmlDsigC14NTransform, XmlDsigC14NWithCommentsTransform,
                XmlDsigExcC14NTransform, XmlDsigExcC14NWithCommentsTransform];
            if (c14nTransforms.some((t) => a instanceof t)) {
                return 1;
            }
            if (c14nTransforms.some((t) => b instanceof t)) {
                return -1;
            }
            return 0;
        }).ForEach((transform) => {
            transform.LoadInnerXml(input);
            if (transform instanceof XmlDsigXPathTransform) {
                transform.GetOutput();
            }
            else {
                output = transform.GetOutput();
            }
        });
        if (transforms.Count === 1 && transforms.Item(0) instanceof XmlDsigEnvelopedSignatureTransform) {
            const c14n = new XmlDsigC14NTransform();
            c14n.LoadInnerXml(input);
            output = c14n.GetOutput();
        }
        return output;
    }
    async ApplySignOptions(signature, algorithm, key, options) {
        if (options.id) {
            this.XmlSignature.Id = options.id;
        }
        if (options.keyValue && key.algorithm.name.toUpperCase() !== HMAC) {
            if (!signature.KeyInfo) {
                signature.KeyInfo = new exports.KeyInfo();
            }
            const keyInfo = signature.KeyInfo;
            const keyValue = new exports.KeyValue();
            keyInfo.Add(keyValue);
            await keyValue.importKey(options.keyValue);
        }
        if (options.x509) {
            if (!signature.KeyInfo) {
                signature.KeyInfo = new exports.KeyInfo();
            }
            const keyInfo = signature.KeyInfo;
            options.x509.forEach((x509) => {
                const raw = XmlCore__namespace.Convert.FromBase64(x509);
                const x509Data = new exports.KeyInfoX509Data(raw);
                keyInfo.Add(x509Data);
            });
        }
        if (options.references) {
            options.references.forEach((item) => {
                const reference = new exports.Reference();
                if (item.id) {
                    reference.Id = item.id;
                }
                if (item.uri !== null && item.uri !== undefined) {
                    reference.Uri = item.uri;
                }
                if (item.type) {
                    reference.Type = item.type;
                }
                if (item.digestSource) {
                    reference.DigestSource = item.digestSource;
                }
                if (item.digestValue) {
                    reference.DigestValue = new Uint8Array(item.digestValue);
                }
                const digestAlgorithm = CryptoConfig.GetHashAlgorithm(item.hash);
                reference.DigestMethod.Algorithm = digestAlgorithm.namespaceURI;
                if (item.transforms && item.transforms.length) {
                    const transforms = new exports.Transforms();
                    item.transforms.forEach((transform) => {
                        transforms.Add(this.ResolveTransform(transform));
                    });
                    reference.Transforms = transforms;
                }
                if (!signature.SignedInfo.References) {
                    signature.SignedInfo.References = new exports.References();
                }
                signature.SignedInfo.References.Add(reference);
            });
        }
        if (!signature.SignedInfo.References.Count) {
            const reference = new exports.Reference();
            signature.SignedInfo.References.Add(reference);
        }
    }
    async ValidateReferences(doc) {
        for (const ref of this.XmlSignature.SignedInfo.References.GetIterator()) {
            const digest = await this.DigestReference(doc, ref, false);
            const b64Digest = XmlCore__namespace.Convert.ToBase64(digest);
            const b64DigestValue = XmlCore__namespace.Convert.ToString(ref.DigestValue, "base64");
            if (b64Digest !== b64DigestValue) {
                const errText = `Invalid digest for uri '${ref.Uri}'. Calculated digest is ${b64Digest} but the xml to validate supplies digest ${b64DigestValue}`;
                throw new XmlCore__namespace.XmlError(XmlCore__namespace.XE.CRYPTOGRAPHIC, errText);
            }
        }
        return true;
    }
    async ValidateSignatureValue(keys) {
        let signer;
        let signedInfoCanon;
        signedInfoCanon = this.TransformSignedInfo(this.document);
        signer = CryptoConfig.CreateSignatureAlgorithm(this.XmlSignature.SignedInfo.SignatureMethod);
        for (const key of keys) {
            const ok = await signer.Verify(signedInfoCanon, key, this.Signature);
            if (ok) {
                return true;
            }
        }
        return false;
    }
}
function findById(element, id) {
    if (element.nodeType !== XmlCore__namespace.XmlNodeType.Element) {
        return null;
    }
    if (element.hasAttribute("Id") && element.getAttribute("Id") === id) {
        return element;
    }
    if (element.childNodes && element.childNodes.length) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const el = findById(element.childNodes[i], id);
            if (el) {
                return el;
            }
        }
    }
    return null;
}
function addNamespace(selectedNodes, name, namespace) {
    if (!(name in selectedNodes)) {
        selectedNodes[name] = namespace;
    }
}
function _SelectRootNamespaces(node, selectedNodes = {}) {
    if (XmlCore__namespace.isElement(node)) {
        if (node.namespaceURI && node.namespaceURI !== "http://www.w3.org/XML/1998/namespace") {
            addNamespace(selectedNodes, node.prefix ? node.prefix : "", node.namespaceURI);
        }
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes.item(i);
            if (attr && attr.prefix === "xmlns") {
                addNamespace(selectedNodes, attr.localName ? attr.localName : "", attr.value);
            }
        }
        if (node.parentNode) {
            _SelectRootNamespaces(node.parentNode, selectedNodes);
        }
    }
}
function SelectRootNamespaces(node) {
    const attrs = {};
    _SelectRootNamespaces(node, attrs);
    return attrs;
}

Object.defineProperty(exports, 'Parse', {
    enumerable: true,
    get: function () { return XmlCore.Parse; }
});
Object.defineProperty(exports, 'Select', {
    enumerable: true,
    get: function () { return XmlCore.Select; }
});
Object.defineProperty(exports, 'Stringify', {
    enumerable: true,
    get: function () { return XmlCore.Stringify; }
});
exports.Application = Application;
exports.CryptoConfig = CryptoConfig;
exports.ECDSA = ECDSA;
exports.ECDSA_SHA1_NAMESPACE = ECDSA_SHA1_NAMESPACE;
exports.ECDSA_SHA256_NAMESPACE = ECDSA_SHA256_NAMESPACE;
exports.ECDSA_SHA384_NAMESPACE = ECDSA_SHA384_NAMESPACE;
exports.ECDSA_SHA512_NAMESPACE = ECDSA_SHA512_NAMESPACE;
exports.EcdsaSha1 = EcdsaSha1;
exports.EcdsaSha256 = EcdsaSha256;
exports.EcdsaSha384 = EcdsaSha384;
exports.EcdsaSha512 = EcdsaSha512;
exports.HMAC = HMAC;
exports.HMAC_SHA1_NAMESPACE = HMAC_SHA1_NAMESPACE;
exports.HMAC_SHA256_NAMESPACE = HMAC_SHA256_NAMESPACE;
exports.HMAC_SHA384_NAMESPACE = HMAC_SHA384_NAMESPACE;
exports.HMAC_SHA512_NAMESPACE = HMAC_SHA512_NAMESPACE;
exports.HmacSha1 = HmacSha1;
exports.HmacSha256 = HmacSha256;
exports.HmacSha384 = HmacSha384;
exports.HmacSha512 = HmacSha512;
exports.KeyInfoClause = KeyInfoClause;
exports.RSA_PKCS1 = RSA_PKCS1;
exports.RSA_PKCS1_SHA1_NAMESPACE = RSA_PKCS1_SHA1_NAMESPACE;
exports.RSA_PKCS1_SHA256_NAMESPACE = RSA_PKCS1_SHA256_NAMESPACE;
exports.RSA_PKCS1_SHA384_NAMESPACE = RSA_PKCS1_SHA384_NAMESPACE;
exports.RSA_PKCS1_SHA512_NAMESPACE = RSA_PKCS1_SHA512_NAMESPACE;
exports.RSA_PSS = RSA_PSS;
exports.RSA_PSS_SHA1_NAMESPACE = RSA_PSS_SHA1_NAMESPACE;
exports.RSA_PSS_SHA256_NAMESPACE = RSA_PSS_SHA256_NAMESPACE;
exports.RSA_PSS_SHA384_NAMESPACE = RSA_PSS_SHA384_NAMESPACE;
exports.RSA_PSS_SHA512_NAMESPACE = RSA_PSS_SHA512_NAMESPACE;
exports.RSA_PSS_WITH_PARAMS_NAMESPACE = RSA_PSS_WITH_PARAMS_NAMESPACE;
exports.RsaPkcs1Sha1 = RsaPkcs1Sha1;
exports.RsaPkcs1Sha256 = RsaPkcs1Sha256;
exports.RsaPkcs1Sha384 = RsaPkcs1Sha384;
exports.RsaPkcs1Sha512 = RsaPkcs1Sha512;
exports.RsaPssBase = RsaPssBase;
exports.RsaPssSha1 = RsaPssSha1;
exports.RsaPssSha256 = RsaPssSha256;
exports.RsaPssSha384 = RsaPssSha384;
exports.RsaPssSha512 = RsaPssSha512;
exports.RsaPssWithoutParamsBase = RsaPssWithoutParamsBase;
exports.RsaPssWithoutParamsSha1 = RsaPssWithoutParamsSha1;
exports.RsaPssWithoutParamsSha256 = RsaPssWithoutParamsSha256;
exports.RsaPssWithoutParamsSha384 = RsaPssWithoutParamsSha384;
exports.RsaPssWithoutParamsSha512 = RsaPssWithoutParamsSha512;
exports.SHA1 = SHA1;
exports.SHA1_NAMESPACE = SHA1_NAMESPACE;
exports.SHA256 = SHA256;
exports.SHA256_NAMESPACE = SHA256_NAMESPACE;
exports.SHA384 = SHA384;
exports.SHA384_NAMESPACE = SHA384_NAMESPACE;
exports.SHA512 = SHA512;
exports.SHA512_NAMESPACE = SHA512_NAMESPACE;
exports.SelectRootNamespaces = SelectRootNamespaces;
exports.Sha1 = Sha1;
exports.Sha256 = Sha256;
exports.Sha384 = Sha384;
exports.Sha512 = Sha512;
exports.SignedXml = SignedXml;
exports.X509Certificate = X509Certificate;
exports.XmlCanonicalizer = XmlCanonicalizer;
exports.XmlDsigBase64Transform = XmlDsigBase64Transform;
exports.XmlDsigC14NTransform = XmlDsigC14NTransform;
exports.XmlDsigC14NWithCommentsTransform = XmlDsigC14NWithCommentsTransform;
exports.XmlDsigEnvelopedSignatureTransform = XmlDsigEnvelopedSignatureTransform;
exports.XmlDsigExcC14NTransform = XmlDsigExcC14NTransform;
exports.XmlDsigExcC14NWithCommentsTransform = XmlDsigExcC14NWithCommentsTransform;
exports.XmlDsigXPathTransform = XmlDsigXPathTransform;
exports.XmlSignature = XmlSignature;
