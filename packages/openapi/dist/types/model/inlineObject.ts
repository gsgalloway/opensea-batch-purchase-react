/**
 * API_ID optional-string
 * Sample API on API Gateway with a Google Cloud Functions backend
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { Token } from './token';

export class InlineObject {
    'tokens': Array<Token>;
    /**
    * Ethereum network (Rinkeby / Homestead)
    */
    'network': InlineObject.NetworkEnum;
    'recipient': string;
    'gnosisSafeAddress': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "tokens",
            "baseName": "tokens",
            "type": "Array<Token>"
        },
        {
            "name": "network",
            "baseName": "network",
            "type": "InlineObject.NetworkEnum"
        },
        {
            "name": "recipient",
            "baseName": "recipient",
            "type": "string"
        },
        {
            "name": "gnosisSafeAddress",
            "baseName": "gnosisSafeAddress",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return InlineObject.attributeTypeMap;
    }
}

export namespace InlineObject {
    export enum NetworkEnum {
        Rinkeby = <any> 'rinkeby',
        Homestead = <any> 'homestead'
    }
}
