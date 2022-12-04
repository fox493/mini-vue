const target = {
	foo : 1
}

const depsMap = new Map()
const targetMap = new Map()

targetMap.set(target, depsMap)

console.log(targetMap)