const KNOWN_SERVER_MESSAGES: Record<string, string> = {
  "Name is required.": "errors.nameRequired",
  "Name cannot exceed 50 characters.": "errors.nameTooLong",
  "Surname is required.": "errors.surnameRequired",
  "Surname cannot exceed 50 characters.": "errors.surnameTooLong",
  "Email is required.": "errors.emailRequired",
  "Invalid email format.": "errors.emailInvalid",
  "Password is required.": "errors.passwordRequired",
  "Password must be at least 8 characters long.": "errors.passwordTooShort",
  "Password must contain at least one uppercase letter.": "errors.passwordNeedsUppercase",
  "Password must contain at least one number.": "errors.passwordNeedsNumber",
  "Provide either an existing Company ID or a new company name, but not both.":
    "errors.companyChooseOne",
  "User with this email already exists.": "errors.emailAlreadyExists",
  "Company not found.": "errors.companyNotFound",
  "You must either provide a company to join, create a new company, or be invited by an existing company.":
    "errors.companyRequired",
  "Invalid email or password.": "errors.invalidCredentials",
  "This account is inactive.": "errors.accountInactive",
  "Invalid or expired refresh token.": "errors.sessionExpired",
  "Invalid refresh token.": "errors.sessionExpired",
  "User not found.": "errors.userNotFound",
};

export function translateServerMessage(
  rawMessage: string,
  t: (key: string) => string
): string {
  const key = KNOWN_SERVER_MESSAGES[rawMessage];
  if (!key) {
    return rawMessage;
  }
  try {
    return t(key);
  } catch {
    return rawMessage;
  }
}
