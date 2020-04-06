const projectList = '/api/projects';
const projectManage = '/api/project';
const linkList = '/api/links';
const linkManage = '/api/link';
const planList = '/api/plans';
const planManage = '/api/plan';
const planTestEnv = '/api/plan/PLAN_ID/testEnv';
const testList = '/api/plan/PLAN_ID/tests';
const testAdd = '/api/plan/PLAN_ID/test';
const testOperation = '/api/test/';
const planGotoDeploy = '/api/plan/PLAN_ID/gotoDeploy';
const deployList = '/api/deploys';
const deployManage = '/api/deploy';
const deployExportDate = '/api/exportDate/deploys';
const postDeploy = '/api/postDeploy/';
const commentDeploy = '/api/commentDeploy/';
const commentList = '/api/deploy/DEPLOY_ID/comments';
const commentAdd = '/api/deploy/DEPLOY_ID/comment';
const commentDelete = '/api/comment/';
const logList = '/api/logs';
const health = '/api/health';
const environmentList = '/api/environments';
const environmentManage = '/api/environment';
const taskList = '/api/tasks';
const taskManage = '/api/task';
const taskOperation = '/api/taskOperation/OPERATION';
const testTaskList = '/api/testTasks';
const testTaskManage = '/api/testTask';
const testTaskOperation = '/api/testTaskOperation/OPERATION';
const testTaskReport = '/api/testTaskReport/'
const userList = '/api/users';
const userManage = '/api/user';
const userOperation = '/api/userOperation/OPERATION';
const loginApi = '/api/login';
const logoutApi = '/api/logout';
const changePassword = '/api/changePassword';
const aboutPage = '/api/about';
const flagData = '/api/flag';
const uploadReport = '/api/upload';
const removeReport = '/api/remove/';
const fileDownload = '/api/download/';
const questionList = '/api/questions';
const questionManage = '/api/question';
const questionOperation = '/api/questionOperation/OPERATION';
const requireList = '/api/requires';
const requireManage = '/api/require';
const requireOperation = '/api/requireOperation/OPERATION';
const imageList = '/api/images';
const imageOperation = '/api/image/';
const imageHistoryList = '/api/images/history';
const imageHistoryCheck = '/api/images/historyCheck/';
const rackList = '/api/racks';
const rackManage = '/api/rack';
const deviceList = '/api/devices';
const deviceManage = '/api/device';
const regionList = '/api/regions';
const regionManage = '/api/region';
const productList = '/api/products';
const productManage = '/api/product';
const topoList = '/api/topos';
const topoManage = '/api/topo/';
const k8sModifyRc = '/api/k8s/modifyRC';
const k8sRcConfigExecute = '/api/k8s/executeRcConfig/';
const k8sRcConfigsList = '/api/k8s/rcConfigs';
const k8sRcConfigManage = '/api/k8s/rcConfig';
const cicdList = '/api/cicd/strategies';
const cicdManage = '/api/cicd/strategy';
const cicdOperation = '/api/cicd/strategyOperation/OPERATION';
const cicdTaskList = '/api/cicd/tasks';

export default {
    projectList,
    projectManage,
    linkList,
    linkManage,
    planList,
    planManage,
    planTestEnv,
    testList,
    testAdd,
    testOperation,
    planGotoDeploy,
    deployList,
    deployManage,
    deployExportDate,
    commentList,
    commentAdd,
    commentDelete,
    logList,
    health,
    environmentList,
    environmentManage,
    taskList,
    taskManage,
    taskOperation,
    testTaskList,
    testTaskManage,
    testTaskOperation,
    testTaskReport,
    userList,
    userManage,
    userOperation,
    loginApi,
    logoutApi,
    changePassword,
    aboutPage,
    flagData,
    postDeploy,
    commentDeploy,
    uploadReport,
    removeReport,
    fileDownload,
    questionList,
    questionManage,
    questionOperation,
    requireList,
    requireManage,
    requireOperation,
    imageList,
    imageOperation,
    imageHistoryList,
    imageHistoryCheck,
    rackList,
    rackManage,
    deviceList,
    deviceManage,
    regionList,
    regionManage,
    productList,
    productManage,
    topoList,
    topoManage,
    k8sModifyRc,
    k8sRcConfigExecute,
    k8sRcConfigsList,
    k8sRcConfigManage,
    cicdList,
    cicdManage,
    cicdOperation,
    cicdTaskList,
}