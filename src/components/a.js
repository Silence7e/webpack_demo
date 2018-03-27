export function componentA() {
  const ul = document.createElement('ul');
  ul.innerHTML = `
  <ul>
  <li>11</li>
  <li>2</li>
  <li>32</li>
  </ul>
  `;
  return ul;
}

export default componentA;
