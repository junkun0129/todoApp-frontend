export const getTmQuery = () => {
  return "?tm=" + new Date().getTime() + Math.floor(Math.random() * 1000000);
};
