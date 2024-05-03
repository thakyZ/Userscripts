export interface FfxivModdingNameError {
  error: boolean,
  message?: string
}

export interface FfxivModdingNameQuery extends FfxivModdingNameError {
  [key: number]: string
}