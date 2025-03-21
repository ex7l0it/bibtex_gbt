# bibtex_gbt （自用）

> 本项目基于 Copilot 生成，可能存在一堆 Bug

论文 bibtex 参考文献 GB/T 7714-2015 格式检查工具

为方便检查参考文献格式是否统一，特开发此工具。


## 使用方法

- 将需要检查的 bibtex 参考文献粘贴到文本框中，点 **检查格式** 即可。
  - 同时会统计其中存在的会议论文、期刊论文的时间
  - 也会检查会议论文出版社地点（地点信息不全面，仅供参考）
- 如果必要字段均已存在，可以 **导出精简BibTex**，将不必要的字段去除。


## TODO

- [ ] 添加对字段内容的检查
  - [ ] 作者字段检查
  - [x] 出版社及地址字段检查 (地址数据存放在 `gbt7714-2015.js` 中)
  - [x] 剔除会议论文中的地址检查，剔除会议论文中的地址字段
- [ ] 增加更多类别的支持
- [ ] 自定义规则
- [ ] UI 美化
- [ ] 从 `.js` 里面读取地点信息打印到页面上
- [ ] 单独标识解析错误的条目，避免影响其他正常解析的条目
- [ ] ...

## 相关链接

- [计算机类学术论文 28个常见出版社一般写法（参考文献用） -- d0main](https://www.cnblogs.com/d0main/p/9462929.html)
- [中国计算机学会推荐国际学术会议和期刊目录（2022）](https://ccf.atom.im/)
- [GB/T 7714-2015信息与文献-参考文献著录规则](https://journal.ustc.edu.cn/uploadfile/yjsjy/20161108/GB%20T%207714-2015%E4%BF%A1%E6%81%AF%E4%B8%8E%E6%96%87%E7%8C%AE-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%E8%91%97%E5%BD%95%E8%A7%84%E5%88%99.pdf)

## Acknowledgement

- [Copilot](https://github.com/copilot)
- [bibtexParseJs](https://github.com/ORCID/bibtexParseJs)
