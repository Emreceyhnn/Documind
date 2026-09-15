const KNOWN_SERVER_MESSAGES: Record<string, string> = {
  "Name is required.": "nameRequired",
  "Name cannot exceed 50 characters.": "nameTooLong",
  "Surname is required.": "surnameRequired",
  "Surname cannot exceed 50 characters.": "surnameTooLong",
  "Email is required.": "emailRequired",
  "Invalid email format.": "emailInvalid",
  "Password is required.": "passwordRequired",
  "Password must be at least 8 characters long.": "passwordTooShort",
  "Password must contain at least one uppercase letter.": "passwordNeedsUppercase",
  "Password must contain at least one number.": "passwordNeedsNumber",
  "Provide either an existing Company ID or a new company name, but not both.":
    "companyChooseOne",
  "User with this email already exists.": "emailAlreadyExists",
  "Company not found.": "companyNotFound",
  "You must either provide a company to join, create a new company, or be invited by an existing company.":
    "companyRequired",
  "Invalid email or password.": "invalidCredentials",
  "This account is inactive.": "accountInactive",
  "Invalid or expired refresh token.": "sessionExpired",
  "Invalid refresh token.": "sessionExpired",
  "User not found.": "userNotFound",
  "Network connection failed.": "networkFailed",
  "Login failed. Please check your email and password.": "loginFailed",
  "Registration failed. Please check your email and password.": "registrationFailed",
  "Could not update user information. Please try again.": "updateUserFailed",
  "Could not delete user account. Please try again.": "deleteUserFailed",
  "Could not load documents.": "loadDocumentsFailed",
  "Could not upload document.": "uploadDocumentFailed",
  "Could not delete document.": "deleteDocumentFailed",
  "Could not open document.": "openDocumentFailed",
  "Could not get an answer.": "chatQueryFailed",
  "Could not load company information.": "loadCompanyFailed",
  "Could not add member.": "addMemberFailed",
  "Could not remove member.": "removeMemberFailed",
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
