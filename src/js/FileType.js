export default{
    isCode: (fileName)=>{
        const codeSuffix = ['.cpp', '.html', '.js', '.java', '.c', '.py', '.css', '.php', '.json', '.vue', '.jsp']
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return codeSuffix.indexOf(fileSuffix.toLowerCase()) !== -1
    },
    isApk: (fileName)=>{
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return fileSuffix.toLowerCase() === '.apk'
    },
    isTxt: (fileName)=>{
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return fileSuffix.toLowerCase() === '.txt'
    },
    isExe: (fileName)=>{
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return fileSuffix.toLowerCase() === '.exe'
    },
    isPdf: (fileName)=>{
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return fileSuffix.toLowerCase() === '.pdf'
    },
    isWord: (fileName)=>{
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return fileSuffix.toLowerCase() === '.doc' || fileSuffix.toLowerCase() === '.docx'
    },
    isExcel: (fileName)=>{
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return fileSuffix.toLowerCase() === '.xls' || fileSuffix.toLowerCase() === '.xlsx'
    },
    isImg: (fileName)=>{
        const imgSuffix = ['.jpg', '.jpeg', '.png', '.icon', '.bmp', '.gif']
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return imgSuffix.indexOf(fileSuffix.toLowerCase()) !== -1
    },
    isCompress: (fileName)=>{
        const imgSuffix = ['.zip', '.rar', '.7z', '.iso']
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return imgSuffix.indexOf(fileSuffix.toLowerCase()) !== -1
    },
    isMusic: (fileName)=>{
        const imgSuffix = ['.mp3', '.wma', '.wav', '.rm']
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return imgSuffix.indexOf(fileSuffix.toLowerCase()) !== -1
    },
    isVideo: (fileName)=>{
        const imgSuffix = ['.mp4'] // , '.avi', '.flv', '.mov'
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return imgSuffix.indexOf(fileSuffix.toLowerCase()) !== -1
    },
    isPPT: (fileName)=>{
        const imgSuffix = ['.ppt'] // , '.avi', '.flv', '.mov'
        const fileSuffix = fileName.substr(fileName.lastIndexOf('.'))
        return imgSuffix.indexOf(fileSuffix.toLowerCase()) !== -1
    },


}