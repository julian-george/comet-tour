export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
export const absRange = (magnitude: number) => {
  return randomRange(-1 * magnitude, magnitude);
};
