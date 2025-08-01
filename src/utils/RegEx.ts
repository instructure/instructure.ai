const EmailAddressPattern: RegExp =
	/^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;
const PersonalEmailPattern: RegExp =
	/@(gmail|yahoo|outlook|hotmail|aol|icloud|mail|protonmail|zoho|yandex)\.com$/i;
const SpacePattern: RegExp = /^[ \t]+$/;

export { EmailAddressPattern, PersonalEmailPattern, SpacePattern };
