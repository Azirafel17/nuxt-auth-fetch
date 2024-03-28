export const stringToStringContainer = (
  str: string,
  separator: string = ','
): string[] => {
  return str
    .split(separator)
    .map((item) => item.trim())
    .filter((item) => item.length >= 1)
}

const urlValidatorPath = (_path: string): string => {
  return _path.replace(/(\/)\/+/g, '$1')
}
const urlValidator = (_url: string): string => {
  return _url.replace(/([^:]\/)\/+/g, '$1')
}

export const urlPrepare = (_url: string): string => {
  if (_url.lastIndexOf('/') !== _url.length - 1) return urlValidator(`${_url}/`)
  return urlValidator(_url)
}

export const urlPreparePath = (_path: string): string => {
  if (_path.lastIndexOf('/') !== _path.length - 1)
    return urlValidatorPath(`${_path}/`)
  return urlValidatorPath(_path)
}

export const urlPreparePrefix = (_prefix: string): string => {
  if (!_prefix) return ''
  let prefix: string = _prefix
  if (prefix.lastIndexOf('/') === prefix.length - 1) {
    prefix = prefix.slice(prefix.length - 1, prefix.length)
  }
  if (prefix[0].indexOf('/') === 0) {
    prefix = prefix.slice(1, prefix.length)
  }
  return urlValidatorPath(prefix)
}
