import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react'
import styles from './index.module.css'

// Класс состояния и обработчиков

class Store {
   @observable state = {
      tasksList: [],
      currentTaskInput: '',
   }

   @action updateTaskInput(text) {
      this.state.currentTaskInput = text;
   }

   @action addTask() {
      if (this.state.currentTaskInput !== '') {
         let newTask = {
            id: Date.now(),
            text: this.state.currentTaskInput
         }
         this.state.tasksList.push(newTask)
         this.state.currentTaskInput = ''
      }
      else {
         alert('You tried to add empty task. Please, type something.')
      }
   }

   @action deleteTask(key) {
      this.state.tasksList = this.state.tasksList.filter(task => task.id !== key)
   }

   @action editTask(key, text) {
      this.state.tasksList.map(elem => key === elem.id ? elem.text = text : null)
   }

   @action getAppState() {
      if (localStorage.getItem('todo') !== null){
         this.state.tasksList = JSON.parse(localStorage.getItem('todo'))
      }
   }
}

const appStore = new Store();

// Компонент одного задания

const Task  = observer((props) => {

   let [isEdit, setEditmode] = useState(false)

   const deleteTask = (key) => {
      props.state.deleteTask(key)
   }

   const editTask = (e) => {
      let text = e.target.value
      props.state.editTask(props.id, text)
   }

   return (
         <div>
            {isEdit ?
               <input className = 'edit-task-true' autoFocus = {true} onBlur = {() => setEditmode(false)} onChange = {editTask} value = {props.text}></input> 
               : <li className = 'edit-task-false' onClick = {() => setEditmode(true)}>{props.text}</li>}
            <button className = 'delete-task' onClick = {() => deleteTask(props.id)}>Delete a task</button>
         </div>
   )
}
)

// Класс всего списка

@observer class TodoList extends React.Component {

   componentDidMount = () => {
      this.props.store.getAppState()
   }

   componentDidUpdate = () => {
      localStorage.setItem('todo', JSON.stringify(this.props.store.state.tasksList))
   }

   updateInput = (e) => {
      let text = e.target.value;
      this.props.store.updateTaskInput(text)
   }

   addTask = () => {
      this.props.store.addTask()
   }
   render(){
      const store = this.props.store
      return(
         <div className = {styles.todolist}>
            <h2>ToDo APP:</h2>
            <form>
               <input className = 'main-input' autoFocus = {true} placeholder = {'Write your task here'} onChange = {this.updateInput} value = {store.state.currentTaskInput}></input>
               <button onClick = {this.addTask} className = {'add-task'}>Add task</button>
            </form>
            <ul className = 'main-tasks_list'>
               {store.state.tasksList.map(task => <Task key = {task.id} id = {task.id} text = {task.text} state = {this.props.store}/>)}
            </ul>
         </div>
      )
   }
} 

class App extends React.Component {
   render() {
      return(
         <TodoList store = {appStore}/>
      )
   }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
