import React, { useState, useEffect, Component } from "react";
import { Table, Form, Checkbox, Row, Col, Button, Message, Modal, Select, Input } from "antd";
import API from "../../api/api";
import _ from "lodash";

const { Option } = Select;


class AccessControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalContent:[],
      form: null,
      data: [],
      user: [],
      children: [],
      modalSwitch: false,
      curData: {},
      allUsers: [],
      newRoleData:{},
      allUsersMap:{},
      addModalSwitch:false,
      isAdded:false,
      authorityList:[],
      defaultAuthorityList:[],
      plainOptions : [
        {label:"新建患者个人信息", value:"patientCreateAuthority"},
        {label:"病历查询", value:"recordQueryAuthority"},
        {label:"病历比较", value:"recordComparisonAuthority"},
        {label:"颈椎病分类识别", value:"identifyAuthorityAuthority"},
        {label:"效果评估", value:"effectEvaluationAuthority"},
        {label:"统计分析", value:"statAnalysisAuthority"},
        {label:"权限控制", value:"authorityManagement"},
        ]
    }
  }

  getUseInfo = () => {
    // todo
    // 发送请求获取权限列表
    API.getAccessList().then((res) => {
      if (res.code === "200") {
        for(var i = 0; i < res.data.length; i++) {
          res.data[i]["key"] = i;
        }
        let tempChildren = [];
        let tempAllUsers = []
        let tempAllUsersMap = {};
        for(var i = 0; i < res.data.length; i++) {
            tempChildren[i] = res.data[i]["containUserId"];
            tempAllUsersMap = Object.assign(tempAllUsersMap,res.data[i]["containUserMap"]);
            tempAllUsers = tempAllUsers.concat(res.data[i]["containUserId"]);
        }
        tempAllUsers = Array.from(new Set(tempAllUsers));
        this.setState({
          data: res.data,
          children: tempChildren,
          allUsers: tempAllUsers,
          allUsersMap: tempAllUsersMap
        })
      }
    });
   }

   showUpdateInfoModal = (key, data) => {
    let authorityList = [];
    this.state.plainOptions.map((element) => {
        if (data[key][element.value] == "1") {
            authorityList.push(element.value);
        }
    })
    this.setState({
        modalContent: data[key].containUserName,
        curData: data[key],
        newRoleData: data[key],
        modalSwitch: true,
        defaultAuthorityList: authorityList

    })
   }

   handleOK = () => {
       this.setState({
           modalSwitch: false,
           addModalSwitch: false,
       })
   }

   handleCancel = () => {
       this.setState({
           modalSwitch: false,
           addModalSwitch: false,
       })
   }

   showAddInfoModal = () => {
       this.setState({
        addModalSwitch:true,
        isAdded:true
       })
   }

   handleChange = (value) => {
    let newUserList = value;
    this.state.newRoleData.containUserName = value;
    this.refs.updateRoleForm.setFieldsValue({
        "name": this.state.curData.chineseName,
        "userList": this.state.curData.containUserName
    });
    let values = this.refs.updateRoleForm.getFieldsValue();
   }

   updateRole = () => {
       let oldValue = this.state.newRoleData;
       let values = this.refs.updateRoleForm.getFieldsValue();
       if (values.name == null || values.userList == null) {
           values.name = oldValue.chineseName;
           values.userList = oldValue.containUserId;
       }
    //    let param = JSON.stringify(values);
       let param = this.state.newRoleData;
       param.chineseName = values.name;
       param.containUserId = values.userList;
       let tempAuthorityList = this.state.authorityList;
       this.state.plainOptions.map((element) => {
           if (element.value in tempAuthorityList) {
               param[element.value] = 1;
           } else {
               param[element.value] = 0;
           }
       })
       tempAuthorityList.map((authority) => {
           param[authority] = 1;
       })
       API.updateRole(param).then((res) => {
           if(res.code == "200") {
               Message.success("更新成功！");
               this.setState({
                   modalSwitch:false
               })
           } else {
               Message.error("更新失败!");
               this.setState({
                   modalSwitch:false
               })
           }
       })
   }

   deleteRole = (key) => {
    let param = {"roleName":this.state.data[key].name};
    API.deleteRole(param).then((res) => {
        if(res.code == "200") {
            Message.success("删除成功！");
            this.setState({
                modalSwitch:false
            })
        } else {
            Message.error("删除失败!");
            this.setState({
                modalSwitch:false
            })
        }
    });
   }

   addRole = () => {
       let param = {
           "name" : null,
           "chineseName": null,
           "patientCreateAuthority": 0,
           "recordQueryAuthority": 0,
           "recordComparisonAuthority": 0,
           "identifyAuthorityAuthority": 0,
           "effectEvaluationAuthority": 0,
           "statAnalysisAuthority": 0,
           "authorityManagement": 0,
           "containUserId":[]
       }
       let values = this.refs.addRoleForm.getFieldsValue();
       param.name = values.name;
       param.chineseName = values.chineseName;
       let tempAuthorityList = this.state.authorityList;
       tempAuthorityList.map((authority) => {
           param[authority] = 1;
       })
       param.containUserId = values.userList;


       API.addRole(param).then((res => {
            if(res.code == "200") {
                Message.success("添加成功！");
                this.setState({
                    addModalSwitch:false
                })
            } else {
                Message.error("添加失败!");
                this.setState({
                    addModalSwitch:false
                })
            }
            window.location.reload();
       }));
   }

   onChangeCheckbox = (values) => {
       this.setState({
           authorityList: values
       })
   }

   componentDidMount() {
       this.getUseInfo();
   }

   render() {
        const plainOptions = this.state.plainOptions;
        const columns = [
           {
               title:"角色名称",
               dataIndex:"chineseName",
               width:"15%"
           },
           {
               title:"人员列表",
               dataIndex:"containUserId",
               width:"60%",
               render: (idArray) => {
                   return (
                       <div>
                           <p>{idArray.map(id => {
                               return this.state.allUsersMap[id];
                           }).join('， ')}</p>
                       </div>
                   )
               }
           },
           {
               title:"操作",
               dataIndex:"key",
               render: (key) => {
                   return (
                    <div>
                        <Button type="primary" style={{marginRight:20}} onClick={() => this.showUpdateInfoModal(key, this.state.data)}>
                        编辑
                        </Button>
                        <Button type="primary" style={{marginRight:20}} onClick={() => this.deleteRole(key)}>
                        删除
                        </Button>
                    </div>
                   )
               }
           }
       ];
       return (
        <div className="main-content">
        <h1
          style={{
            fontWeight: "bold",
            fontSize: "30px",
            textAlign: "center",
          }}
        >
          权限控制
        </h1>

        <Form component={false}>
            <Table
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            ></Table>
        </Form>

        <Modal
            visible={this.state.modalSwitch}
            title="权限修改"
            onOk={this.handleOK} 
            onCancel={this.handleCancel}
            onChange={this.handleChange}
            destroyOnClose
        >
            <Form
                layout="horizontal"
                preserve={false}
                onFinish={this.updateRole}
                ref="updateRoleForm"
                // style={{ marginBottom: 30, display: "flex" }}
            >
                <Form.Item name="name" label="角色名称：">
                    <Input 
                        defaultValue={this.state.curData.chineseName} 
                        placeholder="角色名称" 
                        style={{width:"50%"}}>
                    </Input>
                </Form.Item>
                <br/>
                <Form.Item name="userList" label="用户列表">
                    <Select placeholder="请选择用户" 
                            style={{width:'100%'}} 
                            mode="multiple"
                            defaultValue={this.state.curData.containUserId}
                            onChange={this.handleChange}
                    >
                        {this.state.allUsers.map((item) => {
                            return (
                                <Option key={item} value={item}>
                                    {this.state.allUsersMap[item]}
                                </Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <br /><br /><br /><br /><br /><br />
                <Checkbox.Group
                    style={{width:"100%"}}
                    onChange={this.onChangeCheckbox}
                    defaultValue={this.state.defaultAuthorityList}
                >
                    <Row>
                        {plainOptions.map((item) => {
                            return (
                                <Col span={8} key={item.label}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                            )
                        })}
                    </Row>
                </Checkbox.Group>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        提交修改
                    </Button>
                </Form.Item>
                
            </Form>

            <br/>

        </Modal>
        <Button type="primary" htmlType="submit" onClick = {() => this.showAddInfoModal()}>
            添加角色
        </Button>

        <Modal
            visible={this.state.addModalSwitch}
            title="增加角色"
            onOk={this.handleOK} 
            onCancel={this.handleCancel}
            onChange={this.handleChange}
            destroyOnClose
        >
            <Form
                layout="horizontal"
                preserve={false}
                onFinish={this.addRole}
                ref="addRoleForm"
                // style={{ marginBottom: 30, display: "flex" }}
            >
                <Form.Item name="name" label="角色编码：">
                    <Input 
                        placeholder="角色编码" 
                        style={{width:"50%"}}>
                    </Input>
                </Form.Item>
                <Form.Item name="chineseName" label="角色名称：">
                    <Input 
                        defaultValue={this.state.curData.chineseName} 
                        placeholder="角色名称" 
                        style={{width:"50%"}}>
                    </Input>
                </Form.Item>
                <Checkbox.Group
                    style={{width:"100%"}}
                    onChange={this.onChangeCheckbox}
                >
                    <Row>
                        {plainOptions.map((item) => {
                            return (
                                <Col span={8} key={item.label}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                            )
                        })}
                    </Row>
                </Checkbox.Group>
                <br/>
                <Form.Item name="userList" label="用户列表">
                    <Select placeholder="请选择用户" 
                            style={{width:'100%'}} 
                            mode="multiple"
                            // onChange={this.handleAddedChange}
                    >
                        {this.state.allUsers.map((item) => {
                            return (
                                <Option key={item} value={item}>
                                    {this.state.allUsersMap[item]}
                                </Option>
                            )
                        })}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" >
                        提交
                    </Button>
                </Form.Item>
                
            </Form>

            <br/>

        </Modal>


        </div>
       );
   }
}

export default AccessControl;
