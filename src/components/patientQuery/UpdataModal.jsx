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
    param.id = prePatientInfo.id;
    param.doctorId = values.doctor.split(",")[0];
    param.doctorName = values.doctor.split(",")[1];
    param.birthday = moment(values.birthday).format("YYYY-MM-DD");
    

    // 更新患者信息提交接口
    API.updatePatient(param).then((res) => {
      console.log("res", res);
      if (res.code === "200") {
        success("更新成功！");
        props.queryPatient();
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

  const diseaseOptions = diseaseList.map((item) => {
    return <Option key={item.id} value={item.id}>{item.name}</Option>
  })
  const initialValues = {
    name: prePatientInfo.name,
    doctor: prePatientInfo.doctorId + "," + prePatientInfo.doctorName,
    gender: prePatientInfo.gender,
    birthday: moment(prePatientInfo.birthday),
    profession: prePatientInfo.profession,
    chiefComplaint: prePatientInfo.chiefComplaint,
    presentHistory: prePatientInfo.presentHistory,
    pastHistory: prePatientInfo.pastHistory,
    initialDiagnosis: prePatientInfo.initialDiagnosis,
    diagnoseBasis: prePatientInfo.diagnoseBasis,
  };

  const doctorOptions = doctorList.map((item) => {
    return <Option key={item.id} value={item.id+","+item.name}>{item.name}</Option>
  })

  return (
    <Modal
      title={`更新患者信息`}
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
              name="name"
              label="患者姓名"
              rules={[
                {
                  required: true,
                  message: "请输入患者姓名",
                },
              ]}
            >
              <Input placeholder="请输入患者姓名"/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="doctor"
              label="主治医生"
              rules={[
                {
                  required: true,
                  message: "请选择主治医生",
                },
              ]}
            >
              <Select placeholder="请选择医生">{doctorOptions}</Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="gender"
              label="患者性别"
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
              name="profession"
              label="患者职业"
              style={{
                marginLeft: 10,
              }}
            >
              <Input placeholder="请输入患者职业"/>
            </Form.Item>
          </Col>
        </Row>
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
          label="初始诊断"
          rules={[{ required: true, message: "请输入初始诊断结果" }]}
        >
          <TextArea placeholder="请输入病人初始诊断结果" disabled/>
        </Form.Item>
        <Form.Item
          name="diagnoseBasis"
          label="诊断依据"
          rules={[{ required: true, message: "请输入诊断依据" }]}
        >
          <TextArea placeholder="请输入诊断依据" disabled/>
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
