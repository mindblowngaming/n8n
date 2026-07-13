import { OpenAiOAuth2Api } from '../OpenAiOAuth2Api.credentials';

describe('OpenAiOAuth2Api Credential', () => {
	const credential = new OpenAiOAuth2Api();

	it('should have correct credential metadata', () => {
		expect(credential.name).toBe('openAiOAuth2Api');
		expect(credential.extends).toEqual(['oAuth2Api']);
		expect(credential.displayName).toBe('OpenAI OAuth2 (Subscription)');
		expect(credential.documentationUrl).toBe('openai');
	});

	it('should define hidden OAuth2 configuration fields', () => {
		const grantType = credential.properties.find((property) => property.name === 'grantType');
		const authUrl = credential.properties.find((property) => property.name === 'authUrl');
		const accessTokenUrl = credential.properties.find((property) => property.name === 'accessTokenUrl');
		const scope = credential.properties.find((property) => property.name === 'scope');
		const authQueryParameters = credential.properties.find(
			(property) => property.name === 'authQueryParameters',
		);
		const authentication = credential.properties.find((property) => property.name === 'authentication');

		expect(grantType).toBeDefined();
		expect(authUrl).toBeDefined();
		expect(accessTokenUrl).toBeDefined();
		expect(scope).toBeDefined();
		expect(authQueryParameters).toBeDefined();
		expect(authentication).toBeDefined();

		expect(grantType?.default).toBe('authorizationCode');
		expect(authUrl?.default).toBe('https://auth.openai.com/oauth/authorize');
		expect(accessTokenUrl?.default).toBe('https://auth.openai.com/oauth/token');
		expect(scope?.default).toBe('openid profile email');
		expect(authQueryParameters?.default).toBe('');
		expect(authentication?.default).toBe('body');
	});
});
