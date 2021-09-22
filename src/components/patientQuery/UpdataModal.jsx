import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, Modal,Row, Col} from "antd";
import moment from "moment";
import API from "../../api/api";

const { TextArea } = Input;
const { Option } = Select;

function UpdateModal(props) {
  const prePatientInfo = props.modalPatientInfo;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [diseaseList,setDiseaseList] = useState([])
  const [doctorList,setDoctorList] = useState([])
  


  useEffect(() => {
    setVisible(props.visible);
    API.getDoctorList().then((res) => {
      if(res.code==='200'){
        setDoctorList(res.data);
      } else {
        warning(res.msg);
      }
    });
  }, [props]);

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
    let param = values;
    param.dieseaseId = values.diseaseId;
    param.birthday = moment(values.birthday).format("YYYY-MM-DD");
    param.id = param.patientId;

    // 更新患者信息提交接口
    API.updatePatientInfo(param).then((res) => {
      console.log("res", res);
      if (res.code === "200") {
        success("更新成功！");
        hideModal();
      } else {
        warning(res.msg);
      }
    });
  };

  const hideModal = () => {
    setVisible(false);
    props.handleModalVisible(false);
  };

  // 医院科室
  const departmentList = [
    "脊柱骨科",
    "骨外科",
    "普通外科",
    "神经外科",
    "心胸外科",
  ];

  const diseaseOptions = diseaseList.map((item) => {
    return <Option key={item.id} value={item.id}>{item.name}</Option>
  })
  const filterDisease = diseaseList.filter((item) =>{
    return item.name === prePatientInfo.disease;
  });
  const initialValues = {
    department: prePatientInfo.department,
    doctorId: prePatientInfo.doctorId,
    patientId: prePatientInfo.id,
    name: prePatientInfo.name,
    birthday: moment(prePatientInfo.birthday),
    gender: prePatientInfo.gender,
    height: prePatientInfo.height,
    weight: prePatientInfo.weight,
    chief: prePatientInfo.chief,
    medical_history: prePatientInfo.medicalHistory,
    diseaseId: filterDisease.length > 0 ? filterDisease[0].id : undefined,
    opinion: prePatientInfo.opinion,
  };

  const doctorOptions = doctorList.map((item) => {
    return <Option key={item.id} value={item.id}>{item.name}</Option>
  })

  return (
    <Modal
      title={`更新患者信息——${prePatientInfo.id}——${prePatientInfo.name}`}
      visible={visible}
      width={1000}
      onCancel={() => hideModal()}
      footer={null}
    >
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={initialValues}
      >
        <Row>
          <Col span={6}>
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
          </Col>
          <Col span={6}>
            <Form.Item
              name="doctorId"
              label="主治医生id"
              rules={[
                {
                  required: true,
                  message: "请输入主治医生id",
                },
              ]}
            >
              <Select placeholder="请选择医生">{doctorOptions}</Select>
            </Form.Item>
          </Col>
          <Col span={6}>
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
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              name="name"
              label="姓名"
              rules={[
                {
                  required: true,
                  message: "请输入患者姓名",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
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
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
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
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              name="height"
              label="身高"
              rules={[
                {
                  required: true,
                  message: "请输入患者身高",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="weight"
              label="体重"
              rules={[
                {
                  required: true,
                  message: "请输入患者体重",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} style={{marginLeft:'20px'}}>
            <Form.Item
              name="diseaseId"
              label="  疾病"
            >
              <Select placeholder="请选择疾病">{diseaseOptions}</Select>
            </Form.Item>
          </Col>
        </Row>
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
          name="opinion"
          label="诊断意见"
          rules={[{ required: true, message: "请输入诊断意见" }]}
        >
          <TextArea placeholder="请输入病人主诉" />
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
            确定更新患者信息
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateModal;
