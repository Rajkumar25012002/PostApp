export function validateUserName(userName) {
  if (userName) {
    return /^[a-zA-Z0-9]{8,20}$/.test(userName)
      ? ""
      : "Must be 8-20 characters long.";
  }
  return;
}
export function validateUserEmail(email) {
  if (email) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
      ? ""
      : "Must be a valid email address.";
  }
  return;
}
export function validatePassword(password) {
  if (password) {
    return /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$/.test(
      password
    )
      ? ""
      : "Must be 8-20 characters with one uppercase and special character.";
  }
  return;
}
export function validatePasswordMatch(password, confirmPassword) {
  if (password != confirmPassword && confirmPassword && password) {
    return "Passwords do not match.";
  }
  return "";
}
