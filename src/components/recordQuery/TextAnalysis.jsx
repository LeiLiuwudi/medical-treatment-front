import React, { Component } from 'react';
import { Input, Icon, Button, br, Row, Divider, Tooltip, Tag, DatePicker, Message, Drawer, Col, Modal } from "antd";
import './text-analysis.less';
import API from '../../api/api';
class TextAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medRecord: {},
            simMedRecord: {},
            diseaseList: [],
        }
    }

    //   处理下载按钮
    handleDownload() {
        Message.success("敬请期待");
    }
    // 处理开始分析按钮
    handleAnalyse(record) {
        let text = record.chfCmp + '。' + record.hisPreIll + "。" + record.prvMedHis;
        this.callAnalysis(text);
    }
    callAnalysis(record) {
        let param = {
            record: record
        }
        API.getAnalyseResult(param).then((response) => {
            let _data = response.data,
                _code = response.code,
                _msg = response.msg;
            if (_code === "200") {
                let diseaseId = _data.disease_id;
                let simRecordId = _data.record_id;
                this.handleAnalyseResult(diseaseId, simRecordId);    // 更新电子病历的响应字段
            } else {
                Message.error(_msg);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
    //   将分析结果更新数据库
    handleAnalyseResult(diseaseId, simRecordId) {
        let param = {
            id: this.props.match.params.id,
            analysisStatus: 1,
            diagnosticResult: diseaseId,
            similarRecord: simRecordId
        }
        API.handleAnalyseResult(param).then((response) => {
            let _data = response.data,
                _code = response.code,
                _msg = response.msg;
            console.log(_data);
            if (_code === "200") {
                window.location.reload();  // 刷新页面
            } else {
                Message.error(_msg);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    //   根据生日获取年龄
    getAge(birthday) {
        //出生时间 毫秒
        var birthDayTime = new Date(birthday).getTime();
        //当前时间 毫秒
        var nowTime = new Date().getTime();
        //一年毫秒数(365 * 86400000 = 31536000000)
        return Math.ceil((nowTime - birthDayTime) / 31536000000);
    }

    //   根据病种id获取病种
    getDisease(status, diseaseId) {
        if (status == 0) {
            return "尚未分析";
        }
        let disease = "诊断异常";
        console.log(diseaseId);
        console.log(this.state.diseaseList);
        this.state.diseaseList.forEach(element => {
            if (element.id == diseaseId) {
                disease = element.disease;
            }
        });
        return disease;
    }
    //   获取病种列表
    getDiseaseList() {
        API.getDisease()
            .then((response) => {
                let _data = response.data,
                    _code = response.code,
                    _msg = response.msg;
                if (_code === "200") {
                    this.setState({
                        diseaseList: _data
                    })

                } else {
                    this.setState({
                        diseaseList: null
                    })
                }
            }).catch(function (error) {
                console.log(error);
            });
    }
    //   获取相似电子病历id
    getMedRecord(medRecordId) {
        let param = {
            id: medRecordId
        }
        API.getSimRecord(param).then((response) => {
            let _data = response.data,
                _code = response.code,
                _msg = response.msg;
            if (_code === "200") {
                // console.log(_data.data);
                this.setState({
                    medRecord: _data.record,
                    simMedRecord: _data.simRecord
                })
                // console.log("medRecord:", this.medRecord);
                // console.log("simMedRecord", this.simMedRecord);
            } else if (_code === "302") {
                Message.error(_msg);
                setTimeout(() => {
                    this.props.history.replace("/login");
                }, 1000);
            } else {
                Message.error(_msg);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    //   页面渲染前执行函数
    componentDidMount() {
        console.log(1)
        let id = this.props.match.params.id
        console.log(id)
        this.getMedRecord(id)
        this.getDiseaseList()
    }

    //   渲染的页面
    render() {
        return (
            <div className="main-content">
                <b>基本信息</b>
                <Divider />
                <Row justify="space-between">
                    <Col span={4}>
                        <strong>姓名:</strong><span style={{ marginLeft: 15 }}>{this.state.medRecord.name}</span>
                    </Col>
                    <Col span={4}>
                        <strong>主治医生:</strong><span style={{ marginLeft: 15 }}>{this.state.medRecord.doctorName}</span>
                    </Col>
                    <Col span={4}>
                        <strong>性别:</strong><span style={{ marginLeft: 15 }}>{this.state.medRecord.gender == 1 ? "男" : "女"}</span>
                    </Col>
                    <Col span={4}>
                        <strong>年龄:</strong><span style={{ marginLeft: 15 }}>{this.getAge(this.state.medRecord.birthday)}</span>
                    </Col>
                    <Col span={4}>
                        <strong>病种:</strong><span style={{ marginLeft: 15 }}>{this.getDisease(this.state.medRecord.analysisStatus, this.state.medRecord.diagnosticResult)}</span>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={() => this.handleAnalyse(this.state.medRecord)}>开始分析</Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => this.handleDownload()}>病历下载</Button>
                    </Col>
                </Row>

                <Divider />
                <b>病历对比</b>
                <Divider />
                <Row justify="space-between">
                    <Col span={2}>
                        <div className="m-box">病历字段</div>
                    </Col>
                    <Col span={10}>
                        <div className="m-box">患者病历</div>
                    </Col>
                    <Col span={10}>
                        <div className="m-box">相似病历</div>
                    </Col>
                </Row>
                <br />
                <Row justify="space-between">
                    <Col span={2}>
                        <div className="m-box">主诉</div>
                    </Col>
                    <Col span={10}>
                        {this.state.medRecord.chfCmp}
                    </Col>
                    <Col span={10} style={{ marginLeft: 15 }}>
                        {this.state.simMedRecord.chfCmp}
                    </Col>
                </Row>
                <br />
                <Row justify="space-between">
                    <Col span={2}>
                        <div className="m-box">现病史</div>
                    </Col>
                    <Col span={10}>{this.state.medRecord.hisPreIll}</Col>
                    <Col span={10} style={{ marginLeft: 15 }}> {this.state.simMedRecord.hisPreIll}</Col>
                </Row>
                <br />
                <Row justify="space-between">
                    <Col span={2}>
                        <div className="m-box">既往史</div>
                    </Col>
                    <Col span={10}>{this.state.medRecord.prvMedHis}</Col>
                    <Col span={10} style={{ marginLeft: 15 }}>{this.state.simMedRecord.prvMedHis}</Col>
                </Row>
                <br />
                <Row justify="space-between">
                    <Col span={2}>
                        <div className="m-box">个人史</div>
                    </Col>
                    <Col span={10}>{this.state.medRecord.perHis}</Col>
                    <Col span={10} style={{ marginLeft: 15 }}>{this.state.simMedRecord.perHis}</Col>
                </Row>
                <br />
                <Row justify="space-between">
                    <Col span={2}>
                        <div className="m-box">家族史</div>
                    </Col>
                    <Col span={10}>{this.state.medRecord.famHis}</Col>
                    <Col span={10} style={{ marginLeft: 15 }}>{this.state.simMedRecord.famHis}</Col>
                </Row>
                <Divider />
                <b>治疗建议</b>
                <Divider />
                <Row>
                    <Col>
                        <strong>治疗建议：</strong><div className='setformat'>{this.state.medRecord.treAdv} </div>
                    </Col>
                </Row>
            </div>)
    }
}

export default TextAnalysis;