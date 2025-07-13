import { GetParameterCommand } from "@aws-sdk/client-ssm";
import { ssmClient } from "../utils/client";

/**
* Fetches the content path from AWS SSM Parameter Store.
* This function retrieves the content path from AWS SSM Parameter Store, which is used to determine where the content files are stored in the application. It uses the AWS SDK to send a command to get the parameter value.
* @param {string} paramName - The name of the parameter to fetch.
* @returns {Promise<String>} - The content path retrieved from the parameter store.
* @throws {Error} - If the parameter is not found or if there is an error retrieving it.
 */
export async function getContentPath(paramName: string): Promise<string> {

    const command = new GetParameterCommand({
        Name: paramName,
        WithDecryption: false
    });

    const response = await ssmClient.send(command);

    if (!response.Parameter) {
        throw new Error("[Content Path Not Found]");
    }

    return response.Parameter.Value!;
}