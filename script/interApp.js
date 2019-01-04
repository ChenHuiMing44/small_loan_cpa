import bridge from "dsbridge"


export const errorInfo = function (err) {
	bridge.call('BLTInjector.conllectException',err)
}

export const updateDate = function (params) {
	bridge.call('BLTInjector.conllectData',JSON.stringify(params))
}
