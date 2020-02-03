import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react'
import styles from './index.module.css'
import { Button, Form, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl } from 'react-bootstrap';

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
               <FormControl className = 'edit-task-true' autoFocus = {true} onBlur = {() => setEditmode(false)} onChange = {editTask} value = {props.text}></FormControl> 
               : <li className = {styles.edit_task_false} onClick = {() => setEditmode(true)}>{props.text}</li>}
            <Button size = "sm" variant = "dark" onClick = {() => deleteTask(props.id)}>Delete a task</Button>
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
            <h2>ToDo APP</h2>
            <Form inline>
               <FormControl type="text" autoFocus = {true} placeholder="Type your task here" onChange = {this.updateInput} value = {store.state.currentTaskInput} className="mr-sm-2" />
               <Button variant="outline-success" onClick = {this.addTask}>Add new task</Button>
            </Form>
            <ListGroup className = {styles.maintasks_list} variant = "flush">
               {store.state.tasksList.map(task => <ListGroup.Item> <Task key = {task.id} id = {task.id} text = {task.text} state = {this.props.store}/> </ListGroup.Item>)}
            </ListGroup>
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
