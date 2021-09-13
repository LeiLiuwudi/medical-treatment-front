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
    API.getDisease().then((res) => {
      if(res.code==='200'){
        setDiseaseList(res.data);
      } else {
        warning(res.msg);
      }
    });
    API.getDoctors().then((res) => {
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
      id: values.patientId,
      name: values.name,
      birthday: moment(values.birthday).format("YYYY-MM-DD"),
      gender: values.gender,
      weight: values.weight,
      height: values.height,
      department: values.department,
      doctorId: values.doctorId,
      chief: values.chief,
      medicalHistory: values.medical_history,
      opinion: values.opinion,
      dieseaseId: values.diseaseId,
    };

    // 提交接口 调试成功
    API.addPatient(param).then((res) => {
      if (res.code === "200") {
        success("提交成功！");
        props.history.push("/admin/patientQuery");
      } else {
        warning(res.msg);
      }
    });
  };

  // 医院科室
  const departmentList = [
    "康复神经科",
    "普通外科",
    "普通内科"
  ];
  const doctors = [
    "汪亚群",
    "芦丹",
    "杨桂芬",
    "孙迪"
  ]
  const diseases = [
    "正常",
    "颈椎疲劳",
    "颈椎劳损",
    "颈椎强行性病变"
  ]
  const diseaseOptions = diseaseList.map((item) => {
    return <Option key={item.id} value={item.id}>{item.name}</Option>
  })

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
          name="department"
          label="科室"
          rules={[
            {
              required: true,
              message: "请选择科室!",
            },
          ]}
        >
          <Select placeholder="请选择科室">
            {departmentList.map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
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
          {doctors.map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="patientId"
          label="患者id"
          rules={[
            {
              required: true,
              message: "请输入患者id",
            },
          ]}
        >
          <Input type='number'/>
        </Form.Item>

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
        {/* <Form.Item
          name="birthday"
          label="出生日期"
          rules={[
            {
              required: true,
              message: "请输入患者出生日期",
              
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="gender"
          label="患者性别"
          rules={[
            {
              required: true,
              message: "请选择患者性别",
            },
          ]}
        >
          <Select>
            <Option value={1}>男</Option>
            <Option value={0}>女</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="height"
          label="身高(cm)"
          rules={[
            {
              required: true,
              message: "请输入患者身高",
            },
          ]}
        >
          <Input type='number'/>
        </Form.Item>

        <Form.Item
          name="weight"
          label="体重(kg)"
          rules={[
            {
              required: true,
              message: "请输入患者体重",
            },
          ]}
        >
          <Input type='number'/>
        </Form.Item> */}

        <Form.Item
          name="chief"
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
          name="medical_history"
          label="现病史"
          rules={[
            {
              message: "请输入病人现病史",
            },
          ]}
        >
          <TextArea placeholder="请输入病人现病史" />
        </Form.Item>

        <Form.Item
          name="medicals_history"
          label="既往史"
          rules={[
            {
              message: "请输入病人既往史",
            },
          ]}
        >
          <TextArea placeholder="请输入病人既往史" />
        </Form.Item>
        <Form.Item
          name="images"
          label="红外热像图"

        >
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            // fileList={fileList}
            // onPreview={this.handlePreview}
            // onChange={this.handleChange}
          ><Button></Button></Upload>
        </Form.Item>
        <Form.Item
          name="diseaseId"
          label="初步诊断"
          rules={[{ required: true, message: "请输入诊断意见" }]}
        >
          <Select placeholder="请选择疾病">
        
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
          name="opinion"
          label="诊断依据"
          rules={[{ required: true, message: "请输入诊断意见" }]}
        >
          <TextArea placeholder="请输入诊断依据" />
        </Form.Item>
        <Form.Item
          name="opinions"
          label="诊断意见"
          rules={[{ required: true, message: "请输入诊断意见" }]}
        >
          <TextArea placeholder="请输入诊断意见" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 150,
              marginLeft: 400,
            }}
          >
            提交
          </Button>
        </Form.Item>
        <Link to="/admin/addRecord">
          <Button
            type="primary"
            style={{
              width: 150,
              marginLeft: 400,
            }}
          >
            去添加病历
          </Button>
        </Link>
      </Form>
    </div>
  );
}

export default NewPatient;
