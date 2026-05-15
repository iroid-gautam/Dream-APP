export const randomStringGenerator = (givenLength = 70) => {
  const characters =
    givenLength > 10
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomStr = "";

  for (let i = 0; i < givenLength; i++) {
    const randomNum = Math.floor(Math.random() * characters.length);
    randomStr += characters[randomNum];
  }

  return randomStr;
};

export const resolveSafeTimezone = (timezone = "", fallback = "UTC") => {
  const value = `${timezone || ""}`.trim();
  if (!value) {
    return fallback;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return value;
  } catch (error) {
    return fallback;
  }
};
