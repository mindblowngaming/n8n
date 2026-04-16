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
		const propertiesByName = Object.fromEntries(credential.properties.map((property) => [property.name, property]));

		expect(propertiesByName.grantType?.default).toBe('authorizationCode');
		expect(propertiesByName.authUrl?.default).toBe('https://auth.openai.com/oauth/authorize');
		expect(propertiesByName.accessTokenUrl?.default).toBe('https://auth.openai.com/oauth/token');
		expect(propertiesByName.scope?.default).toBe('openid profile email');
		expect(propertiesByName.authQueryParameters?.default).toBe('');
		expect(propertiesByName.authentication?.default).toBe('body');
	});
});
