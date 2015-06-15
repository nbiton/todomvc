
import clone from 'clone';
import Emitter from 'events';

if (typeof window !== 'undefined') var localStorage = window.localStorage;

const KEY = 'todos-deku';
const DEFAULTS = [
  { id: 0, title: 'Taste JavaScript', completed: true },
  { id: 1, title: 'Buy a unicorn' }
];

let counter = 0;

export default class Todos extends Emitter {
  constructor() {
    super();
    this.list = this.load().map(todo => {
      if (todo.id) {
        return todo;
      }

      todo.id = ++counter;

      return todo;
    });
    this.store();
  }

  // persistence

  load() {
    var data = localStorage ? localStorage.getItem(KEY) : null;
    if (!data) return DEFAULTS;
    return JSON.parse(data);
  }

  store() {
    this.emit('change');
    if (localStorage) localStorage.setItem(KEY, JSON.stringify(this.list));
  }

  // read

  get(filter) {
    var list = clone(this.list);
    list.forEach((todo, x) => todo.id = x);
    return filter ? list.filter(filter) : list;
  }

  all() {
    return this.get();
  }

  active() {
    return this.get(todo => !todo.completed);
  }

  completed() {
    return this.get(todo => todo.completed);
  }

  // write

  add(title) {
    if (!title) return false;
    this.list.push({ title });
    this.store();
  }

  remove(x) {
    this.list.splice(x, 1);
    this.store();
  }

  toggle(x, force) {
    var todo = this.list[x];

    todo.completed = typeof force === 'boolean'
      ? force
      : !todo.completed;

    this.store();
  }

  toggleAll(force) {
    this.list.forEach((todo, x) => this.toggle(x, force));
    this.store();
  }

  title(x, title) {
    var todo = this.list[x];
    todo.title = title;
    this.store();
  }

  clear() {
    this.list = this.list.filter(todo => !todo.completed);
    this.store();
  }
  
  moveUp(id) {
    var item = this.list.filter(todo => id === todo.id);
    var itemInd = this.list.indexOf(item);

    this.list.splice(itemInd, 1);
    this.list.splice(itemInd - 1, 0, item);

    this.store();
  }
  
  moveDown(id) {
    
  }
}
