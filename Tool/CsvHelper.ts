/**
 * 物品管理
 */

import UIHelper from "../../Game/Module/UIHelper";



var STATETYPE =
{
    NewFieldStart: 1,// 新字段开始
    NonQuotesField: 2,// 非引号字段
    QuotesField: 3,// 引号字段
    FieldSeparator: 4,// 字段分隔
    QuoteInQuotesField: 5,// 引号字段中的引号
    RowSeparator: 6,// 行分隔符字符1，回车
    Error: 7,// 语法错误
};

var Row = function () {
    this.m_header = [];
    this.m_values = [];
    this.push_back = function (value) {
        this.m_values.push(value);
    };

    this.setHeader = function (header) {
        this.m_header = header;
    };

    this.getSize = function () {
        return this.m_values.length;
    };

    this.getValueByKey = function (key) {
        for (var i = 0; i < this.m_header.length; ++i) {
            if (this.m_header[i] === key) {
                return this.m_values[i];
            }
        }
        UIHelper.log("error: no key by m_values!");
        return null;
    };
};


export default class CsvHelper {


    private m_content = [];
    private m_header = [];

    private Fields = null;
    private strField = '';

    private mStateType = STATETYPE.NewFieldStart;

    public loadCsv(fileName, callBack): void {
        var self = this;
        self.m_content.length = 0;
        self.m_header.length = 0;
        self.Fields = new Row();
        self.strField = "";
        self.mStateType = STATETYPE.NewFieldStart;

        let fileUrl = "res/csv/" + fileName;
        Laya.loader.create(fileUrl, Laya.Handler.create(this, function (data) {
            for (var i = 0, size = data.length; i < size; ++i) {
                var ch = data[i];
                switch (self.mStateType) {
                    case STATETYPE.NewFieldStart: { // 新字段开始
                        if (ch == '"') {
                            self.mStateType = STATETYPE.QuotesField;
                        }
                        else if (ch == ',') {
                            self.Fields.push_back("");
                            self.mStateType = STATETYPE.FieldSeparator;
                        }
                        else if (ch == '\r' || ch == '\n') {
                            UIHelper.log("语法错误：有空行");
                            self.mStateType = STATETYPE.Error;
                        }
                        else {
                            self.strField += ch;
                            self.mStateType = STATETYPE.NonQuotesField;
                        }
                    }
                        break;

                    case STATETYPE.NonQuotesField: { // 非引号字段
                        if (ch == ',') {
                            self.Fields.push_back(self.strField);
                            self.strField = "";
                            self.mStateType = STATETYPE.FieldSeparator;
                        }
                        else if (ch == '\r') {
                            self.Fields.push_back(self.strField);
                            self.mStateType = STATETYPE.RowSeparator;
                        }
                        else {
                            self.strField += ch;
                        }
                    }
                        break;

                    case STATETYPE.QuotesField: { // 引号字段
                        if (ch == '"') {
                            self.mStateType = STATETYPE.QuoteInQuotesField;
                        }
                        else {
                            self.strField += ch;
                        }
                    }
                        break;

                    case STATETYPE.FieldSeparator: { // 字段分隔
                        if (ch == ',') {
                            self.Fields.push_back("");
                        }
                        else if (ch == '"') {
                            self.strField = "";
                            self.mStateType = STATETYPE.QuotesField;
                        }
                        else if (ch == '\r') {
                            self.Fields.push_back("");
                            self.mStateType = STATETYPE.RowSeparator;
                        }
                        else {
                            self.strField += ch;
                            self.mStateType = STATETYPE.NonQuotesField;
                        }
                    }
                        break;

                    case STATETYPE.QuoteInQuotesField: { // 引号字段中的引号
                        if (ch == ',') {
                            // 引号字段闭合
                            self.Fields.push_back(self.strField);
                            self.strField = "";
                            self.mStateType = STATETYPE.FieldSeparator;
                        }
                        else if (ch == '\r') {
                            // 引号字段闭合
                            self.Fields.push_back(self.strField);
                            self.mStateType = STATETYPE.RowSeparator;
                        }
                        else if (ch == '"') {
                            // 转义
                            self.strField += ch;
                            self.mStateType = STATETYPE.QuotesField;
                        }
                        else {
                            UIHelper.log("语法错误： 转义字符 \" 不能完成转义 或 引号字段结尾引号没有紧贴字段分隔符");
                            self.mStateType = STATETYPE.Error;
                        }
                    }
                        break;

                    case STATETYPE.RowSeparator: { // 行分隔符字符1，回车
                        if (ch == '\n') {
                            self.m_content.push(self.Fields);
                            self.Fields = new Row(); // self.Fields.clear();
                            self.strField = "";
                            self.mStateType = STATETYPE.NewFieldStart;
                        }
                        else {
                            UIHelper.log("语法错误： 行分隔用了回车 \\r。但未使用回车换行 \\r\\n ");
                            self.mStateType = STATETYPE.Error;
                        }
                    }
                        break;

                    case STATETYPE.Error: {
                        // 语法错误 modify by self
                        //                return;
                    }
                        break;

                    default:
                        break;
                }
            }

            switch (self.mStateType) {
                case STATETYPE.NewFieldStart: {
                    // Excel导出的CSV每行都以/r/n结尾。包括最后一行
                }
                    break;

                case STATETYPE.NonQuotesField: {
                    self.Fields.push_back(self.strField);
                    self.m_content.push(self.Fields);
                }
                    break;

                case STATETYPE.QuotesField: {
                    UIHelper.log("语法错误： 引号字段未闭合");
                }
                    break;

                case STATETYPE.FieldSeparator: {
                    self.Fields.push_back("");
                    self.m_content.push(self.Fields);
                }
                    break;

                case STATETYPE.QuoteInQuotesField: {
                    self.Fields.push_back(self.strField);
                    self.m_content.push(self.Fields);
                }
                    break;

                case STATETYPE.RowSeparator: {

                }
                    break;

                case STATETYPE.Error: {

                }
                    break;

                default: break;
            }

            self.setHeader();
            self.m_content = self.contentToJson(self.m_content);
            callBack(self.m_content);

        }), null, Laya.Loader.TEXT);
    }

    private contentToJson(content: Array<any>): Array<any> {
        var jsonArray = [];
        for (var i = 1; i < content.length; ++i) {
            var jsonObj = {};
            var headerObj = content[i].m_header;
            var valueObj = content[i].m_values;
            for (var j = 0; j < headerObj.length; ++j) {
                var value = valueObj[j];
                value = value.replaceAll('\\\\n', '\n');
                jsonObj[headerObj[j]] = value;
            }
            jsonArray.push(jsonObj);
        }
        return jsonArray;
    }

    private setHeader(): void {
        this.m_header.length = 0;
        for (var i = 0; i < this.m_content[0].m_values.length; i++) {
            this.m_header.push(this.m_content[0].m_values[i]);
        }
        for (var i = 0; i < this.m_content.length; i++) {
            this.m_content[i].setHeader(this.m_header);
        }
    }

}