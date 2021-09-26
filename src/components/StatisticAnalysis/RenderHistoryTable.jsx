import React, { Component } from "react";
import { Table, Button } from "antd";
import _ from "lodash";
import moment from "moment";

class RenderHistoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  calculateAge(time) {
    let date = new Date(time);
    let today = new Date().getTime();
    return Math.ceil((today - date) / 31536000000);
  }

  // 渲染历史治疗记录表格
  renderHistoryTable = () => {
    const columns = [
      {
        title: "患者id",
        dataIndex: "id",
        key: "id",
        width: "6%",
      },
      {
        title: "患者姓名",
        dataIndex: "name",
        key: "name",
        width: "6%",
      },
      {
        title: "主治医生",
        dataIndex: "doctorName",
        width: "6%",
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: "6%",
        render: (gender) => {
          return gender === 1 ? "男" : "女";
        },
      },
      {
        title: "年龄",
        dataIndex: "birthday",
        width: "6%",
        render: (birthday) => {
          return this.calculateAge(birthday);
        },
      },
      {
        title: "职业",
        dataIndex: "profession",
        width: "8%",
      },
      {
        title: "初步诊断结果",
        dataIndex: "initialDiagnosis",
        width: "10%",
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        width: "10%",
      },
      {
        title: "操作",
        dataIndex: "operation",
        width: "14%",
        align: "center",
        render: (text, record, index) => {
          return (
            <Button
              type="primary"
              // size="small"
              style={{ marginRight: "5px" }}
              onClick={() => this.props.changeState(record)}
            >
              选定当前
            </Button>
          );
        },
      },
    ];

    const data = [];

    function getDesFromClassification(classification) {
      const map = {
        0: "正常",
        1: "疲劳",
        2: "炎性改变",
        3: "颈椎负荷过重",
        4: "颈肩综合症，颈椎退行性，颈椎病",
        100: "",
      };
      return map[classification];
    }

    (this.props.historyRecords || []).map((item, index) => {
      let record = {};
      record.key = index;
      record.count = item.treatCount;
      record.time = moment(item.timeBefore).format("YYYY-MM-DD HH:mm:ss");
      console.log(item.timeBefore);
      record.infImage = item.infraAfterPath;
      record.infImageDes = getDesFromClassification(
        _.get(item, "classificationBefore", 100)
      );
      record.MRI = "";
      record.MRIDes = "";
      record.CT = "";
      record.CTDes = "";
      data.push(record);
    });

    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条`;
      },
      showSizeChanger: false,
      total: data.length, //数据总数
      defaultCurrent: 1, //默认当前页
      pageSize: 3, //每页条数
    };

    return (
      <Table
        bordered="true"
        columns={columns}
        dataSource={this.props.historyRecords}
        scroll={{ x: "max-content", y: 600 }}
        pagination={paginationProps}

      />
    );
  };

  render() {
    return <>{this.renderHistoryTable()}</>;
  }
}

export default RenderHistoryTable;
