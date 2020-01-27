import React from 'react'

const TodoItem = ({ name, id, isComplete, handleDelete, handleToggle }) =>
  <li className={isComplete ? 'completed' : null}>
    <div className="view">
      <input className="toggle" type="checkbox" checked={isComplete} onChange={() => handleToggle(id)}/>
      <label>
        {name}
      </label>
      <button className="destroy" onClick={() => handleDelete(id)}/>
    </div>
  </li>

export default props =>
  <ul className="todo-list">
    {props.todos.map(todo => <TodoItem key={todo.id} {...todo} handleDelete={props.handleDelete} handleToggle={props.handleToggle}/>)}
  </ul>
