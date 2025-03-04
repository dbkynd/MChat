import prettyBytes from 'pretty-bytes';

export default function (bytes: number = 0): string {
  return prettyBytes(bytes);
}
