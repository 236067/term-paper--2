import {createHashHistory} from 'history';
import Icon from "antd/es/icon";
import React from 'react';
import { Form, Input, Button, message} from 'antd';
import {post} from '../utils/request';
require('../styles/login-page.css');
const history = createHashHistory;
const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if(!err) {
                post('http://localhost:3000/login', values)
                    .then(res => {
                        message.info('Приземлился успешно');
                        history.push('/');
                    })
            }else {
                message.info('Не удалось войти в систему, неправильный аккаунт или пароль.');
            }
        })
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className='wrapper'>
                <div className='body'>
                    <header className='header'>ReactManager</header>
                    <section className='form'>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem>
                                {getFieldDecorator('account', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Пожалуйста, войдите в учетную запись администратора',
                                            type: 'string'
                                        }
                                    ]
                                })(
                                    <Input type="text" addonBefore={<Icon type="user" />} />
                                )}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Пожалуйста введите пароль',
                                            type: 'string'
                                        }

                                    ]
                                })(
                                    <Input type="password" addonBefore={<Icon type="lock" />} />
                                )}
                            </FormItem>

                            <Button className='btn' type="primary" htmlType="submit">Sign In</Button>
                        </Form>
                    </section>
                </div>
            </div>
        )
    }
}

Login=Form.create()(Login);
export default Login;