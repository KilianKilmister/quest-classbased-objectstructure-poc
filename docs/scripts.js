
export function hideSVG (id) {
  var style = document.getElementById(id).style.display
  if (style === 'none') {
    document.getElementById(id).style.display = 'block'
  } else {
    document.getElementById(id).style.display = 'none'
  }
}
