import React from "react";
import formProvider from "../utils/formProvider";
import FormItem from "../components/FormItem";
import {createHashHistory} from 'history';
const history = createHashHistory;
// import request from '../utils/request';

class UserEditor extends React.Component {

  componentDidMount () {
      const {editTarget, setFormValues} = this.props;
      if(editTarget) {
          setFormValues(editTarget);
      }
  }
  handleSubmit = e => {
    e.preventDefault();
    
        const {form: {name, age, gender}, formValid, editTarget} = this.props;
        if (!formValid) {
          alert('Пожалуйста, заполните правильную информацию и повторите попытку.');
          return;
        }
    
        let editType = 'добавить ';
        let apiUrl = 'http://localhost:3000/user';
        let method = 'post';
        if (editTarget) {
          editType = 'редактировать';
          apiUrl += '/' + editTarget.id;
          method = 'put';
        }
    
        fetch(apiUrl, {
          method,
          body: JSON.stringify({
            name: name.value,
            age: age.value,
            gender: gender.value
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.id) {
              alert(editType + 'Успех пользователя');
              history.push('/user/list')
              return;
            } else {
              alert(editType + 'неудача');
            }
          })
          .catch((err) => console.error(err));

  };

  render() {
    const { form: { name, age, gender }, onFormChange } = this.props;
    return (
        <form onSubmit={e => this.handleSubmit(e)}>
          <FormItem label="имя пользователя:" valid={name.valid} error={name.error}>
            <input
              type="text"
              value={name.value}
              onChange={e => onFormChange("name", e.target.value)}
            />
          </FormItem>
          <FormItem label="возраст：" valid={age.valid} error={age.error}>
            <input
              type="text"
              value={age.value}
              onChange={e => onFormChange("age", e.target.value)}
            />
          </FormItem>
          <FormItem label="пол:" valid={gender.valid} error={gender.error}>
            <select
              value={gender.value}
              onChange={e => onFormChange("gender", e.target.value)}
            >
              <option value="">пожалуйста, выбери</option>
              <option value="male">мужской</option>
              <option value="female">женский</option>
            </select>
          </FormItem>
          <br />
          <input type="submit" value="представлять на рассмотрение" />
        </form>
    );
  }
}

UserEditor = formProvider({
  name: {
    defaultValue: "",
    rules: [
      {
        pattern: function(value) {
          return value.length > 0;
        },
        error: "пожалуйста, введите имя пользователя"
      },
      {
        pattern: /^.{1,4}$/,
        error: "Имя пользователя может содержать до четырех символов"
      }
    ]
  },
  age: {
    defaultValue: 0,
    rules: [
      {
        pattern: function(value) {
          return value >= 1 && value <= 100;
        },
        error: "Пожалуйста, введите свой возраст от 1 до 100"
      }
    ]
  },
  gender: {
    defaultValue: "",
    rules: [
      {
        pattern: function(value) {
          return !!value;
        },
        error: "Пожалуйста, выберите пол"
      }
    ]
  }
})(UserEditor);

export default UserEditor;
