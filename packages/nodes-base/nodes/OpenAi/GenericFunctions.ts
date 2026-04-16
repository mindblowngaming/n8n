import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

type OpenAiAuthentication = 'apiKey' | 'oAuth2';
type OpenAiCredentialType = 'openAiApi' | 'openAiOAuth2Api';

function isDataObject(value: unknown): value is IDataObject {
	return typeof value === 'object' && value !== null;
}

function getStringValue(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

export function getOpenAiAuthentication(
	this: IExecuteSingleFunctions,
): OpenAiAuthentication {
	const authentication = this.getNodeParameter('authentication', 0, 'apiKey');
	return authentication === 'oAuth2' ? 'oAuth2' : 'apiKey';
}

export function getOpenAiCredentialType(this: IExecuteSingleFunctions): OpenAiCredentialType {
	return getOpenAiAuthentication.call(this) === 'oAuth2' ? 'openAiOAuth2Api' : 'openAiApi';
}

export async function setOpenAiAuthorizationHeader(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	requestOptions.headers ??= {};

	const credentialType = getOpenAiCredentialType.call(this);
	const credentials = await this.getCredentials(credentialType);

	let accessToken = '';
	if (credentialType === 'openAiApi') {
		accessToken = getStringValue(credentials.apiKey) ?? '';
	} else {
		const oauthTokenData = isDataObject(credentials.oauthTokenData)
			? credentials.oauthTokenData
			: undefined;
		accessToken =
			getStringValue(oauthTokenData?.accessToken) ??
			getStringValue(oauthTokenData?.access_token) ??
			getStringValue(credentials.accessToken) ??
			'';
	}

	if (!accessToken) {
		throw new NodeOperationError(this.getNode(), 'No OpenAI access token found in credentials');
	}

	requestOptions.headers.Authorization = `Bearer ${accessToken}`;

	return requestOptions;
}

export async function sendErrorPostReceive(
	this: IExecuteSingleFunctions,
	data: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject);
	}
	return data;
}
