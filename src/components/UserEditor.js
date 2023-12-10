import React from "react";
import {Form, Input, InputNumber, Select, Button, message } from 'antd';
import request from '../utils/request';

// import formProvider from "../utils/formProvider";
// import FormItem from "../components/FormItem";
import {createHashHistory} from 'history';
const history = createHashHistory;

const FormItem = Form.Item;

const formLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
};

export  default  class UserEditor extends React.Component {

  componentDidMount () {
      const {editTarget, form} = this.props;
      if(editTarget) {
          form.setFieldsValue(editTarget);
      }
  }


  handleSubmit = e => {
    e.preventDefault();
    
    const {form, editTarget} = this.props;

    form.validateFields((err, values) => {
        if(!err) {
            let editType = 'добавить';
            let apiUrl = 'http://localhost:3000/user';
            let method = 'post';
            if (editTarget) {
              editType = 'редактировать';
              apiUrl += '/' + editTarget.id;
              method = 'put';
            }

            request(method, apiUrl, values)
            .then(res => {
                if(res.id){
                    message.success(editType + 'Успех пользователя');
                    history.push('/user/list');
                }else {
                    message.error(editType + 'неудача');
                }
            })
            .catch(err => console.error(err))
        }else {
            message.warn(err);
        }
    })
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
        <div style={{width: '400px'}}>
            <Form onSubmit={e => this.handleSubmit(e)}>
                <FormItem label="имя пользователя:" {...formLayout}>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'пожалуйста, введите имя пользователя'
                            },
                            {
                                pattern: /^.{1,4}$/,
                                message: 'Имя пользователя может содержать до 4 символов'
                            }
                        ]
                    })(
                        <Input type="text" />
                    )}
                </FormItem>
                <FormItem label="возраст:" {...formLayout}>
                    {getFieldDecorator('age', {
                        rules: [
                            {
                                required: true,
                                message: 'Пожалуйста, введите свой возраст',
                                type: 'number'
                            },
                            {
                                min: 1,
                                max: 100,
                                message: 'Пожалуйста, введите свой возраст от 1 до 100',
                                type: 'number'
                            }
                        ]
                    })(
                        <InputNumber />
                    )}
                </FormItem>
                <FormItem label="пол" {...formLayout}>
                    {getFieldDecorator('gender', {
                        rules: [
                            {
                                required: true,
                                message: 'Пожалуйста, выберите пол'
                            }
                        ]
                    })(
                        <Select placeholder="пожалуйста, выбери">
                            <Select.Option value="male">мужской</Select.Option>
                            <Select.Option value="female">женский</Select.Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem wrapperCol={{...formLayout.wrapperCol, offset: formLayout.labelCol.span}}>
                    <Button type="primary" htmlType="submit">представлять на рассмотрение</Button>
                </FormItem>
            </Form>
        </div>
      
    );
  }
}


