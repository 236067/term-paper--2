import React from 'react';
import PropTypes from "prop-types";
import {message, Table, Button, Popconfirm } from 'antd';
import { get, del } from '../utils/request';


class BookList extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
      };
    constructor (props) {
        super(props);
        this.state = {
            bookList: []
        }
    }

    componentDidMount () {
        get('http://localhost:3000/book')
            .then(res => {
                this.setState({
                    bookList: res
                })
            })
    }

    handleEdit = (book) => {
        this.context.router.history.push('/book/edit/' + book.id);
    }

    handleDel = (book) => {
        del('http://localhost:3000/book/' + book.id)
            .then(res => {
                this.setState((prevState) => ({
                    bookList: prevState.bookList.filter(item => item.id !== book.id)
                }));
                message.success('Книга успешно удалена');
            })
            .catch(err => {
                console.log(err);
                message.error('Не удалось удалить книгу')
            })
    }

    render () {
        const {bookList} = this.state;

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: 'Заголовок книги',
                dataIndex: 'name'
            },
            {
                title: 'цена',
                dataIndex: 'price',
                render: (text, record) => <span>&yen; {record.price / 100}</span>
            },
            {
                title: 'Идентификатор владельца',
                dataIndex: 'owner_id'
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Button.Group type="ghost">
                        <Button size="small" onClick={() => this.handleEdit(record)}>редактировать</Button>
                        <Popconfirm 
                            placement="topLeft" 
                            title="Вы уверены, что хотите удалить его?"
                            okText="Yes" 
                            cancelText="No" 
                            onConfirm={() => this.handleDel(record)}>
                            <Button size="small">удалить</Button>
                        </Popconfirm>
                    </Button.Group>
                )
            }
        ];

        return (
            <Table columns={columns} dataSource={bookList} rowKey={row => row.id} />
            
        )
    }
}

export default BookList;