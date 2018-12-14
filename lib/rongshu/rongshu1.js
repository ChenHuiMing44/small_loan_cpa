

//整个过程分为几步
//1. 首先判断后端绑定的数据是不是被占用
//2. jsp(?)绑定数据 js判断是否取到
//3. 获取对应的html节点
//4. 插入值
//5. addEventListen添加监听 点击提交用的 
// （然后前4个肯定是写成promise的 就是四个function 当然数据要当参数带过去） 最后一个js的逻辑也放到promise里面去
import {billion_cpa_data} from "../../mock/rongshgu";
import "../../script"
// step 1
function verifyData() {
	if(window.billion_cpa_data){
		return
	}
	return Promise.reject("the billion_cap_data is exist");
}

//step 2
function getData() {
	let data = billion_cpa_data;

	if(data && data.data){
		return Promise.resolve({
			data: data
		})
	}
	return Promise.reject("the billion_cpa_data get error");
}

//step 3
function getElementNodeList(capData) {
	let nodeList = {};
	let selectorArr = {
		tel: ".item.requestPhone input"
	};
	let submitSelector = ".requestCoupon";

	for (let key in selectorArr) {
		let req = querySelect(selectorArr[key]);
		if(!req || req === "err"){
			return Promise.reject("get the insert node error; the func is { " + selectorArr[key] + " }")
		}
		nodeList[key] = req;
	}
	let submitNode = querySelect(submitSelector);
	if(!submitNode || submitNode === 'err'){
		return Promise.reject("get the submit node error; the func is { " + submitSelector + " }")
	}
	return Promise.resolve(
		Object.assign( capData , {
			submitNode: submitNode,
			submitSelector: submitSelector,
			nodeList: nodeList
		})
	)
}

//step 4
function insertValue(cpaData) {
	let nodeList = cpaData.nodeList;
	let dataList = cpaData.data.data;
	for(let key in nodeList){
		nodeList[key].value = dataList[key];
		nodeList[key].dispatchEvent(new Event('input'))
	}
	return Promise.reject(cpaData);
}

//step 5
function boundSubmit(cpaData) {

}



function querySelect(param) {
	let nodes = document.querySelectorAll(param);
	if(!nodes || nodes.length !== 1){
		return "err";
	}
	return nodes[0];
}


