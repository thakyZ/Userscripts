export default class EMath {
  public static clamp(input: number, min: number, max: number): number {
    return input < min ? min : (input > max ? max : input);
  }
}
