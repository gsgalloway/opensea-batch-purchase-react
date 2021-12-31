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

export class SafeTransaction {
    'to': string;
    'value': string;
    'data': string;
    'operation': string;
    'safeTxGas': string;
    'baseGas': string;
    'gasPrice': string;
    'gasToken': string;
    'refundReceiver': string;
    'nonce': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "to",
            "baseName": "to",
            "type": "string"
        },
        {
            "name": "value",
            "baseName": "value",
            "type": "string"
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "string"
        },
        {
            "name": "operation",
            "baseName": "operation",
            "type": "string"
        },
        {
            "name": "safeTxGas",
            "baseName": "safeTxGas",
            "type": "string"
        },
        {
            "name": "baseGas",
            "baseName": "baseGas",
            "type": "string"
        },
        {
            "name": "gasPrice",
            "baseName": "gasPrice",
            "type": "string"
        },
        {
            "name": "gasToken",
            "baseName": "gasToken",
            "type": "string"
        },
        {
            "name": "refundReceiver",
            "baseName": "refundReceiver",
            "type": "string"
        },
        {
            "name": "nonce",
            "baseName": "nonce",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return SafeTransaction.attributeTypeMap;
    }
}

