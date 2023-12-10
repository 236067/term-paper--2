import React from "react";
import PropTypes from "prop-types";
import {message, Table, Button, Popconfirm } from 'antd';
import {get, del} from '../utils/request';


class UserList extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
      };
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    };
  }

  componentDidMount() {
    get("http://localhost:3000/user").then(res => {
      this.setState({
        userList: res
      });
    });
  }

  handleEdit = (user) => {
      this.context.router.history.push('/user/edit/' + user.id);
  }
  handleDel = (user) => {
    del('http://localhost:3000/user/' + user.id)
      .then(res => {
          this.setState((prevState) => ({
              userList: prevState.userList.filter(item => item.id !== user.id )
          }));
          message.success('Удаление пользователя успешно');
      })
      .catch(err => {
          console.error(err);
          message.error('Не удалось удалить пользователя');
      })
  }
  render() {
    const { userList } = this.state;

    const columns = [
        {
            title: 'ID пользователя',
            dataIndex: 'id'
        },
        {
            title: 'имя пользователя',
            dataIndex: 'name'   
        },
        {
            title: 'пол',
            dataIndex: 'gender'
        },
        {
            title: 'возраст',
            dataIndex: 'age'
        },
        {
            title: 'действовать',
            render: (text, record) => {
                return (
                    <Button.Group type="ghost">
                        <Button size="small" onClick={() => this.handleEdit(record)}>редактировать</Button>
                        <Popconfirm title="Вы уверены, что хотите удалить его？" onConfirm={() => this.handleDel(record)}>
                            <Button size="small">удалить</Button>
                        </Popconfirm>
                    </Button.Group>
                )
            }
        }
    ];

    return (
        <Table columns={columns} dataSource={userList} rowKey={row => row.id}/>
        
    );
  }
}
export default UserList;
