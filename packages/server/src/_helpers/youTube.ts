// Taken from:
// https://stackoverflow.com/questions/28735459/how-to-validate-youtube-url-in-client-side-in-text-box

export const isValidUrl = (url: string): boolean => {
  if (!url) {
    return false;
  }

  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {

    // change to embed:
    // 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0'
    return true;
  }

  return false;
};
