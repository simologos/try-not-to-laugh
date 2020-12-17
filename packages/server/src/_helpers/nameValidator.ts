
export const isValidName = (name: string) => {
  if(!name) {
    return false;
  }

  if(name.length > 200) {
    return false;
  }

  return true;
};