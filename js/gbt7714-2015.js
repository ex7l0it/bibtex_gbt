
const GBT7714_2015 = {
    // 定义信息
    entryClasses: {
        // 专著：以单行本或多卷册（在限定的期限内出齐）形式出版的印刷型或非印刷型出版物，包括普通图书、古籍、学位论文、会议文集、汇编、标准、报告、多卷书、丛书等
        monograph: [  
            "book", // 普通图书(M)
            "thesis", // 学位论文(D)
            "standard", // 标准(S)
        ],
        // 专著的析出文献：如会议论文、期刊论文
        monographPart: [
            "inproceedings", // 会议论文(C)
        ],
        // 连续出版物：通常载有年卷期号或年月日顺序号，并计划无限期连续出版发行的印刷或非印刷形式的出版物
        // 连续出版物的析出文献：如期刊论文
        serialPart: [
            "article", // 期刊论文(J)
        ],
        // 电子资源：以数字方式将图、文、声、像等信息储存在磁、光、电介质上，通过计算机、网络或相关设备使用的记录有知识内容或艺术内容的信息资源，包括电子公告、电子图书、电子期刊、数据库等
        electronic: [
            "online", // 网络资源(EB)
            "software", // 计算机程序(CP)
        ],
        // TODO: 其他
    },
    // 强制要求的格式信息
    formats: {
        // 专著：主要责任者.题名：其他题名信息[文献类型标识]其他责任者.版本项.出版地：出版者，出版年：引文页码[引用日期].获取和访问路径.数字对象唯一标识符.
        book: [
            "author", // 主要责任者
            "title", // 题名
            "address", // 出版地
            "publisher", // 出版者
            "year", // 出版年
        ],
        mastersthesis: [
            "author", // 主要责任者
            "title", // 题名
            "year", // 出版年
            "address", // 出版地
            "school", // 学位授予单位
        ],
        phdthesis: [
            "author", // 主要责任者
            "title", // 题名
            "year", // 出版年
            "address", // 出版地
            "school", // 学位授予单位
        ],
        standard: [ // ISO 标准文档等
            "title", // 题名
            "number", // 标准号
            "year", // 出版年
        ],
        // TODO: report, patent...
        
        // 专著的析出文献：析出文献主要责任者.析出文献题名[文献类型标识].析出其他责任者//专著主要责任者.专著题名：其他题名信息.版本项.出版地：出版者，出版年：析出文献的页码[引用日期].获取和访问路径.数字对象唯一标识符.
        inproceedings: [
            "author", // 主要责任者
            "title", // 题名
            "booktitle", // 专著题名
            "address", // 出版地
            "publisher", // 出版者
            "year", // 出版年
            "pages", // 页码
        ],
        // 连续出版物中的析出文献：析出文献主要责任者.析出文献题名[文献类型标识].连续出版物题名：其他题名信息，出版年，卷(期)：页码[引用日期].获取和访问路径.数字对象唯一标识符.
        article: [
            "author", // 主要责任者
            "title", // 题名
            "journal", // 期刊名
            "year", // 出版年
            "volume", // 卷
            "number", // 期
            "pages", // 页码
        ],
        // 预印刊 arXiv (仍使用 article, 其 journal 字段以 arXiv preprint 开头)
        arxiv: [
            "author", // 主要责任者
            "title", // 题名
            "journal", // 期刊名, 例如 arXiv preprint arXiv:2406.11931
            "year", // 出版年
        ],
        // 电子资源：主要责任者.题名：其他题名信息[文献类型标识].出版地：出版者，出版年：引文页码(更新或修改日期)[引用日期].获取和访问路径.数字对象唯一标识符.
        online: [
            "author", // 主要责任者
            "title", // 题名
            "url", // 获取和访问路径
            "date", // 更新或修改日期
            "urldate", // 引用日期
        ],
        // software 以 github 项目为例
        software: [ 
            "author", // 主要责任者
            "title", // 题名
            "url", // 获取和访问路径
            "date", // 更新或修改日期
            "urldate", // 引用日期
        ],
        // TODO: 其他
    },
    datas: {
        // 出版社地址
        "addresses": {
            "IEEE": "Piscataway, NJ",
            "IEEE/ACM": "Piscataway, NJ",
            "ACM": "New York, NY",
            "ACM/IEEE": "New York, NY",
            "USENIX": "Berkeley, CA",
            "Springer": "Berlin, Germany",
            "Springer-Verlag": "Berlin, Germany",
            "Curran Associates.": "New York, NY",
            "ACL": "Stroudsburg, PA",
            // 无法检索到 JMLR 的地址，暂不检查
            // PMLR 是一个在线出版平台，专门发表在各类会议和研讨会上展示的机器学习研究论文。PMLR并非传统意义上的出版社，因此没有固定的实体地址。暂不检查
            // OpenReview.net 是一个在线出版平台，专门发表在各类会议和研讨会上展示的计算机科学研究论文。OpenReview.net 并非传统意义上的出版社，因此没有固定的实体地址。暂不检查
        }
    }
}