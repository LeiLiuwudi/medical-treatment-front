import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import _ from "lodash";

class FileWall extends React.Component {
  state = {
    fileList: [],
    file: {},
  };

  componentDidMount() {
    const fileList = _.get(this.props.fileInfo, "fileList", []);
    this.setState({
      fileList,
    });
  }

  handleFileChange = async (fileInfo) => {
    console.log("fileInfo", fileInfo);
    let { file, fileList } = fileInfo;
    this.setState({ fileList, file });
    this.props.handleFileChange(fileInfo, process);
  };

  render() {
    const props = {
      name: "file",
      headers: {
        authorization: "authorization-text",
      },
      // onChange(info) {
      //   console.log("info", info);
      //   this.handleFileChange(info);
      //   if (info.file.status !== "uploading") {
      //     console.log(info.file, info.fileList);
      //   }
      //   if (info.file.status === "done") {
      //     message.success(`${info.file.name} file uploaded successfully`);
      //   } else if (info.file.status === "error") {
      //     message.error(`${info.file.name} file upload failed.`);
      //   }
      // },
    };
    return (
      <Upload {...props} onChange={this.handleFileChange}>
        <Button icon={<UploadOutlined />}>点击上传文件</Button>
      </Upload>
    );
  }
}

export default FileWall;
