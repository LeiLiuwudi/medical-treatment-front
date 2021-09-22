import React , { useState, useEffect } from "react";
import { Upload,Form, Input, Select, Button, DatePicker, Modal } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import API from "../../api/api";
import "./new-patient.less";
// require("react-dom");
// window.React2 = require("react");
// console.log(window.React1 === window.React2);
const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 10 },
  },
};

function NewPatient(props) {
  const [form] = Form.useForm();
  const [diseaseList,setDiseaseList] = useState([])
  const [doctorList,setDoctorList] = useState([])

  useEffect( () => {
    API.getDoctorList().then((res) => {
      if(res.code==='200'){
        setDoctorList(res.data);
      } else {
        warning(res.msg);
      }
    });
  },[props])
  const success = (msg) => {
    Modal.success({
      title: msg,
    });
  };

  const warning = (msg) => {
    Modal.warning({
      title: msg,
    });
  };

  const onFinish = (values) => {
    let param = {
      name: values.name,
      doctorId: values.doctorId,
      gender: values.gender,
      birthday: moment(values.birthday).format("YYYY-MM-DD"),
      profession: values.profession,
      chiefComplaint: values.chiefComplaint,
      presentHistory: values.presentHistory,
      pastHistory: values.pastHistory,
      initialDiagnosis: values.initialDiagnosis,
      diagnoseBasis: values.diagnoseBasis,
    };

    // 提交接口 调试成功
    API.addPatient(param).then((res) => {
      if (res.code === "200") {
        success("提交成功！");
      } else {
        warning(res.msg);
      }
    });
  };

  const diseases = [
    "正常",
    "颈椎疲劳",
    "颈椎劳损",
    "颈椎强行性病变"
  ]

  const doctorOptions = doctorList.map((item) => {
    return <Option key={item.id} value={item.id}>{item.name}</Option>
  })
  return (
    <div className="main-content">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          department: "脊柱骨科",
        }}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="患者姓名"
          rules={[
            {
              required: true,
              message: "请输入患者姓名",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="doctorId"
          label="主治医生"
          rules={[
            {
              required: true,
              message: "请输入主治医生!",
            },
          ]}
        >
          <Select placeholder="请选择医生">
          {doctorOptions}
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          label="患者性别"
        >
          <Select placeholder="请选择患者性别">
            <Option value={1} >男</Option>
            <Option value={0}>女</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="birthday"
          label="出生日期"
          rules={[
            {
              required: true,
              message: "请输入患者出生日期",
              
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} placeholder = "请输入患者出生日期"/>
        </Form.Item>

        <Form.Item
          name="profession"
          label="职业"
        >
          <Input placeholder="请输入病人职业" />
        </Form.Item>
        <Form.Item
          name="chiefComplaint"
          label="主诉"
          rules={[
            {
              required: true,
              message: "请输入病人主诉",
            },
          ]}
        >
          <TextArea placeholder="请输入病人主诉" />
        </Form.Item>

        <Form.Item
          name="presentHistory"
          label="现病史"
        >
          <TextArea placeholder="请输入病人现病史" />
        </Form.Item>

        <Form.Item
          name="pastHistory"
          label="既往史"
        >
          <TextArea placeholder="请输入病人既往史" />
        </Form.Item>
        
        <Form.Item
          name="initialDiagnosis"
          label="初步诊断"
          rules={[{ required: true, message: "请输入诊断意见" }]}
        >
          <Select placeholder="请选择诊断结果">
        
            {diseases.map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          
          </Select>
        </Form.Item>
        <Form.Item
          name="diagnoseBasis"
          label="诊断依据"
          rules={[{ required: true, message: "请输入诊断依据" }]}
        >
          <TextArea placeholder="请输入诊断依据" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 150,
              marginTop:100,
              marginLeft: "90%" ,
            }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default NewPatient;
