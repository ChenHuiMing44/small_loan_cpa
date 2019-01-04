import {updateDate,errorInfo} from "../../script/interApp";


// step 1
function verifyData() {
	if(window.billion_cpa_data){
		return Promise.reject("the billion_cap_data is exist");
	}
	return Promise.resolve();
}

//step 2
function getData() {
	let bindStr  = '${billion_cpa_data}';
	let data;
	try {
		data = JSON.parse(bindStr);
	}catch (e) {
		return Promise.resolve("the billion_cpa_data format error");
	}
	//
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
		phoneNo: "[name=userMp]"
	};
	let submitSelector = "#submit";



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
	capData = capData || {};
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
		if(dataList[key] != null){
			nodeList[key].focus();
			nodeList[key].value = dataList[key];
			nodeList[key].dispatchEvent(new Event('input'))
		}
	}
	return Promise.resolve(cpaData);
}

//step 5
function bindSubmit(cpaData) {
	let submitNode = cpaData.submitNode;
	submitNode.addEventListener("click",r => {
		Promise.resolve().then(getElementNodeList).then(r => {
			//点击事件  且获取完成节点
			let nodeList = r.nodeList;
			let dataList = cpaData.data.data;
			for(let key in nodeList) {
				dataList[key] = nodeList[key].value;
			}
			//提交数据
			updateDate(dataList);
		}).catch(err => {
			errorInfo(document.location.href + err)
		})
	})
}

//step 自定义额外代码
function extraCode(cpaData) {

	return Promise.resolve(cpaData);
}


function querySelect(param) {
	let nodes = document.querySelectorAll(param);
	if(!nodes || nodes.length !== 1){
		return "err";
	}
	return nodes[0];
}

//主函数
Promise.resolve().then(verifyData).then(getData).then(getElementNodeList).then(insertValue).then(bindSubmit)
	.catch(err => {
		errorInfo(document.location.href + err)
	})


