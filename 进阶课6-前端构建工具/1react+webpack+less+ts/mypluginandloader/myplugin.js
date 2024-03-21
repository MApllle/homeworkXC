class FileListPlugin{
    constructor({filename}){
        // 传入的参数挂载在这个类的实例上.
        this.filename = filename;
    }
    apply(compiler){
        compiler.hooks.emit.tap('FileListPlugin', (compilation)=>{
            // compilation 对象记录了一次构建到生成资源过程中的信息
            let assets = compilation.assets;
            let content = `# 文件详情 \n|文件名|资源大小|\n|---|---|\n`;
           // 遍历打包之后的文件列表
            Object.entries(assets).forEach(([filename,  stateObj])=>{
                content += `| ${filename} |   ${stateObj.size()}|\n`
            })

            // 每个文件都有 source (该文件内容) 和 size 该文件大小
            assets[this.filename] = {
                source(){
                    return content
                },
                size(){
                    return content.length
                }
            }
        })
    }
}

module.exports = FileListPlugin;
