import type { IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { getOpenAiCredentialType, setOpenAiAuthorizationHeader } from '../GenericFunctions';

describe('OpenAI GenericFunctions', () => {
	const createMockContext = (
		authType: 'apiKey' | 'oAuth2',
		credentials: Record<string, unknown>,
	) => {
		return {
			getNodeParameter: jest.fn().mockReturnValue(authType),
			getCredentials: jest.fn().mockResolvedValue(credentials),
			getNode: jest.fn().mockReturnValue({ name: 'OpenAI', type: 'n8n-nodes-base.openAi' }),
		};
	};

	it('should resolve API key credential type', () => {
		const context = createMockContext('apiKey', { apiKey: 'sk-test' });
		const credentialType = getOpenAiCredentialType.call(context as never);

		expect(credentialType).toBe('openAiApi');
	});

	it('should resolve OAuth2 credential type', () => {
		const context = createMockContext('oAuth2', {
			oauthTokenData: { accessToken: 'oauth-token' },
		});
		const credentialType = getOpenAiCredentialType.call(context as never);

		expect(credentialType).toBe('openAiOAuth2Api');
	});

	it('should set Authorization header for API key auth', async () => {
		const context = createMockContext('apiKey', { apiKey: 'sk-test' });
		const requestOptions: IHttpRequestOptions = {};

		const result = await setOpenAiAuthorizationHeader.call(context as never, requestOptions);

		expect(result.headers).toEqual({ Authorization: 'Bearer sk-test' });
		expect(context.getCredentials).toHaveBeenCalledWith('openAiApi');
	});

	it('should set Authorization header for OAuth2 auth', async () => {
		const context = createMockContext('oAuth2', {
			oauthTokenData: { accessToken: 'oauth-token' },
		});
		const requestOptions: IHttpRequestOptions = {};

		const result = await setOpenAiAuthorizationHeader.call(context as never, requestOptions);

		expect(result.headers).toEqual({ Authorization: 'Bearer oauth-token' });
		expect(context.getCredentials).toHaveBeenCalledWith('openAiOAuth2Api');
	});

	it('should throw when token is missing', async () => {
		const context = createMockContext('oAuth2', {});
		const requestOptions: IHttpRequestOptions = {};

		await expect(
			setOpenAiAuthorizationHeader.call(context as never, requestOptions),
		).rejects.toBeInstanceOf(NodeOperationError);
		await expect(
			setOpenAiAuthorizationHeader.call(context as never, requestOptions),
		).rejects.toThrow('No OpenAI access token found in credentials');
	});
});
