/* 
  할 일 목록을 관리하고 렌더링하는 주요 컴포넌트입니다.
  상태 관리를 위해 `useState` 훅을 사용하여 할 일 목록과 입력값을 관리합니다.
  할 일 목록의 추가, 삭제, 완료 상태 변경 등의 기능을 구현하였습니다.
*/
import React, { useState, useRef } from "react";
import TodoItem from "@/components/TodoItem";
import styles from "@/styles/TodoList.module.css";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';


// TodoList 컴포넌트를 정의합니다.
const TodoList = () => {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const dateInputRef = useRef(null);

  // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  const addTodo = () => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "") return;
    // 기존 할 일 목록에 새로운 할 일을 추가하고, 입력값을 초기화합니다.
    // {
    //   id: 할일의 고유 id,
    //   text: 할일의 내용,
    //   completed: 완료 여부,
    // }
    // ...todos => {id: 1, text: "할일1", completed: false}, {id: 2, text: "할일2", completed: false}}, ..
    setTodos([...todos, { id: Date.now(), text: input + " " + date, completed: false }]);
    setInput("");
    setDate("");
    dateInputRef.current._flatpickr.clear(); 
  };


  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    setTodos(
      // todos.map((todo) =>
      //   todo.id === id ? { ...todo, completed: !todo.completed } : todo
      // )
      // ...todo => id: 1, text: "할일1", completed: false
      todos.map((todo) => {
        return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
      })
    );
  };

  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  const deleteTodo = (id) => {
    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTodo();
    }
  };

  const handleDateSelect = (selectedDates) => {
    setDate(selectedDates[0].toLocaleDateString());
    dateInputRef.current._flatpickr.close(); // Close the date picker
    dateInputRef.current.blur(); // Remove focus from the date input
  };

  

  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.container}>
      <h1>Todo List</h1>
      {/* 할 일을 입력받는 텍스트 필드입니다. */}
      <input
        type="text"
        className={styles.itemInput}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        type="text"
        className={styles.dateInput}
        placeholder="Select a date"
        ref={dateInputRef}
        onFocus={() => {
          flatpickr(dateInputRef.current, {
            dateFormat: "d/m/Y",
            onValueUpdate: handleDateSelect,
          });
        }}
      />
      {/* 할 일을 추가하는 버튼입니다. */}
      <button className={styles.addButton} onClick={addTodo}>
        Add Todo
      </button>
      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
