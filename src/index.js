import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react'
import styles from './index.module.css'

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
         debugger
         localStorage.setItem('todo', JSON.stringify(this.state.tasksList))
         this.state.currentTaskInput = ''
      }
      else {
         alert('You tried add empty value to the field. Please, type something.')
      }
   }

   @action deleteTask(key) {
      this.state.tasksList = this.state.tasksList.filter(task => task.id !== key)
      localStorage.setItem('todo', JSON.stringify(this.state.tasksList))
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

@observer class Task extends React.Component {
   @observable localState = {
      isEdit: false,
      currentEditInput: ''
   }

   setEditMode = (value) => {
      this.localState.isEdit = value
   }

   deleteTask = (key) => {
      this.props.state.deleteTask(key)
   }

   editTask = (e) => {
      let text = e.target.value
      this.props.state.editTask(this.props.id, text)
   }

   render(){
      return (
         <div>
            {this.localState.isEdit ?
               <input className = 'edit-task-true' autoFocus = {true} onBlur = {() => this.setEditMode(false)} onChange = {this.editTask} value = {this.props.text}></input> 
               : <li className = 'edit-task-false' onClick = {() => this.setEditMode(true)}>{this.props.text}</li>}
            <button className = 'delete-task' onClick = {() => this.deleteTask(this.props.id)}>Delete a task</button>
         </div>
      )
      }
}

@observer class TodoList extends React.Component {

   componentDidMount = () => {
      this.props.store.getAppState()
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
            <form onSubmit = {this.addTask}>
               <input className = 'main-input' autoFocus = {true} placeholder = {'What do we need?'} onChange = {this.updateInput} value = {store.state.currentTaskInput}></input>
               <button className = {'add-task'}>Add task</button>
            </form>
            <ul className = 'main-tasks_list'>
               {store.state.tasksList.map(task => <Task id = {task.id} text = {task.text} state = {this.props.store}/>)}
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
