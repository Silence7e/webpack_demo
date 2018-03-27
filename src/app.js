import './css/base.less';
import { componentA } from './components/a';
//  import 'babel-polyfill';
//  import $ from 'jquery';
//  import {chunk} from 'lodash';
const app = document.getElementById('app');
//  app.innerHTML=`<div class="${base.bigBox}">header</div>`;
const bigBox = document.createElement('div');
bigBox.classList.add('bigBox');
bigBox.innerHTML = `<div class="ant1"></div>
    <div class="ant2"></div>
    <div class="ant3"></div>
    <div class="ant4"></div>`;
let list = componentA();
app.appendChild(list);
app.appendChild(bigBox);

const arr = [1, 2, 3, 4, 5];
const aSet = new Set(arr);
console.log(aSet);
const obj = {
  a: 1,
  b: 2,
};
console.log(obj);
// const componentA = require('./components/a').componentA;
// console.log(chunk([1,2,3,4,5],2));
export default 'app';

$.get('/investments', {}, res => console.log(res));

if (module.hot) {
  module
    .hot
    .accept('./components/a', () => {
      app.removeChild(list);

      const newList = componentA();

      app.appendChild(newList);
      list = newList;
    });
}
