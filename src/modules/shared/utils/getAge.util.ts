export const getAge = (birthDateInput: Date | string | null | undefined) => {
  if (!birthDateInput) return null;

  const today = new Date();
  const birthDate = new Date(birthDateInput);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
