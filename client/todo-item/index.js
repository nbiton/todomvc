
import bus from 'bus';
import { dom } from 'deku';
import { ENTER, ESCAPE } from '../keycodes';


var propTypes = {
  todo: { type: 'object' }
};

function afterRender({ state }, el) {
  if (state.editing && !state.title) {
    var input = el.querySelector('input.edit');
    input.focus();
    input.select();
  }
}

function render({ props, state }, setState) {
  let { todo } = props;
  let { editing } = state;

  let { id, completed, title } = todo;
  var classes = { completed, editing };

  let dragStartPos;

  function dragmove(e) {
    //console.log('drag move');
    if (e.clientY > dragStartPos + 30) {
      //console.log('moved down');
      bus.emit('todo:moveDown', id);
    } else if (e.clientY < dragStartPos - 30) {
      //console.log('moved up');
      bus.emit('todo:moveUp', id);
    }
  }

  function destroy() {
    bus.emit('todo:remove', id);
  }

  function edit() {
    setState({ editing: true });
  }

  function cancel() {
    setState({
      editing: false,
      title: null
    });
  }

  function save() {
    bus.emit('todo:title', id, state.title);

    setState({
      editing: false,
      title: null
    });
  }

  function toggle() {
    bus.emit('todo:toggle', id);
  }

  function onKeyUp(e) {
    if (e.keyCode === ESCAPE) {
      cancel();
    } else if (e.keyCode === ENTER) {
      save();
    } else {
      setState({ title: e.target.value });
    }
  }

  function startDragging(e) {
    //console.log('started dragging', e);
    dragStartPos = e.clientY;
    //document.body.addEventListener('mousemove', dragmove);
  }
  
  function stopDragging(e) {
    //console.log('stopped dragging', e);
    //document.body.removeEventListener('mousemove', dragmove);
  }

  return (
    <li class={classes}>
      <div class="view" onDoubleClick={edit} onDragStart={startDragging} onDragEnd={stopDragging} onDrag={dragmove} draggable="true">
        <input class="toggle" type="checkbox" checked={completed} onChange={toggle} />
        <label>{title}</label>
        <button class="destroy" onClick={destroy}></button>
      </div>
      <input class="edit" value={title} onKeyUp={onKeyUp} />
    </li>
  );
}

export default { propTypes, afterRender, render };
