export type LanguageCode = 'english' | 'arabic';

const BASE_URL = "https://career-guidance-backend-hscsc4aza8etg4g9.southeastasia-01.azurewebsites.net/career_assistant";
console.log('BASE_URL', BASE_URL);

export const getCurrentLanguage = async (): Promise<LanguageCode> => {
  const res = await fetch(`${BASE_URL}/get_language/`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json();
  return data.language as LanguageCode;
};

export const changeLanguageOnServer = async (lang: LanguageCode): Promise<void> => {
  await fetch(`${BASE_URL}/get_language/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ language: lang }),
  });
};

// Just return the lang directly — no need for an object
export const fetchLanguageStrings = async (lang: LanguageCode): Promise<LanguageCode> => {
  return lang;
};
